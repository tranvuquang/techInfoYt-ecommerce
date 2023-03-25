import type { NextPage } from "next";
import { wrapper } from "../../../app/store";
import React from "react";
import Layout from "../../../components/Layout/Layout";
import { useUser } from "../../../helpers/useAuthen";
import { useAppSelector } from "../../../app/hooks";
import { selectAuth } from "../../../features/auth/authSlice";
import UserMenu from "../../../components/Layout/UserMenu";

type Props = {};

const UserDashboard: NextPage<Props> = (props) => {
  useUser();
  const {
    user: { name, email, address },
  } = useAppSelector(selectAuth);
  return (
    <Layout title={"Dashboard - Ecommerce App"}>
      <div className="container-flui m-3 p-3 dashboard">
        <div className="row">
          <div className="col-md-3">
            <UserMenu />
          </div>
          <div className="col-md-9">
            <div className="card w-75 p-3">
              <h3>{name}</h3>
              <h3>{email}</h3>
              <h3>{address.address}</h3>
            </div>
          </div>
        </div>
      </div>
    </Layout>
  );
};

export const getServerSideProps = wrapper.getServerSideProps(
  (store) =>
    async ({ query }) => {
      console.log(
        "02 dashboard/user/index.tsx store state on the server: ",
        store.getState().auth.user.email
      );
      return {
        props: {},
      };
    }
);

export default UserDashboard;
