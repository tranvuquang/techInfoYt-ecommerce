import { gql } from "@apollo/client";

const getClientTokenQuery = gql`
  query getClientTokenQuery {
    getClientToken
  }
`;

const createPaymentMutation = gql`
  mutation createPaymentMutation(
    $nonce: String!
    $cart: [CartInput]!
    $total: Int!
    $buyerId: String!
  ) {
    createPayment(
      nonce: $nonce
      cart: $cart
      total: $total
      buyerId: $buyerId
    ) {
      id
      payment {
        amount
        success
      }
      status
      createdAt
      updatedAt
      buyer {
        id
        email
        name
        phone
        address {
          country
          address
        }
        answer
        role
      }
      cart {
        id
        name
        description
        price
        categoryId
        quantity
        photo
        shipping
      }
    }
  }
`;

const getAllOrdersQuery = gql`
  query getAllOrdersQuery {
    getAllOrders {
      id
      payment {
        amount
        success
      }
      status
      createdAt
      updatedAt
      buyer {
        id
        email
        name
        phone
        address {
          country
          address
        }
        answer
        role
        accessToken
      }
      cart {
        id
        name
        description
        price
        categoryId
        quantity
        photo
        shipping
      }
    }
  }
`;

const getOrdersByBuyerIdQuery = gql`
  query getOrdersByBuyerIdQuery($id: String) {
    getOrdersByBuyerId(id: $id) {
      id
      payment {
        amount
        success
      }
      status
      createdAt
      updatedAt
      buyer {
        id
        email
        name
        phone
        address {
          country
          address
        }
        answer
        role
        accessToken
      }
      cart {
        id
        name
        description
        price
        categoryId
        quantity
        photo
        shipping
      }
    }
  }
`;

export {
  getClientTokenQuery,
  createPaymentMutation,
  getAllOrdersQuery,
  getOrdersByBuyerIdQuery,
};
