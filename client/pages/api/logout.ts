// Next.js API route support: https://nextjs.org/docs/api-routes/introduction
import { deleteCookie } from "cookies-next";
import type { NextApiRequest, NextApiResponse } from "next";
import { store } from "../../app/store";
import {
  setAccessTokenRedux,
  setUserRedux,
} from "../../features/auth/authSlice";
import { userDefaultData } from "../../features/auth/types";

const logout = async (req: NextApiRequest, res: NextApiResponse) => {
  try {
    const dispatch = store.dispatch;
    const method = req.method;
    if (method !== "POST") {
      return res.json({
        status: 500,
        message: "Method Not Allowed",
      });
    }
    dispatch(setAccessTokenRedux(""));
    dispatch(setUserRedux(userDefaultData));
    deleteCookie("accessToken");
    return res.status(200).json({ status: 200, message: "success" });
  } catch (error: any) {
    console.log(error.message);
    return res.status(500).json({
      status: 500,
      message: "Internal Server Error",
      error: error.message,
    });
  }
};

export default logout;
