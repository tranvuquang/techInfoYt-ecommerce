import type { NextPage } from "next";
import { wrapper } from "../../../../app/store";
import React from "react";
import { IUser } from "../../../../features/auth/types";
import Layout from "../../../../components/Layout/Layout";
import { useAppSelector } from "../../../../app/hooks";
import { selectAuth } from "../../../../features/auth/authSlice";
import AdminMenu from "../../../../components/Layout/AdminMenu";
import { useAdmin } from "../../../../helpers/useAuthen";

type Props = {
  user: IUser;
};

const AdminDashboard: NextPage<Props> = (props) => {
  useAdmin();
  const {
    user: { name, email, phone },
  } = useAppSelector(selectAuth);
  return (
    <Layout title={"Dashboard - Create Category"}>
      <div className="container-fluid dashboard">
        <div className="row">
          <div className="col-md-3">
            <AdminMenu />
          </div>
          create category
          {/* <div className="col-md-9">
            <h1>Manage Category</h1>
            <div className="p-3 w-50">
              <CategoryForm
                handleSubmit={handleSubmit}
                value={name}
                setValue={setName}
              />
            </div>
            <div className="w-75">
              <table className="table">
                <thead>
                  <tr>
                    <th scope="col">Name</th>
                    <th scope="col">Actions</th>
                  </tr>
                </thead>
                <tbody>
                  {categories?.map((c) => (
                    <>
                      <tr>
                        <td key={c._id}>{c.name}</td>
                        <td>
                          <button
                            className="btn btn-primary ms-2"
                            onClick={() => {
                              setVisible(true);
                              setUpdatedName(c.name);
                              setSelected(c);
                            }}
                          >
                            Edit
                          </button>
                          <button
                            className="btn btn-danger ms-2"
                            onClick={() => {
                              handleDelete(c._id);
                            }}
                          >
                            Delete
                          </button>
                        </td>
                      </tr>
                    </>
                  ))}
                </tbody>
              </table>
            </div>
            <Modal
              onCancel={() => setVisible(false)}
              footer={null}
              visible={visible}
            >
              <CategoryForm
                value={updatedName}
                setValue={setUpdatedName}
                handleSubmit={handleUpdate}
              />
            </Modal>
          </div> */}
        </div>
      </div>
    </Layout>
  );
};

export const getServerSideProps = wrapper.getServerSideProps(
  (store) =>
    async ({ query }) => {
      console.log(
        "02 dashboard/admin/category/create.tsx store state on the server: ",
        store.getState().auth.user.email
      );
      return {
        props: {},
      };
    }
);

export default AdminDashboard;
