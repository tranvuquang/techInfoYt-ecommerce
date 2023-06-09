export type IProduct = {
  id: string;
  name: string;
  description: string;
  price: number;
  quantity: number;
  categoryId: string;
  photo: string;
  shipping: boolean;
};

export const productDefaultValue = {
  id: "",
  name: "",
  description: "",
  price: 0,
  quantity: 0,
  categoryId: "",
  photo: "",
  shipping: false,
};

export type IProductFilter = {
  page: number;
  limit: number;
  total: number;
  category: string[];
  searchStr: string;
  homeSearch: string;
  price: number[];
};

export const productFilterDefaultValue = {
  page: 1,
  limit: 3,
  total: 10,
  category: [],
  searchStr: "",
  homeSearch: "",
  price: [0, 100000],
};

export type ProductState = {
  products: IProduct[];
  cart: IProduct[];
  productFilter: IProductFilter;
  reset: boolean;
};
