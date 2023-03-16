import { gql } from "@apollo/client";

const loginMutation = gql`
  mutation loginMutation($email: String!, $password: String!) {
    login(email: $email, password: $password) {
      id
      email
      accessToken
    }
  }
`;

const createMessageMutation = gql`
  mutation createMessageMutation(
    $conversationId: String!
    $sender: String!
    $text: String!
  ) {
    createMessage(
      conversationId: $conversationId
      sender: $sender
      text: $text
    ) {
      id
      conversationId
      sender
      text
      createdAt
      updatedAt
    }
  }
`;

export { loginMutation, createMessageMutation };
