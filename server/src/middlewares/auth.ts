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

import jwt from "jsonwebtoken";

export const verifyToken = async (req: any, res: any, next: any) => {
  try {
    const authHeader = req.header("Authorization");
    const token = authHeader && authHeader.split(" ")[1];
    if (!token) {
      return res.status(403).send("Access Denied");
    }

    const decoded = jwt.verify(token, SECRET_KEY as string) as any;
    req.headers.user=decoded
    if (!decoded) {
      return res.status(403).send("Token is not valid!");
    }

    next();
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};
