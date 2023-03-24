require("dotenv").config();
import { GraphQLError } from "graphql";
import braintree from "braintree";
import { checkAuth } from "../middlewares/auth";
import db from "../models";

const { orders } = db;

const gateway = new braintree.BraintreeGateway({
  environment: braintree.Environment.Sandbox,
  merchantId: process.env.BRAINTREE_MERCHANT_ID as string,
  publicKey: process.env.BRAINTREE_PUBLIC_KEY as string,
  privateKey: process.env.BRAINTREE_PRIVATE_KEY as string,
});

export const orderResolver = {
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
  },
  Mutation: {
    async createPayment(
      _parent: any,
      { cart, nonce, total, buyer }: any,
      { accessToken }: { accessToken: string }
    ) {
      console.log(nonce)
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
        console.log(newTransaction.transaction.amount);

        const order = await orders.create({
          cart,
          payment: {
            amount: newTransaction.transaction.amount,
          },
          buyer,
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
