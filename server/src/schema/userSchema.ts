export const typeUser = `#graphql
  scalar Date

  type Address{
    country:String
    address: String
  }

  type User {
    id: String!
    email: String!
    name:String!
    phone:String
    address:Address
    answer:String
    role:String
    accessToken: String
    createdAt: Date
    updatedAt: Date
  }

  input AddressInput {
    address: String
    country:String
  }

  type Query {
    getUser(id:String):User!
    getUsers:[User]!
  }
 
  type Mutation {
    register(email: String!, password: String!, name:String!, phone: String, answer: String, address: AddressInput ): User!
    login(email: String!, password: String!): User!
  }
`;
