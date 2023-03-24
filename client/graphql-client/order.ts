import { gql } from "@apollo/client";

const getClientTokenQuery = gql`
  query getClientTokenQuery {
    getClientToken
  }
`;

const createPaymentMutation = gql`
  mutation createPaymentMutation($cart: [CartInput]!, $nonce: String!, $total: Int!, $buyer: String!) {
  createPayment(cart: $cart, nonce: $nonce, total: $total, buyer: $buyer) {
    cart {
      name
      id
      description
      price
      categoryId
      quantity
      photo
      shipping
    }
    id
    payment {
      amount
    }
    buyer
    createdAt
    updatedAt
  }
}
`;

export { getClientTokenQuery, createPaymentMutation };
