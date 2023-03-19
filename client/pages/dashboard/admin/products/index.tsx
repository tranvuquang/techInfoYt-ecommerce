import type { NextPage } from "next";
import { wrapper } from "../../../../app/store";
import React, { useEffect, useState } from "react";
import { IUser } from "../../../../features/auth/types";
import Layout from "../../../../components/Layout/Layout";
import AdminMenu from "../../../../components/Layout/AdminMenu";
import { IProduct } from "../../../../features/product/types";
import { queryClient } from "../../../../graphql-client/config";
import { getProductsQuery } from "../../../../graphql-client/product";
import Link from "next/link";
import Image from "next/image";
import { useAdmin } from "../../../../helpers/useAuthen";


type Props = {
  user: IUser;
  products: IProduct[];
};

const ProductsPage: NextPage<Props> = (props) => {
  useAdmin()
  const [products, setProducts] = useState<IProduct[]>([]);
  useEffect(() => {
    if (props.products.length > 0) {
      setProducts(props.products);
    }
  }, [props.products]);

  return (
    <Layout>
      <div className="row dashboard">
        <div className="col-md-3">
          <AdminMenu />
        </div>
        <div className="col-md-9 ">
          <h1 className="text-center">All Products List</h1>
          <div className="d-flex flex-wrap">
            {products?.map((p) => (
              <Link
                key={p.id}
                href={`/dashboard/admin/products/${p.id}`}
                className="product-link"
              >
                <div className="card m-2" style={{ width: "18rem" }}>
                  <Image
                    src={`/images/${p.photo}`}
                    className="card-img-top"
                    alt={p.name}
                    width={200}
                    height={200}
                  />
                  <div className="card-body">
                    <h5 className="card-title">{p.name}</h5>
                    <p className="card-text">{p.description}</p>
                  </div>
                </div>
              </Link>
            ))}
          </div>
        </div>
      </div>
    </Layout>
  );
};

export const getServerSideProps = wrapper.getServerSideProps(
  (store) =>
    async ({ query }) => {
      let products: IProduct[] = [];
      const { dispatch, getState } = store;
      const { accessToken } = getState().auth;
      console.log(
        "02 dashboard/admin/products/index.tsx store state on the server: ",
        store.getState().auth.user.email
      );
      try {
        const resData = await queryClient(
          accessToken,
          dispatch,
          getProductsQuery
        );
        if (resData) {
          products = resData.data.getProducts;
          return {
            props: {
              products,
            },
          };
        }
      } catch (error: any) {
        console.log(error.message);
      }
      return {
        props: {
          products,
        },
      };
    }
);

export default ProductsPage;
