import { AppContext } from "next/app";
import cookie from "cookie";
import jwt_decode from "jwt-decode";

export const getTokenFromCookie = (appContext: AppContext) => {
  let token = "";
  if (appContext.ctx.req?.headers.cookie) {
    token = cookie
      .parse((appContext.ctx.req?.headers.cookie as string) || "")
      .accessToken.split('"')[1];
  }
  return token;
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
