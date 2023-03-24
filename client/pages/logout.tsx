import { deleteCookie } from "cookies-next";
import { NextPage } from "next";
import { useRouter } from "next/router";
import React, { useEffect } from "react";
import { useAppDispatch, useAppSelector } from "../app/hooks";
import { wrapper } from "../app/store";
import {
  selectAuth,
  setAccessTokenRedux,
  setUserRedux,
} from "../features/auth/authSlice";
import { userDefaultData } from "../features/auth/types";

type Props = {};

const LogoutPage: NextPage<Props> = (props) => {
  const { accessToken } = useAppSelector(selectAuth);
  const dispatch = useAppDispatch();
  const { push } = useRouter();
  useEffect(() => {
    dispatch(setAccessTokenRedux(""));
    dispatch(setUserRedux(userDefaultData));
    deleteCookie("accessToken");
    if (!accessToken) {
      push("/login");
    }
  }, [accessToken, dispatch, push]);

  return <div>Logout</div>;
};

export const getServerSideProps = wrapper.getServerSideProps(
  (store) =>
    async ({ query }) => {
      const { dispatch} = store;
      let user = userDefaultData;
      dispatch(setAccessTokenRedux(""));
      dispatch(setUserRedux(userDefaultData));
      deleteCookie("accessToken");
      console.log(
        "02 logout.tsx store state on the server: ",
        store.getState().auth.user.email
      );
      return {
        props: {
          user,
          // data,
        }, // will be passed to the page component as props
      };
    }
);

export default LogoutPage;
