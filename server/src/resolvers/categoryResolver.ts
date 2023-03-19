require("dotenv").config();
import { GraphQLError } from "graphql";
import db from "../models";
import { checkAuth } from "../middlewares/auth";

const { categories } = db;

export const categoryResolver = {
  Query: {
    async getCategory(_parent: any, { id }: any, { accessToken }: any) {
      try {
        if (!checkAuth(accessToken)) {
          throw new GraphQLError(`Token is invalid`);
        }
        const categoryFounder = await categories.findByPk(id);
        if (!categoryFounder) {
          throw new GraphQLError(`Category not found!`);
        }
        const { dataValues } = categoryFounder;
        return {
          ...dataValues,
        };
      } catch (error) {
        console.log(error.message);
        throw new GraphQLError(error.message);
      }
    },

    async getCategories(_parent: any, _args: any, { accessToken }: any) {
      try {
        if (!checkAuth(accessToken)) {
          throw new GraphQLError(`Token is invalid`);
        }
        const categoriesData = await categories.findAll({
          order: [["updatedAt", "DESC"]],
        });
        if (!categoriesData) {
          throw new GraphQLError(`Categories list not found!`);
        }
        return categoriesData.map((category: any) => {
          return {
            ...category.dataValues,
          };
        });
      } catch (error) {
        console.log(error.message);
        throw new GraphQLError(error.message);
      }
    },
  },
  Mutation: {
    async createCategory(_parent: any, { name }: any, { accessToken }: any) {
      try {
        if (!checkAuth(accessToken)) {
          throw new GraphQLError(`Token is invalid`);
        }
        const categoryFounder = await categories.findOne({ where: { name } });
        if (categoryFounder) {
          throw new GraphQLError(`Category already exists`);
        }
        const { dataValues } = await categories.create({
          name,
        });
        return dataValues;
      } catch (error) {
        console.log(error.message);
        throw new GraphQLError(error.message);
      }
    },

    async updateCategory(
      _parent: any,
      { id, name }: any,
      { accessToken }: any
    ) {
      try {
        if (!checkAuth(accessToken)) {
          throw new GraphQLError(`Token is invalid`);
        }
        const category = await categories.update(
          { name },
          { where: { id }, returning: true, plain: true }
        );
        return category[1].dataValues;
      } catch (error) {
        console.log(error.message);
        throw new GraphQLError(error.message);
      }
    },
    async deleteCategory(_parent: any, { id }: any, { accessToken }: any) {
      try {
        if (!checkAuth(accessToken)) {
          throw new GraphQLError(`Token is invalid`);
        }
        const categoryDelete = await categories.destroy({ where: { id } });
        console.log(categoryDelete);
        return `Delete id: ${id} successful`;
      } catch (error) {
        console.log(error.message);
        throw new GraphQLError(error.message);
      }
    },
  },
};
