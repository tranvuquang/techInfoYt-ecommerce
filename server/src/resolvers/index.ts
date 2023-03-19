import { GraphQLDateTime } from "graphql-iso-date";
import { userResolver } from "./userResolver";
import { categoryResolver } from "./categoryResolver";
import { productResolver } from "./productResolver";

const customScalarResolver = {
  Date: GraphQLDateTime,
};

const resolvers = [
  customScalarResolver,
  userResolver,
  categoryResolver,
  productResolver,
];

export default resolvers;
