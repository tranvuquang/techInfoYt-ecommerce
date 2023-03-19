export enum Role {
  Admin = "admin",
  User = "user",
}
export enum Action {
  Create = "create",
  Update = "update",
}

export type ICategory = {
  id: string;
  name: string;
};

export type IUser = {
  id: string;
  email: string;
  name: string;
  phone: string;
  address: { address: string };
  answer: string;
  role: Role;
  accessToken: String;
};

export type AuthState = {
  user: IUser;
  accessToken: string;
  loading: boolean;
  categories: ICategory[];
};

export const userDefaultData = {
  id: "",
  email: "",
  name: "",
  phone: "",
  address: { address: "vietname" },
  answer: "ok",
  role: Role.User,
  accessToken: "",
};

export const categoryDefaultData = {
  id: "",
  name: "",
};
