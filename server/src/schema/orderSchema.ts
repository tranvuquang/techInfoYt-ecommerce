export const typeOrder = `#graphql
  scalar Date

  type Payment {
    amount:Int!
    success:Boolean!
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
    # name: String!
    # description: String!
    # price:Int!
    # categoryId: String!
    quantity: Int!
    # photo: String!
    # shipping: Boolean! 
  }

  type Order {
    id:String!
    cart:[ProductCart]!
    payment:Payment!
    status:String!
    buyer:User!
    createdAt: Date
    updatedAt: Date
  }

  type Query {
    getClientToken:String!
    getAllOrders:[Order]!
    getOrdersByBuyerId(id:String):[Order]!
  }
  type Mutation{
    createPayment(nonce: String!,cart: [CartInput]!, total: Int!, buyerId: String!): Order!
  }
  
`;
