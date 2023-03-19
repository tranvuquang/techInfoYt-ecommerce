import type { NextPage } from "next";
import { wrapper } from "../../../../app/store";
import React from "react";
import { Action, IUser } from "../../../../features/auth/types";

import { ICategory } from "../../../../features/auth/types";
import {
  IProduct,
  productDefaultDataValue,
} from "../../../../features/product/types";
import { useAdmin } from "../../../../helpers/useAuthen";
import { queryClient } from "../../../../graphql-client/config";
import { getProductQuery } from "../../../../graphql-client/product";
import ProductCreateUpdate from "../../../../components/Form/ProductCreateUpdate";

type Props = {
  user: IUser;
  categories: ICategory[];
  product: IProduct;
};

const ProductUpdate: NextPage<Props> = (props) => {
  useAdmin();
  return (
    <ProductCreateUpdate
      title={"Dashboard - Update Product"}
      product={props.product}
      action={Action.Update}
      categories={props.categories}
    />
  );
};

export const getServerSideProps = wrapper.getServerSideProps(
  (store) =>
    async ({ query }) => {
      const { id } = query;
      let product = productDefaultDataValue;
      const { dispatch, getState } = store;
      const { accessToken } = getState().auth;
      console.log(
        "02 dashboard/admin/products/[id].tsx store state on the server: ",
        store.getState().auth.user.email
      );
      try {
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
            return {
              props: {
                product,
              },
            };
          }
        }
      } catch (error: any) {
        console.log(error.message);
      }
      return {
        props: {
          product,
        },
      };
    }
);

export default ProductUpdate;
