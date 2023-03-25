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
  address: { address: string; country: string };
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
  address: { address: "", country: "vietnam" },
  answer: "ok",
  role: Role.User,
  accessToken: "",
};

export const categoryDefaultData = {
  id: "",
  name: "",
};

const currentTime = new Date();
export const nextYear = new Date(
  currentTime.getFullYear() + 1,
  currentTime.getMonth()
);
