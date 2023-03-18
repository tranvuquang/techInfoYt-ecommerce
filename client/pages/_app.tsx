import "../styles/globals.css";
import "antd/dist/reset.css";
import "bootstrap/dist/css/bootstrap.min.css";
import "react-toastify/dist/ReactToastify.css";
import "../styles/AuthStyles.scss";
import "../styles/HomePage.scss";
import { store, wrapper } from "../app/store";
import App, { AppContext, AppProps } from "next/app";
import { setAccessTokenRedux, setUserRedux } from "../features/auth/authSlice";
import { graphqlClient, queryClient } from "../graphql-client/config";
import { ApolloProvider } from "@apollo/client";
import { useMemo } from "react";
import { NextComponentType, NextPageContext } from "next";

import { getTokenFromCookie, getUser } from "../helpers";
import { useAppDispatch } from "../app/hooks";
import { getUserQuery } from "../graphql-client/queries";
import { ToastContainer } from "react-toastify";

interface MyAppProps extends AppProps {
  Component: NextComponentType<NextPageContext, any, any>;
  pageProps: {
    accessToken: string;
    user: {
      id: string;
      email: string;
    };
  };
}

function MyApp({ Component, pageProps }: MyAppProps) {
  const dispatch = useAppDispatch();
  const { accessToken, user } = pageProps;

  // save accessToken va user vao redux server side
  useMemo(() => {
    dispatch(setAccessTokenRedux(accessToken));
    dispatch(setUserRedux(user));
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
  let { user } = getState().auth;
  const accessToken = getTokenFromCookie(appContext);
  let { id, email } = getUser(accessToken);
  user = { ...user, id, email };
  store.dispatch(setAccessTokenRedux(accessToken));
  store.dispatch(setUserRedux(user));
  console.log("01a _app.tsx");
  try {
    // neu co accessToken o cookies reload lai trang va lay them thong tin, save accessToken va user vao redux server side va pageProps
    if (!user.name && accessToken) {
      const userData = await queryClient(accessToken, dispatch, getUserQuery, {
        id,
      });
      if (userData) {
        const { name, phone, address, answer, role } = userData.data.getUser;
        user = { ...user, name, phone, address, answer, role };
        dispatch(setUserRedux(user));
        console.log("01b _app.tsx lay them data cho user");
        return {
          pageProps: {
            ...appProps.pageProps,
            accessToken,
            user,
          },
        };
      }
    }

    return {
      pageProps: {
        ...appProps.pageProps,
        accessToken,
        user,
      },
    };
  } catch (error: any) {
    console.log("1c get data error : ", error.message);
    return {
      pageProps: {
        ...appProps.pageProps,
        accessToken,
        user,
      },
    };
  }
};

export default wrapper.withRedux(MyApp);
