import { gql } from "@apollo/client";

const getUserQuery = gql`
  query GetUser($id: String) {
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
      }
      createdAt
      updatedAt
    }
  }
`;

export { getUserQuery };
