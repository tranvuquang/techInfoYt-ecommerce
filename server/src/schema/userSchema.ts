export const typeUser = `#graphql
  scalar Date

  type Address{
    address: String!
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
  }

  type Query {
    getUser(id:String):User!
    getUsers:[User]!
  }
 
  type Mutation {
    register(email: String!, password: String!, name:String!, phone: String, answer: String, role: String, address: AddressInput ): User!
    login(email: String!, password: String!): User!
  }
`;
