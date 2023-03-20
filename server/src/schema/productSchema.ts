export const typeProduct = `#graphql
  scalar Date

  type Address {
    address: String!
  }

  type Filter {
    page:Int
    limit:Int
    total:Int
    category:[String]
    searchStr:String
    price:[Int]
  }

  type Product {
    id: String!
    name:String!
    description:String!
    price:Int!
    categoryId:String!
    quantity:Int!
    photo: String!
    shipping:Boolean!
    createdAt: Date
    updatedAt: Date
  }

  type ProductData {
    filter:Filter
    products:[Product]!
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
    getProducts(page: Int,limit: Int,category: [String],searchStr:String,price:[Int]):ProductData!
  }
 
  type Mutation {
    createProduct(product:ProductInput!): Product!
    updateProduct(product:ProductInput!): Product!
    deleteProduct(id:String!):String!
  }
`;
