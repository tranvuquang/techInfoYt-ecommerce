import { Select } from "antd";
import React, { useRef, useState } from "react";
import { Action, ICategory} from "../../features/auth/types";
import { IProduct } from "../../features/product/types";
import { file2Base64 } from "../../ultis/file";
import AdminMenu from "../Layout/AdminMenu";
import Layout from "../Layout/Layout";
import Image from "next/image";
import { mutationClient } from "../../graphql-client";
import { useAppDispatch, useAppSelector } from "../../app/hooks";
import { selectAuth } from "../../features/auth/authSlice";
import {
  createProductMutation,
  deleteProductMutation,
  updateProductMutation,
} from "../../graphql-client/product";
import { useRouter } from "next/router";

type Props = {
  product: IProduct;
  categories: ICategory[];
  action: Action;
  title: string;
};

const ProductCreateUpdate = (props: Props) => {
  const { push } = useRouter();
  const dispatch = useAppDispatch();
  const { accessToken } = useAppSelector(selectAuth);
  let inputFileEl = useRef(null);
  const [product, setProduct] = useState<IProduct>(props.product);
  const { id, name, description, categoryId, price, quantity, shipping, photo } =
    product;
  const [base64, setBase64] = useState("");

  const onChange = (
    e: React.ChangeEvent<HTMLTextAreaElement | HTMLInputElement>
  ) => {
    const { name, value } = e.target;
    setProduct({ ...product, [name]: value });
  };

  const handleClickSelectFile = () => {
    if (inputFileEl && inputFileEl.current) {
      const current = inputFileEl.current as any;
      current.click() as any;
    }
  };
  const onChangeFile = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const files = e.target.files;
    if (files) {
      const base64 = (await file2Base64(files[0])) as string;
      setBase64(base64);
      setProduct({ ...product, photo: files[0].name });
    }
  };

  const handleUpdate = async (e: React.SyntheticEvent) => {
    e.preventDefault();
    try {
      if (props.action === Action.Update) {
        const { resData } = (await mutationClient(
          accessToken,
          dispatch,
          updateProductMutation,
          {
            product: {
              id,
              name,
              description,
              categoryId,
              price: Number(price),
              quantity: Number(quantity),
              shipping,
              photo,
            },
          }
        )) as any;
        if (resData) {
          push("/dashboard/admin/products");
        }
      }

      if (props.action === Action.Create) {
        const { resData } = (await mutationClient(
          accessToken,
          dispatch,
          createProductMutation,
          {
            product: {
              name,
              description,
              categoryId,
              price: Number(price),
              quantity: Number(quantity),
              shipping,
              photo,
            },
          }
        )) as any;
        if (resData) {
          push("/dashboard/admin/products");
        }
      }
    } catch (error: any) {
      console.log(error.message);
    }
  };

  const handleDelete = async () => {
    if(id){
      const { resData } = (await mutationClient(
        accessToken,
        dispatch,
        deleteProductMutation,
        {
          id
        }
      )) as any;
      if (resData) {
        push("/dashboard/admin/products");
      }
    }
  };

  const img = base64 ? base64 : `/images/${photo}`;

  return (
    <Layout title={props.title}>
      <div className="container-fluid m-3 p-3">
        <div className="row">
          <div className="col-md-3">
            <AdminMenu />
          </div>
          <div className="col-md-9">
            <h1>{props.action.toLocaleUpperCase()} PRODUCT</h1>
            <div className="m-1 w-75">
              <Select
                bordered={false}
                placeholder="Select a category"
                size="large"
                showSearch
                className="form-select mb-3"
                onChange={(value) => {
                  setProduct({ ...product, categoryId: value });
                }}
                value={categoryId}
              >
                {props.categories?.map((c) => (
                  <Select.Option key={c.id} value={c.id}>
                    {c.name}
                  </Select.Option>
                ))}
              </Select>
              <div className="mb-3">
                <input
                  ref={inputFileEl}
                  type="file"
                  name="photo"
                  accept="image/*"
                  onChange={onChangeFile}
                  hidden
                />
              </div>
              <div className="mb-3">
                <div className="text-center">
                  <Image
                    onClick={handleClickSelectFile}
                    src={img}
                    className="card-img-top"
                    alt={product.name}
                    width={200}
                    height={200}
                  />
                </div>
              </div>
              <div className="mb-3">
                <input
                  type="text"
                  placeholder="write a name"
                  className="form-control"
                  name="name"
                  value={name}
                  onChange={onChange}
                />
              </div>
              <div className="mb-3">
                <textarea
                  name="description"
                  placeholder="write a description"
                  className="form-control"
                  value={description}
                  onChange={onChange}
                />
              </div>

              <div className="mb-3">
                <input
                  type="number"
                  value={price}
                  name="price"
                  placeholder="write a Price"
                  className="form-control"
                  onChange={onChange}
                />
              </div>
              <div className="mb-3">
                <input
                  type="number"
                  value={quantity}
                  name="quantity"
                  placeholder="write a quantity"
                  className="form-control"
                  onChange={onChange}
                />
              </div>
              <div className="mb-3">
                <Select
                  bordered={false}
                  placeholder="Select Shipping "
                  size="large"
                  showSearch
                  className="form-select mb-3"
                  onChange={(value) => {
                    setProduct({
                      ...product,
                      shipping: value === "Yes" ? true : false,
                    });
                  }}
                  value={shipping ? "Yes" : "No"}
                >
                  <Select.Option value="Yes">Yes</Select.Option>
                  <Select.Option value="No">No</Select.Option>
                </Select>
              </div>
              <div className="mb-3">
                <button
                  className="btn btn-warning"
                  onClick={() => {
                    push("/dashboard/admin/products/");
                  }}
                >
                  CANCEL
                </button>
              </div>
              <div className="mb-3">
                <button className="btn btn-primary" onClick={handleUpdate}>
                  {props.action.toLocaleUpperCase()} PRODUCT
                </button>
              </div>
              {props.action === Action.Update && (
                <div className="mb-3">
                  <button className="btn btn-danger" onClick={handleDelete}>
                    DELETE PRODUCT
                  </button>
                </div>
              )}
            </div>
          </div>
        </div>
      </div>
    </Layout>
  );
};

export default ProductCreateUpdate;
