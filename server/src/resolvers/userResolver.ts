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
        const user = await users.findByPk(id);
        if (!user) {
          throw new GraphQLError(`User not found!`);
        }
        return {
          id: user.dataValues.id,
          email: user.email,
          address: {
            address: user.dataValues.address.address,
          },
          createdAt: user.createdAt,
          updatedAt: user.updatedAt,
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
            id: user.id,
            email: user.email,
            accessToken: "",
            address: {
              address: user.dataValues.address.address,
            },
            createdAt: user.createdAt,
            updatedAt: user.updatedAt,
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
        const {
          dataValues: {
            id,
            name,
            phone,
            role,
            answer,
            address,
            createdAt,
            updatedAt,
          },
        } = userFounder;
        if (password !== userFounder.dataValues?.password) {
          throw new GraphQLError(`Wrong username or password!`);
        }
        const userData = {
          id,
          email,
        };
        const accessToken = jwt.sign(userData, process.env.JWT as string);
        return {
          id,
          email,
          name,
          phone,
          answer,
          role,
          address,
          createdAt,
          updatedAt,
          accessToken,
        };
      } catch (error) {
        console.log(error.message);
        throw new GraphQLError(error.message);
      }
    },

    async register(
      _parent: any,
      {
        email,
        password,
        name ,
        phone ,
        role,
        address,
        answer,
      }: any,
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
        const { id, createdAt, updatedAt } = dataValues;
        const userInfo = {
          id,
          email,
        };
        const accessToken = jwt.sign(userInfo, process.env.JWT as string);
        return {
          id,
          email,
          name: dataValues.name,
          phone: dataValues.phone,
          role: dataValues.role,
          answer: dataValues.answer,
          address: dataValues.address,
          createdAt,
          updatedAt,
          accessToken,
        };
      } catch (error) {
        console.log(error.message);
        throw new GraphQLError(error.message);
      }
    },
  },
};
