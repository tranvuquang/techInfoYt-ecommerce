import type { NextPage } from "next";
import { wrapper } from "../../app/store";
import React from "react";
import { ICategory, IUser } from "../../features/auth/types";
import Layout from "../../components/Layout/Layout";
import AdminMenu from "../../components/Layout/AdminMenu";
import { useAdmin } from "../../helpers/useAuthen";
import {
  IProduct,
  productDefaultDataValue,
  productFilterDefaultDataValue,
} from "../../features/product/types";
import { queryClient } from "../../graphql-client/config";
import {
  getProductQuery,
  getProductsQuery,
} from "../../graphql-client/product";
import Image from "next/image";
import { useRouter } from "next/router";

type Props = {
  user: IUser;
  product: IProduct;
  categories: ICategory[];
  products: IProduct[];
};

const ProductDetail: NextPage<Props> = ({ product, categories, products }) => {
  const { push } = useRouter();
  return (
    <Layout>
      <div className="row container product-details">
        <div className="col-md-6">
          <Image
            src={`/images/${product.photo}`}
            className="card-img-top"
            alt={product.name}
            width={200}
            height={200}
          />
        </div>
        <div className="col-md-6 product-details-info">
          <h1 className="text-center">Product Details</h1>
          <hr />
          <h6>Name : {product.name}</h6>
          <h6>Description : {product.description}</h6>
          <h6>
            Price :
            {product?.price?.toLocaleString("en-US", {
              style: "currency",
              currency: "USD",
            })}
          </h6>
          <h6>Category : {product.categoryId}</h6>
          <button className="btn btn-secondary ms-1">ADD TO CART</button>
        </div>
      </div>
      <hr />

      <div className="row container similar-products">
        <h4>Similar Products ➡️</h4>
        {products.length < 1 && (
          <p className="text-center">No Similar Products found</p>
        )}
        <div className="d-flex flex-wrap">
          {products?.map((p) => (
            <div className="card m-2" key={p.id}>
              <Image
                src={`/images/${p.photo}`}
                className="card-img-top"
                alt={p.name}
                width={200}
                height={200}
              />
              <div className="card-body">
                <div className="card-name-price">
                  <h5 className="card-title">{p.name}</h5>
                  <h5 className="card-title card-price">
                    {p.price.toLocaleString("en-US", {
                      style: "currency",
                      currency: "USD",
                    })}
                  </h5>
                </div>
                <p className="card-text ">
                  {p.description.substring(0, 60)}...
                </p>
                <div className="card-name-price">
                  <button
                    className="btn btn-info ms-1"
                    onClick={() => push(`/products/${p.id}`)}
                  >
                    More Details
                  </button>
                  {/* <button
                  className="btn btn-dark ms-1"
                  onClick={() => {
                    setCart([...cart, p]);
                    localStorage.setItem(
                      "cart",
                      JSON.stringify([...cart, p])
                    );
                    toast.success("Item Added to cart");
                  }}
                >
                  ADD TO CART
                </button> */}
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>
    </Layout>
  );
};

export const getServerSideProps = wrapper.getServerSideProps(
  (store) =>
    async ({ query }) => {
      const { id } = query;
      let product = productDefaultDataValue;
      let productsArr: any = [];
      const { dispatch, getState } = store;
      const { accessToken, categories } = getState().auth;
      const allCategories = categories.map((category) => {
        return category.id;
      });
      console.log(
        "02 products/[id].tsx store state on the server: ",
        store.getState().auth.user.email
      );
      const { page, limit, searchStr, price } = productFilterDefaultDataValue;

      if (id) {
        const resData = await queryClient(
          accessToken,
          dispatch,
          getProductQuery,
          {
            id,
          }
        );
        if (resData) {
          const { createdAt, updatedAt, ...productData } =
            resData.data.getProduct;
          product = productData;
        }
      }

      const resDataAll = await queryClient(
        accessToken,
        dispatch,
        getProductsQuery,
        {
          page,
          limit: 7,
          category: allCategories,
          searchStr,
          price,
        }
      );
      if (resDataAll) {
        const { products } = resDataAll.data.getProducts;
        productsArr = products.filter((product: any) => {
          return product.id !== id;
        });
      }

      return {
        props: {
          product,
          products: productsArr,
        },
      };
    }
);

export default ProductDetail;
