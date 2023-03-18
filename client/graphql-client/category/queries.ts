import { gql } from "@apollo/client";

const getCategoriesQuery = gql`
  query getCategoriesQuery {
    getCategories {
      id
      name
      createdAt
      updatedAt
    }
  }
`;

const getCategoryQuery = gql`
  query getCategoryQuery($id: String) {
  getCategory(id: $id) {
    id
    name
    createdAt
    updatedAt
  }
}
`;

export { getCategoriesQuery, getCategoryQuery };
