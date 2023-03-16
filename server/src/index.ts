require("dotenv").config();
import express from "express";
import cors from "cors";
import { createServer } from "http";
import { ApolloServer } from "@apollo/server";
import { expressMiddleware } from "@apollo/server/express4";

import resolvers from "./resolvers";
import typeDefs from "./schema";

import db from "./models";

const app = express();
const httpServer = createServer(app);
const port = process.env.PORT || 5000;

interface MyContext {
  accessToken?: String;
}

const apolloServer = new ApolloServer<MyContext>({
  typeDefs,
  resolvers,
});


db.sequelize.sync().then(() => {
  console.log("🚀 PostgresSQL connected");
  apolloServer
    .start()
    .then(() => {
      app.use(
        "/graphql",
        cors<cors.CorsRequest>({
          origin: ["http://localhost:3001", "http://localhost:3002"],
          credentials: true,
        }),
        express.json(),
        expressMiddleware(apolloServer, {
          context: async ({ req, res }) => {
            const { authorization } = req.headers;
            const accessToken =
              (authorization && authorization.split(" ")[1]) || "";
            return { res, accessToken };
          },
        })
      );
    })
    .then(async () => {
      await new Promise<void>((resolve) =>
        httpServer.listen({ port }, resolve)
      );
      console.log(`Server ready at http://localhost:${port}/graphql`);
    });
});
