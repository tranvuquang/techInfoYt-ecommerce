import type { NextPage } from "next";
import { wrapper } from "../../../app/store";
import React from "react";
import { IUser } from "../../../features/auth/types";
import Layout from "../../../components/Layout/Layout";
import { useAppSelector } from "../../../app/hooks";
import { selectAuth } from "../../../features/auth/authSlice";
import AdminMenu from "../../../components/Layout/AdminMenu";
import { useAdmin } from "../../../helpers/useAuthen";

type Props = {
  user: IUser;
};

const AdminDashboard: NextPage<Props> = (props) => {
  useAdmin();
  const {
    user: { name, email, phone },
  } = useAppSelector(selectAuth);
  return (
    <Layout title={"ALl Products - Best offers "}>
      <div className="container-fluid dashboard">
        <div className="row">
          <div className="col-md-3">
            <AdminMenu />
          </div>
          <div className="col-md-9">
            <div className="card w-75 p-3">
              <h3> Admin Name : {name}</h3>
              <h3> Admin Email : {email}</h3>
              <h3> Admin Contact : {phone}</h3>
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
        "02 dashboard/admin/index.tsx store state on the server: ",
        store.getState().auth.user.email
      );
      return {
        props: {},
      };
    }
);

export default AdminDashboard;
