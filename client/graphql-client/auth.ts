import { gql } from "@apollo/client";

const loginMutation = gql`
  mutation loginMutation($email: String!, $password: String!) {
    login(email: $email, password: $password) {
      accessToken
      email
      id
      address {
        address
      }
      name
      phone
      role
      answer
    }
  }
`;

const getUserQuery = gql`
  query getUserQuery($id: String) {
    getUser(id: $id) {
      id
      email
      name
      phone
      answer
      role
      accessToken
      address {
        address
        country
      }
      createdAt
      updatedAt
    }
  }
`;

export { loginMutation, getUserQuery };
