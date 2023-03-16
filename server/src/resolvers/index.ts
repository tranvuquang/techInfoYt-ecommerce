import { userResolver } from "./userResolver";

import { GraphQLDateTime } from "graphql-iso-date";

const customScalarResolver = {
  Date: GraphQLDateTime,
};

const resolvers = [customScalarResolver, userResolver];

export default resolvers;
