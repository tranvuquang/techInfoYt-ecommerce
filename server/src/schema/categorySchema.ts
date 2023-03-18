export const typeCategory = `#graphql
  scalar Date

  type Category {
    id: String!
    name:String!
    createdAt: Date
    updatedAt: Date
  }


  type Query {
    getCategory(id:String):Category!
    getCategories:[Category]!
  }
 
  type Mutation {
    createCategory(name:String! ): Category!
    updateCategory(id:String, name:String):Category!
    deleteCategory(id:String!): String!
  }
`;
