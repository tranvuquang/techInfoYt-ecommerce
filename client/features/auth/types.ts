export enum Role {
  Admin = "admin",
  User = "user",
}

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
