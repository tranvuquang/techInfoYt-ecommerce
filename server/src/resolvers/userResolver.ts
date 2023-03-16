require("dotenv").config();
import { GraphQLError } from "graphql";
import jwt from "jsonwebtoken";
import db from "../models";
import { checkAuth } from "../middlewares/auth";

const { users } = db;

export const userResolver = {
  Query: {
    async getUser(_parent: any, { id }: any, { accessToken }: any) {
      try {
        if (!checkAuth(accessToken)) {
          throw new GraphQLError(`Token is invalid`);
        }
        const userFounder = await users.findByPk(id);
        if (!userFounder) {
          throw new GraphQLError(`User not found!`);
        }
        const { dataValues } = userFounder;
        return {
          ...dataValues,
          accessToken: "",
        };
      } catch (error) {
        console.log(error.message);
        throw new GraphQLError(error.message);
      }
    },

    async getUsers(_parent: any, _args: any, { accessToken }: any) {
      try {
        if (!checkAuth(accessToken)) {
          throw new GraphQLError(`Token is invalid`);
        }
        const userData = await users.findAll();
        if (!userData) {
          throw new GraphQLError(`Users list not found!`);
        }
        return userData.map((user: any) => {
          return {
            ...user.dataValues,
            accessToken: "",
          };
        });
      } catch (error) {
        console.log(error.message);
        throw new GraphQLError(error.message);
      }
    },
  },
  Mutation: {
    async login(_parent: any, { email, password }: any, _context: any) {
      try {
        const userFounder = await users.findOne({ where: { email } });
        if (!userFounder) {
          throw new GraphQLError(`User not found!`);
        }
        const { dataValues } = userFounder;
        const { id } = dataValues;
        if (password !== dataValues?.password) {
          throw new GraphQLError(`Wrong username or password!`);
        }
        const userData = {
          id,
          email,
        };
        const accessToken = jwt.sign(userData, process.env.JWT as string);
        return {
          ...dataValues,
          accessToken,
        };
      } catch (error) {
        console.log(error.message);
        throw new GraphQLError(error.message);
      }
    },

    async register(
      _parent: any,
      { email, password, name, phone, role, address, answer }: any,
      _context: any
    ) {
      try {
        const userFounder = await users.findOne({ where: { email } });
        if (userFounder) {
          throw new GraphQLError(`User already exists`);
        }
        const user = await users.create({
          email,
          password,
          name,
          phone,
          role,
          answer,
          address,
        });
        const { dataValues } = user;
        const { id } = dataValues;
        const userInfo = {
          id,
          email,
        };
        const accessToken = jwt.sign(userInfo, process.env.JWT as string);
        return {
          ...dataValues,
          accessToken,
        };
      } catch (error) {
        console.log(error.message);
        throw new GraphQLError(error.message);
      }
    },
  },
};
