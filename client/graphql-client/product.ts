import { gql } from "@apollo/client";

const createProductMutation = gql`
  mutation createProductMutation($product: ProductInput!) {
    createProduct(product: $product) {
      id
      name
      photo
      price
      quantity
      shipping
      description
      createdAt
      updatedAt
      category
    }
  }
`;

const updateProductMutation = gql`
  mutation updateProductMutation($product: ProductInput!) {
    updateProduct(product: $product) {
      id
      name
      photo
      price
      quantity
      shipping
      description
      category
      createdAt
      updatedAt
    }
  }
`;

const deleteProductMutation = gql`
  mutation deleteProductMutation($id: String!) {
    deleteProduct(id: $id)
  }
`;

const getProductsQuery = gql`
  query getProductsQuery {
    getProducts {
      id
      name
      description
      photo
      price
      quantity
      shipping
      category
      createdAt
      updatedAt
    }
  }
`;

const getProductQuery = gql`
  query getProductQuery($id: String) {
    getProduct(id: $id) {
      id
      name
      photo
      price
      quantity
      shipping
      description
      category
      createdAt
      updatedAt
    }
  }
`;

export {
  createProductMutation,
  updateProductMutation,
  deleteProductMutation,
  getProductsQuery,
  getProductQuery,
};
