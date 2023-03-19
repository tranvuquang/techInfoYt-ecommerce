import type { NextPage } from "next";
import { wrapper } from "../../../../app/store";
import React from "react";
import { Action, IUser } from "../../../../features/auth/types";
import { ICategory } from "../../../../features/auth/types";
import {
  productDefaultDataValue,
} from "../../../../features/product/types";
import { useAdmin } from "../../../../helpers/useAuthen";
import ProductCreateUpdate from "../../../../components/Form/ProductCreateUpdate";

type Props = {
  user: IUser;
  categories: ICategory[];
};

const ProductCreate: NextPage<Props> = (props) => {
  useAdmin();
  return (
    <ProductCreateUpdate
      title={"Dashboard - Create Product"}
      product={productDefaultDataValue}
      action={Action.Create}
      categories={props.categories}
    />
  );
};

export const getServerSideProps = wrapper.getServerSideProps(
  (store) =>
    async ({ query }) => {
      console.log(
        "02 dashboard/admin/products/create.tsx store state on the server: ",
        store.getState().auth.user.email
      );
      return {
        props: {
        },
      };
    }
);

export default ProductCreate;
