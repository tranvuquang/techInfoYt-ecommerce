require("dotenv").config();
import { GraphQLError } from "graphql";
import db from "../models";
import { checkAuth } from "../middlewares/auth";

const { products } = db;

export const productResolver = {
  Query: {
    async getProduct(_parent: any, { id }: any, { accessToken }: any) {
      try {
        if (!checkAuth(accessToken)) {
          throw new GraphQLError(`Token is invalid`);
        }
        const productFounder = await products.findByPk(id);
        if (!productFounder) {
          throw new GraphQLError(`Product not found!`);
        }
        const { dataValues } = productFounder;
        return {
          ...dataValues,
        };
      } catch (error) {
        console.log(error.message);
        throw new GraphQLError(error.message);
      }
    },

    async getProducts(_parent: any, _args: any, { accessToken }: any) {
      try {
        if (!checkAuth(accessToken)) {
          throw new GraphQLError(`Token is invalid`);
        }
        const productsData = await products.findAll({
          order: [["updatedAt", "DESC"]],
        });
        if (!productsData) {
          throw new GraphQLError(`Products list not found!`);
        }
        return productsData.map((product: any) => {
          return {
            ...product.dataValues,
          };
        });
      } catch (error) {
        console.log(error.message);
        throw new GraphQLError(error.message);
      }
    },
  },
  Mutation: {
    async createProduct(_parent: any, { product }: any, { accessToken }: any) {
      try {
        if (!checkAuth(accessToken)) {
          throw new GraphQLError(`Token is invalid`);
        }
        const { id, ...productData } = product;
        const productFounder = await products.findAll({
          where: {
            name: productData.name,
          },
        });
        if ((productFounder.length = 0)) {
          throw new GraphQLError(`Product already exists`);
        }
        const { dataValues } = await products.create(productData);
        return dataValues;
      } catch (error) {
        console.log(error.message);
        throw new GraphQLError(error.message);
      }
    },

    async updateProduct(_parent: any, { product }: any, { accessToken }: any) {
      try {
        if (!checkAuth(accessToken)) {
          throw new GraphQLError(`Token is invalid`);
        }

        const { id, ...productData } = product;
        if (!id) {
          throw new GraphQLError("Product id is require");
        }

        const productFounder = await products.findByPk(id);
        if (!productFounder) {
          throw new GraphQLError(`Product not found!`);
        }

        const productInfo = await products.update(productData, {
          where: { id },
          returning: true,
          plain: true,
        });
        return productInfo[1].dataValues;
      } catch (error) {
        console.log(error.message);
        throw new GraphQLError(error.message);
      }
    },

    async deleteProduct(_parent: any, { id }: any, { accessToken }: any) {
      try {
        if (!checkAuth(accessToken)) {
          throw new GraphQLError(`Token is invalid`);
        }
        const productDelete = await products.destroy({ where: { id } });
        console.log(productDelete);
        return `Delete id: ${id} successful`;
      } catch (error) {
        console.log(error.message);
        throw new GraphQLError(error.message);
      }
    },
  },
};
