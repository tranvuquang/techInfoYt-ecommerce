import { gql } from "@apollo/client";

const createCategoryMutation = gql`
  mutation createCategoryMutation($name: String!) {
    createCategory(name: $name) {
      id
      name
      createdAt
      updatedAt
    }
  }
`;

const updateCategoryMutation = gql`
  mutation updateCategoryMutation($id: String, $name: String) {
    updateCategory(id: $id, name: $name) {
      id
      name
      createdAt
      updatedAt
    }
  }
`;

const deleteCategoryMutation = gql`
  mutation deleteCategoryMutation($id: String!) {
    deleteCategory(id: $id)
  }
`;

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

export {
  createCategoryMutation,
  updateCategoryMutation,
  deleteCategoryMutation,
  getCategoriesQuery,
  getCategoryQuery
};
