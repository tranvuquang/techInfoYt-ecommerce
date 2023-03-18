export type ICategory = {
  id: string;
  name: string;
};

export enum CategoryAction {
  Create = "create",
  Update = "update",
}

export const categoryDefaultData = {
  id: "",
  name: "",
};
