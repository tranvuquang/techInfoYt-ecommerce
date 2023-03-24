import { IProduct } from "../features/product/types";

export const cartTransform = (cart: IProduct[]) => {
  let cartLength = 0;
  let total = 0;
  cart.forEach((item) => {
    const { quantity, price } = item;
    cartLength = cartLength + item.quantity;
    total = total + quantity * price;
  });
  return { cartLength, total };
};
