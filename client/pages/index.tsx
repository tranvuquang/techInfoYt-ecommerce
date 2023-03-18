import type { NextPage } from "next";

import { wrapper } from "../app/store";
import React from "react";
import { IUser } from "../features/auth/types";
import Layout from "../components/Layout/Layout";

type Props = {
  user: IUser;
};

const HomePage: NextPage<Props> = (props) => {
  return (
    <Layout title={"ALl Products - Best offers "}>
      <div
        className="home-page"
        style={{ }}
      >
        Home
      </div>
    </Layout>
  );
};

export const getServerSideProps = wrapper.getServerSideProps(
  (store) =>
    async ({ query }) => {
      console.log(
        "02 index.tsx store state on the server: ",
        store.getState().auth.user.email
      );
      return {
        props: {},
      };
    }
);

export default HomePage;
