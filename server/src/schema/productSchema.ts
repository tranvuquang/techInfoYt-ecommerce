export const typeProduct = `#graphql
  scalar Date

  type Address{
    address: String!
  }

  type Product {
    id: String!
    name:String!
    description:String!
    price:Int!
    category:[String]!
    quantity:Int!
    photo: String!
    shipping:Boolean!
    createdAt: Date
    updatedAt: Date
  }

  input ProductInput {
    id:String
    name: String!
    description: String!
    price:Int!
    category: [String]!
    quantity: Int!
    photo: String!
    shipping: Boolean! 
  }

  type Query {
    getProduct(id:String):Product!
    getProducts:[Product]!
  }
 
  type Mutation {
    createProduct(product:ProductInput!): Product!
    updateProduct(product:ProductInput!): Product!
    deleteProduct(id:String!):String!
  }
`;
