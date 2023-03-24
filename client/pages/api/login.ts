import { setCookie } from "cookies-next";
import type { NextApiRequest, NextApiResponse } from "next";
import { store } from "../../app/store";
import {
  setAccessTokenRedux,
  setUserRedux,
} from "../../features/auth/authSlice";
import { mutationClient } from "../../graphql-client";
import { loginMutation } from "../../graphql-client/auth";
import { nextYear } from "../../features/auth/types";

const login = async (req: NextApiRequest, res: NextApiResponse) => {
  const dispatch = store.dispatch;
  try {
    const method = req.method;
    if (method !== "POST") {
      res.statusCode = 500;
      res.json({
        status: 500,
        message: "Method Not Allowed",
      });
    }
    const { email, password } = req.body;
    const { resData } = (await mutationClient("", dispatch, loginMutation, {
      email,
      password,
    })) as any;
    if (resData) {
      const { accessToken, email, id } = resData.data.login;
      dispatch(setAccessTokenRedux(accessToken));
      dispatch(setUserRedux(resData.data.login));
      setCookie("accessToken", resData.data.login.accessToken, {
        req,
        res,
        expires: nextYear,
      });

      return res.status(200).json({
        status: 200,
        message: "success",
        accessToken,
        user: resData.data.login,
      });
    }
    return res.status(500).json({
      status: 500,
      message: "Internal Server Error",
    });
  } catch (error: any) {
    console.log(error.message);
    return res.status(500).json({
      status: 500,
      message: "Internal Server Error",
      error: error.message,
    });
  }
};

export default login;
