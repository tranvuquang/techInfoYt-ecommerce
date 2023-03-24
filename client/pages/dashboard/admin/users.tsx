import type { NextPage } from "next";
import { wrapper } from "../../../app/store";
import React from "react";
import { IUser } from "../../../features/auth/types";
import Layout from "../../../components/Layout/Layout";
import AdminMenu from "../../../components/Layout/AdminMenu";
import { useAdmin } from "../../../helpers/useAuthen";

type Props = {
};

const Users: NextPage<Props> = (props) => {
  useAdmin()
  return (
    <Layout title={"Dashboard - All Users"}>
      <div className="container-fluid m-3 p-3">
        <div className="row">
          <div className="col-md-3">
            <AdminMenu />
          </div>
          <div className="col-md-9">
            <h1>All Users</h1>
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
        "02 dashboard/admin/users.tsx store state on the server: ",
        store.getState().auth.user.email
      );
      return {
        props: {},
      };
    }
);

export default Users;
