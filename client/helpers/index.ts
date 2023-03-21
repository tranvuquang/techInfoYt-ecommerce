import App, { AppContext } from "next/app";
import { getCookie } from "cookies-next";
import jwt_decode from "jwt-decode";
import { store } from "../app/store";
import {
  setAccessTokenRedux,
  setCategoriesRedux,
  setUserRedux,
} from "../features/auth/authSlice";
import { setCartFromCookieToRedux } from "../features/product/productSlice";
import { getUserQuery } from "../graphql-client/auth";
import { getCategoriesQuery } from "../graphql-client/category";
import { queryClient } from "../graphql-client/config";

export const getValueFromCookie = (key: string, { ctx }: AppContext) => {
  let result = null;
  const json = getCookie(key, { req: ctx.req });
  if (json) {
    result = JSON.parse(json as string);
  }
  return result;
};

export const getUser = (token: string) => {
  let user = {
    id: "",
    email: "",
  };
  if (token) {
    const { id, email } = jwt_decode(token) as any;
    user = { id, email };
  }
  return user;
};

export const getInitialPropsApp = async (appContext: AppContext, App: any) => {
  const appProps = await App.getInitialProps(appContext);
  const { getState, dispatch } = store;
  let { user, categories } = getState().auth;
  const accessToken =
    (getCookie("accessToken", { req: appContext.ctx.req }) as string) || "";
  let cart = getValueFromCookie("cart", appContext) || [];
  let { id, email } = getUser(accessToken);
  user = { ...user, id, email };
  dispatch(setAccessTokenRedux(accessToken));
  dispatch(setUserRedux(user));
  dispatch(setCartFromCookieToRedux(cart));
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
          cart,
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
          cart,
        },
      };
    }
    return {
      pageProps: {
        ...appProps.pageProps,
        accessToken,
        user,
        categories,
        cart,
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
        cart,
      },
    };
  }
};
