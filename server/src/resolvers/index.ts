import { userResolver } from "./userResolver";
import { categoryResolver } from "./categoryResolver";

import { GraphQLDateTime } from "graphql-iso-date";

const customScalarResolver = {
  Date: GraphQLDateTime,
};

const resolvers = [customScalarResolver, userResolver, categoryResolver];

export default resolvers;
