import type { NextPage } from "next";
import { wrapper } from "../app/store";
import React from "react";
import { useNotAuthen } from "../helpers/useAuthen";

type Props = {
  user: {
    id: string;
    email: string;
  };
};

const PostPage: NextPage<Props> = (props) => {
  useNotAuthen();
  return <div>Posts Page</div>;
};

export const getServerSideProps = wrapper.getServerSideProps(
  (store) =>
    async ({ query }) => {
      console.log("02 posts.tsx store state on the server: ", store.getState().auth.user);
      return {
        props: {},
      };
    }
);

export default PostPage;
