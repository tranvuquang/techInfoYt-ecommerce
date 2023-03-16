import type { NextPage } from "next";

type Props = {
  user: {
    id: string;
    email: string;
  };
};
import { wrapper } from "../app/store";
import React from "react";

const HomePage: NextPage<Props> = (props) => {
  return <div>index</div>;
};

export const getServerSideProps = wrapper.getServerSideProps(
  (store) =>
    async ({ query }) => {
      console.log("02 index.tsx store state on the server: ", store.getState().auth.user);
      return {
        props: {},
      };
    }
);

export default HomePage;
