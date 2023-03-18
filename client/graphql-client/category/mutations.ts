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

export {
  createCategoryMutation,
  updateCategoryMutation,
  deleteCategoryMutation,
};
