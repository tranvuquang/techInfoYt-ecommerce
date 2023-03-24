export const typeOrder = `#graphql
  scalar Date

  type Payment {
    amount:Int!
  }

  type ProductCart {
    id:String!
    name: String!
    description: String!
    price:Int!
    categoryId: String!
    quantity: Int!
    photo: String!
    shipping: Boolean! 
  }

  input CartInput {
    id:String!
    name: String!
    description: String!
    price:Int!
    categoryId: String!
    quantity: Int!
    photo: String!
    shipping: Boolean! 
  }

  type Order {
    id:String!
    cart:[ProductCart]!
    payment:Payment!
    buyer:String!
    createdAt: Date
    updatedAt: Date
  }

  type Query {
    getClientToken:String!
  }
  type Mutation{
    createPayment(nonce: String!,cart: [CartInput]!, total: Int!, buyer: String!): Order!
  }
  
`;
