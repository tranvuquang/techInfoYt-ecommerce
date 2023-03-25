require("dotenv").config();
import { GraphQLError } from "graphql";
import braintree from "braintree";
import { checkAuth } from "../middlewares/auth";
import db from "../models";

const { orders, users, products } = db;

const gateway = new braintree.BraintreeGateway({
  environment: braintree.Environment.Sandbox,
  merchantId: process.env.BRAINTREE_MERCHANT_ID as string,
  publicKey: process.env.BRAINTREE_PUBLIC_KEY as string,
  privateKey: process.env.BRAINTREE_PRIVATE_KEY as string,
});

export const orderResolver = {
  Order: {
    buyer: async (parent: any) => {
      try {
        const userFounder = await users.findByPk(parent.buyerId);
        if (!userFounder) {
          throw new GraphQLError(`User not found!`);
        }
        const { dataValues } = userFounder;
        return {
          ...dataValues,
        };
      } catch (error) {
        console.log(error.message);
        throw new GraphQLError(error.message);
      }
    },
    cart: async (parent: any) => {
      const cartData = parent.cart.map(async (item: any) => {
        const productFounder = await products.findByPk(item.id);
        return { ...productFounder.dataValues, quantity: item.quantity };
      });
      return cartData;
    },
  },
  Query: {
    async getClientToken() {
      try {
        const { success, clientToken } = await gateway.clientToken.generate({});
        if (success === false) {
          throw new GraphQLError("Internal server error");
        }
        return clientToken;
      } catch (error) {
        console.log(error.message);
        throw new GraphQLError(error.message);
      }
    },
    async getAllOrders(
      _parent: any,
      _args: any,
      { accessToken }: { accessToken: string }
    ) {
      try {
        if (!checkAuth(accessToken)) {
          throw new GraphQLError(`Token is invalid`);
        }
        const ordersFounder = await orders.findAll();
        if (!ordersFounder) {
          throw new GraphQLError(`Orders not found`);
        }
        return ordersFounder.map((item: any) => {
          return item.dataValues;
        });
      } catch (error) {
        console.log(error.message);
        throw new GraphQLError(error.message);
      }
    },
    async getOrdersByBuyerId(
      _parent: any,
      { id }: any,
      { accessToken }: { accessToken: string }
    ) {
      try {
        if (!checkAuth(accessToken)) {
          throw new GraphQLError(`Token is invalid`);
        }
        const ordersFounder = await orders.findAll({
          where: {
            buyerId: id,
          },
        });
        if (!ordersFounder) {
          throw new GraphQLError(`Orders not found`);
        }
        return ordersFounder.map((item: any) => {
          return item.dataValues;
        });
      } catch (error) {
        console.log(error.message);
        throw new GraphQLError(error.message);
      }
    },
  },
  Mutation: {
    async createPayment(
      _parent: any,
      { cart, nonce, total, buyerId }: any,
      { accessToken }: { accessToken: string }
    ) {
      try {
        if (!checkAuth(accessToken)) {
          throw new GraphQLError(`Token is invalid`);
        }
        const newTransaction = await gateway.transaction.sale({
          amount: total,
          paymentMethodNonce: nonce,
          options: {
            submitForSettlement: true,
          },
        });
        if (!newTransaction) {
          throw new GraphQLError(`Internal Server Error`);
        }
        const order = await orders.create({
          cart,
          payment: {
            amount: newTransaction.transaction.amount,
            success: true,
          },
          buyerId,
        });
        if (!order) {
          throw new GraphQLError(`Internal Server Error`);
        }

        return {
          ...order.dataValues,
        };
      } catch (error) {
        console.log(error.message);
        throw new GraphQLError(error.message);
      }
    },
  },
};
