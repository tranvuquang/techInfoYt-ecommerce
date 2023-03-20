require("dotenv").config();
import { GraphQLError } from "graphql";
import db from "../models";
import { checkAuth } from "../middlewares/auth";
import { Op } from "sequelize";

const { products } = db;

export const productResolver = {
  Query: {
    async getProduct(_parent: any, { id }: any) {
      try {
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

    async getProducts(
      _parent: any,
      { page = 1, limit = 3, category = [], searchStr = "", price = [] }: any
    ) {
      try {
        if (category.length === 0) {
          const productsFounder = await products.findAll({
            order: [["updatedAt", "DESC"]],
            subQuery: false,
            offset: (page - 1) * limit,
            limit,
            where:
              price.length === 0
                ? {}
                : {
                    price: {
                      [Op.between]: price,
                    },
                  },
          });

          const totalFound = await products.count({
            order: [["updatedAt", "DESC"]],
            subQuery: false,
            offset: (page - 1) * limit,
            limit,
            where:
              price.length === 0
                ? {}
                : {
                    price: {
                      [Op.between]: price,
                    },
                  },
          });
          if (!productsFounder || !totalFound) {
            throw new GraphQLError(`Products not found!`);
          }
          return {
            filter: {
              total: totalFound,
              page,
              limit,
              category: [],
              searchStr,
              price,
            },
            products: productsFounder.map((product: any) => {
              return product.dataValues;
            }),
          };
        } else {
          const productsFounder = await products.findAll({
            order: [["updatedAt", "DESC"]],
            subQuery: false,
            offset: (page - 1) * limit,
            limit,
            where:
              price.length === 0
                ? {
                    name: {
                      [Op.iLike]: `%${searchStr}%`,
                    },
                    categoryId: category,
                  }
                : {
                    name: {
                      [Op.iLike]: `%${searchStr}%`,
                    },
                    categoryId: category,
                    price: {
                      [Op.between]: price,
                    },
                  },
          });
          const totalFound = await products.count({
            order: [["updatedAt", "DESC"]],
            subQuery: false,
            offset: (page - 1) * limit,
            limit,
            where:
              price.length === 0
                ? {
                    name: {
                      [Op.iLike]: `%${searchStr}%`,
                    },
                    categoryId: category,
                  }
                : {
                    name: {
                      [Op.iLike]: `%${searchStr}%`,
                    },
                    categoryId: category,
                    price: {
                      [Op.between]: price,
                    },
                  },
          });
          if (!productsFounder) {
            throw new GraphQLError(`Products not found!`);
          }
          return {
            filter: {
              total: totalFound,
              page,
              limit,
              category,
              searchStr,
              price,
            },
            products: productsFounder.map((product: any) => {
              return {
                ...product.dataValues,
              };
            }),
          };
        }
      } catch (error) {
        console.log(error.message);
        throw new GraphQLError(error.message);
      }
      /* try {
        if (category.length === 0) {
          const productsFounder = await products.findAll({
            order: [["createdAt", "DESC"]],
            subQuery: false,
            offset: (page - 1) * limit,
            limit,
            where: {
              name: {
                [Op.iLike]: `%${searchStr}%`,
              },
            },
          });
          const totalFound = await products.count({
            order: [["createdAt", "DESC"]],
            subQuery: false,
            offset: (page - 1) * limit,
            limit,
            where: {
              name: {
                [Op.iLike]: `%${searchStr}%`,
              },
            },
          });

          if (!productsFounder || !totalFound) {
            throw new GraphQLError(`Products list not found!`);
          }
          return {
            filter: {
              total: totalFound,
              page,
              limit,
              category,
              searchStr,
              price,
            },
            products: productsFounder.map((product: any) => {
              return {
                ...product.dataValues,
              };
            }),
          };
        } else {
          const productsFounder = await products.findAll({
            order: [["createdAt", "DESC"]],
            subQuery: false,
            offset: (page - 1) * limit,
            limit,
            where: {
              name: {
                [Op.iLike]: `%${searchStr}%`,
              },
              // category: { [Op.contains]: [`${category}`] },
            },
          });

          const totalFound = await products.count({
            order: [["createdAt", "DESC"]],
            subQuery: false,
            offset: (page - 1) * limit,
            limit,
            where: {
              name: {
                [Op.iLike]: `%${searchStr}%`,
              },
              category: { [Op.contains]: [`${category}`] },
            },
          });

          if (!productsFounder || !totalFound) {
            throw new GraphQLError(`Products list not found!`);
          }
          return {
            filter: {
              total: totalFound,
              page,
              limit,
              category,
              searchStr,
              price,
            },
            products: productsFounder.map((product: any) => {
              return {
                ...product.dataValues,
              };
            }),
          };
        }
      } */
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
