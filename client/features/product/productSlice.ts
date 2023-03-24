import { createSlice } from "@reduxjs/toolkit";
import { setCookie } from "cookies-next";
import { RootState } from "../../app/store";
import { nextYear } from "../auth/types";
import { IProduct, ProductState } from "./types";

const initialState: ProductState = {
  products: [],
  cart: [],
};

export const productSlice = createSlice({
  name: "product",
  initialState,
  reducers: {
    setCartFromCookieToRedux: (state, action) => {
      state.cart = action.payload;
    },
    setCartToCookieRedux: (state, action) => {
      const product = { ...action.payload, quantity: 1 };
      const productFounder = state.cart.find((p) => {
        return p.id === product.id;
      });
      if (!productFounder) {
        state.cart = [...state.cart, product];
        setCookie("cart", `${JSON.stringify(state.cart)}`, {
          expires: nextYear,
        });
      } else {
        let newCart = [...state.cart] as any;
        state.cart = newCart.map((p: IProduct) => {
          return p.id !== product.id ? p : { ...p, quantity: p.quantity + 1 };
        });
        setCookie("cart", `${JSON.stringify(state.cart)}`, {
          expires: nextYear,
        });
      }
    },
    removeCartItemRedux: (state, action) => {
      let newCart = state.cart.filter((p) => {
        return p.id !== action.payload;
      });
      state.cart = newCart;
      setCookie("cart", `${JSON.stringify(state.cart)}`, {
        expires: nextYear,
      });
    },
    removeCartRedux: (state) => {
      state.cart = [];
      setCookie("cart", `${JSON.stringify(state.cart)}`, {
        expires: nextYear,
      });
    },
  },
});

export const {
  setCartFromCookieToRedux,
  setCartToCookieRedux,
  removeCartItemRedux,
  removeCartRedux,
} = productSlice.actions;

export const selectProduct = (state: RootState) => state.product;

export default productSlice.reducer;
