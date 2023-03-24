import { GraphQLDateTime } from "graphql-iso-date";
import { userResolver } from "./userResolver";
import { categoryResolver } from "./categoryResolver";
import { productResolver } from "./productResolver";
import { orderResolver } from "./orderResolver";

const customScalarResolver = {
  Date: GraphQLDateTime,
};

const resolvers = [
  customScalarResolver,
  userResolver,
  categoryResolver,
  productResolver,
  orderResolver,
];

export default resolvers;
