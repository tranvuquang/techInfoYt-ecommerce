import "../styles/globals.css";
import "antd/dist/reset.css";
import "bootstrap/dist/css/bootstrap.min.css";
import "react-toastify/dist/ReactToastify.css";
import "../styles/AuthStyles.scss";
import "../styles/HomePage.scss";
import { store, wrapper } from "../app/store";
import App, { AppContext, AppProps } from "next/app";
import {
  setAccessTokenRedux,
  setCategoriesRedux,
  setUserRedux,
} from "../features/auth/authSlice";
import { graphqlClient, queryClient } from "../graphql-client/config";
import { ApolloProvider } from "@apollo/client";
import { useMemo } from "react";
import { NextComponentType, NextPageContext } from "next";

import { getTokenFromCookie, getUser } from "../helpers";
import { useAppDispatch } from "../app/hooks";
import { getUserQuery } from "../graphql-client/auth";
import { ToastContainer } from "react-toastify";
import { getCategoriesQuery } from "../graphql-client/category";
import { ICategory } from "../features/auth/types";

interface MyAppProps extends AppProps {
  Component: NextComponentType<NextPageContext, any, any>;
  pageProps: {
    accessToken: string;
    user: {
      id: string;
      email: string;
    };
    categories: ICategory[];
  };
}

function MyApp({ Component, pageProps }: MyAppProps) {
  const dispatch = useAppDispatch();
  const { accessToken, user, categories } = pageProps;

  // save accessToken va user vao redux client side
  useMemo(() => {
    dispatch(setAccessTokenRedux(accessToken));
    dispatch(setUserRedux(user));
    dispatch(setCategoriesRedux(categories));
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  const client = graphqlClient(pageProps.accessToken);
  return (
    <ApolloProvider client={client}>
      <ToastContainer />
      <div id="root">
        <Component {...pageProps} />;
      </div>
    </ApolloProvider>
  );
}

MyApp.getInitialProps = async (appContext: AppContext) => {
  const appProps = await App.getInitialProps(appContext);
  const { getState, dispatch } = store;
  let { user, categories } = getState().auth;
  const accessToken = getTokenFromCookie(appContext);
  let { id, email } = getUser(accessToken);
  user = { ...user, id, email };
  store.dispatch(setAccessTokenRedux(accessToken));
  store.dispatch(setUserRedux(user));
  console.log("01a _app.tsx");
  try {
    

    // chua dang nhap van lay categories data
    if (!accessToken && categories.length === 0) {
      const categoriesData = await queryClient(
        accessToken,
        dispatch,
        getCategoriesQuery
      );
      categories = categoriesData?.data.getCategories;
      dispatch(setCategoriesRedux(categories));
      console.log(
        "1b _app.tsx lay thong tin categories luu props va redux server side"
      );
      return {
        pageProps: {
          ...appProps.pageProps,
          accessToken,
          user,
          categories,
        },
      };
    }

    // neu co accessToken o cookies reload lai trang va lay them thong tin, save accessToken va user vao redux server side va pageProps
    if ((!user.name || categories.length === 0) && accessToken) {
      const userData = await queryClient(accessToken, dispatch, getUserQuery, {
        id,
      });
      const categoriesData = await queryClient(
        accessToken,
        dispatch,
        getCategoriesQuery
      );
      const { name, phone, address, answer, role } = userData?.data.getUser;
      user = { ...user, name, phone, address, answer, role };
      dispatch(setUserRedux(user));
      categories = categoriesData?.data.getCategories;
      dispatch(setCategoriesRedux(categories));
      console.log(
        "1c _app.tsx lay them thong tin cho user va categories luu props va redux server side"
      );
      return {
        pageProps: {
          ...appProps.pageProps,
          accessToken,
          user,
          categories,
        },
      };
    }
    return {
      pageProps: {
        ...appProps.pageProps,
        accessToken,
        user,
        categories,
      },
    };
  } catch (error: any) {
    console.log("1d get data error : ", error.message);
    return {
      pageProps: {
        ...appProps.pageProps,
        accessToken,
        user,
        categories,
      },
    };
  }
  return {
    pageProps: {
      ...appProps.pageProps,
      accessToken,
      user,
      categories,
    },
  };
};

export default wrapper.withRedux(MyApp);
