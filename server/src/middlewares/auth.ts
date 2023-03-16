require("dotenv").config();
import { verify } from "jsonwebtoken";

const SECRET_KEY = process.env.JWT as string;

export const checkAuth = (accessToken: string) => {
  if (accessToken) {
    try {
      const user = verify(accessToken, SECRET_KEY);
      return user;
    } catch (err) {
      return;
    }
  } else return;
};
