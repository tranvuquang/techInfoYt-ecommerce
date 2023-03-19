export type IProduct = {
  id: string;
  name: string;
  description: string;
  price: number;
  quantity: number;
  category: string[];
  photo: string;
  shipping: boolean;
};

export const productDefaultDataValue = {
  id: "",
  name: "",
  description: "",
  price: 0,
  quantity: 0,
  category: [],
  photo: "",
  shipping: false,
};
