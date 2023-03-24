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
      categoryId
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
      categoryId
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
  query getProductsQuery($page: Int, $limit: Int, $searchStr: String, $price: [Int], $category: [String]) {
  getProducts(page: $page, limit: $limit, searchStr: $searchStr, price: $price, category: $category) {
    filter {
      category
      limit
      page
      searchStr
      total
      price
    }
    products {
      id
      name
      photo
      price
      quantity
      shipping
      description
      categoryId
      createdAt
      updatedAt
    }
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
      categoryId
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
