import type { NextPage } from "next";
import { wrapper } from "../../../app/store";
import React, { useEffect, useState } from "react";
import { IUser } from "../../../features/auth/types";
import Layout from "../../../components/Layout/Layout";
import { useAppDispatch, useAppSelector } from "../../../app/hooks";
import { selectAuth } from "../../../features/auth/authSlice";
import AdminMenu from "../../../components/Layout/AdminMenu";
import { useAdmin } from "../../../helpers/useAuthen";
import CategoryForm from "../../../components/Form/CategoryForm";
import { useQuery } from "@apollo/client";
import { getCategoriesQuery } from "../../../graphql-client/category/queries";
import { mutationClient, queryClient } from "../../../graphql-client/config";
import { Button } from "react-bootstrap";
import {
  CategoryAction,
  categoryDefaultData,
  ICategory,
} from "../../../features/category/types";

import { Modal } from "antd";
import {
  createCategoryMutation,
  deleteCategoryMutation,
  updateCategoryMutation,
} from "../../../graphql-client/category/mutations";

type Props = {
  user: IUser;
  categories: any[];
};

const Categories: NextPage<Props> = (props) => {
  useAdmin();
  const { user, accessToken } = useAppSelector(selectAuth);
  const dispatch = useAppDispatch();
  const {} = user;
  const [categories, setCategories] = useState<ICategory[]>([]);
  const [visible, setVisible] = useState(false);
  const [category, setCategory] = useState<ICategory>(categoryDefaultData);
  const { id, name } = category;
  const [action, setAction] = useState(CategoryAction.Create);

  useEffect(() => {
    if (props.categories.length > 0) {
      setCategories(props.categories);
    }
  }, [props.categories]);

  const handleSubmit = async (e: React.SyntheticEvent) => {
    e.preventDefault();
    try {
      if (id) {
        const { resData, reFetchData } = (await mutationClient(
          accessToken,
          dispatch,
          updateCategoryMutation,
          {
            id,
            name,
          },
          getCategoriesQuery
        )) as any;
        if (resData && reFetchData) {
          setCategories(reFetchData.data.getCategories);
          setCategory(categoryDefaultData);
          setVisible(false);
        }
      } else {
        const { resData, reFetchData } = (await mutationClient(
          accessToken,
          dispatch,
          createCategoryMutation,
          {
            name,
          },
          getCategoriesQuery
        )) as any;
        if (resData && reFetchData) {
          setCategories(reFetchData.data.getCategories);
          setCategory(categoryDefaultData);
          setVisible(false);
        }
      }
    } catch (error: any) {
      console.log(error.message);
    }
  };

  const onOpenAddNewCategoryForm = () => {
    setCategory(categoryDefaultData);
    setAction(CategoryAction.Create);
    setVisible(true);
  };

  const onOpenUpdateCategoryForm = ({ id, name }: ICategory) => {
    setCategory({ id, name });
    setAction(CategoryAction.Update);
    setVisible(true);
  };

  const handleDelete = async (id: string) => {
    try {
      if (id) {
        const { resData, reFetchData } = (await mutationClient(
          accessToken,
          dispatch,
          deleteCategoryMutation,
          {
            id,
          },
          getCategoriesQuery
        )) as any;
        if (resData && reFetchData) {
          setCategories(reFetchData.data.getCategories);
          setCategory(categoryDefaultData);
        }
      }
    } catch (error: any) {
      console.log(error.message);
    }
  };
  return (
    <Layout title={"Dashboard - Create Category"}>
      <div className="container-fluid dashboard">
        <div className="row">
          <div className="col-md-3">
            <AdminMenu />
          </div>
          <div className="col-md-9">
            <div className="d-flex justify-content-between">
              <h1>Manage Category</h1>
              <Button onClick={onOpenAddNewCategoryForm}>Add New</Button>
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
                  {categories &&
                    categories.length > 0 &&
                    categories?.map((c) => (
                      <tr key={c.id}>
                        <td>{c.name}</td>
                        <td>
                          <button
                            className="btn btn-primary ms-2"
                            onClick={() => {
                              onOpenUpdateCategoryForm({
                                id: c.id,
                                name: c.name,
                              });
                            }}
                          >
                            Edit
                          </button>
                          <button
                            className="btn btn-danger ms-2"
                            onClick={() => {
                              handleDelete(c.id);
                            }}
                          >
                            Delete
                          </button>
                        </td>
                      </tr>
                    ))}
                </tbody>
              </table>
            </div>
            <Modal
              open={visible}
              onCancel={() => setVisible(false)}
              footer={null}
              style={{ top: "120px" }}
            >
              <CategoryForm
                handleSubmit={handleSubmit}
                value={name}
                setValue={(name: string) => {
                  setCategory({ ...category, name });
                }}
                action={action}
              />
            </Modal>
          </div>
        </div>
      </div>
    </Layout>
  );
};

export const getServerSideProps = wrapper.getServerSideProps(
  (store) =>
    async ({ query }) => {
      let categories = [];
      const { dispatch, getState } = store;
      const { accessToken } = getState().auth;
      console.log(
        "02 dashboard/admin/categories.tsx store state on the server: ",
        store.getState().auth.user.email
      );
      try {
        const resData = await queryClient(
          accessToken,
          dispatch,
          getCategoriesQuery
        );
        if (resData) {
          categories = resData.data.getCategories;
          return {
            props: {
              categories,
            },
          };
        }
      } catch (error: any) {
        console.log(error.message);
      }
      return {
        props: {
          categories,
        },
      };
    }
);

export default Categories;
