import "../styles/globals.css";
import "antd/dist/reset.css";
import "bootstrap/dist/css/bootstrap.min.css";
import "react-toastify/dist/ReactToastify.css";
import "../styles/AuthStyles.scss";
import "../styles/HomePage.scss";
import { wrapper } from "../app/store";
import App, { AppContext, AppProps } from "next/app";
import {
  selectAuth,
  setAccessTokenRedux,
  setCategoriesRedux,
  setUserRedux,
} from "../features/auth/authSlice";
import { graphqlClient } from "../graphql-client";
import { ApolloProvider } from "@apollo/client";
import { useMemo } from "react";
import { NextComponentType, NextPageContext } from "next";
import { getInitialPropsApp } from "../helpers";
import { useAppDispatch, useAppSelector } from "../app/hooks";
import { ToastContainer } from "react-toastify";
import { ICategory } from "../features/auth/types";
import { selectProduct, setCartFromCookieToRedux } from "../features/product/productSlice";
import { IProduct } from "../features/product/types";

interface MyAppProps extends AppProps {
  Component: NextComponentType<NextPageContext, any, any>;
  pageProps: {
    accessToken: string;
    user: {
      id: string;
      email: string;
    };
    categories: ICategory[];
    cart: IProduct[];
  };
}

function MyApp({ Component, pageProps }: MyAppProps) {
  const dispatch = useAppDispatch();
  const {} = useAppSelector(selectAuth);
  const {} = useAppSelector(selectProduct);
  const { accessToken, user, categories, cart } = pageProps;

  // save accessToken va user vao redux client side
  useMemo(() => {
    dispatch(setAccessTokenRedux(accessToken));
    dispatch(setUserRedux(user));
    dispatch(setCategoriesRedux(categories));
    dispatch(setCartFromCookieToRedux(cart));
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  const client = graphqlClient(pageProps.accessToken);
  return (
    <ApolloProvider client={client}>
      <ToastContainer />
      <div id="root">
        <Component {...pageProps} />
      </div>
    </ApolloProvider>
  );
}

MyApp.getInitialProps = async (appContext: AppContext) => {
  return await getInitialPropsApp(appContext, App);
};

export default wrapper.withRedux(MyApp);
