import axios from "axios";
import { NextPage } from "next";
import React, { useState } from "react";
import { toast } from "react-toastify";
import { useAppDispatch } from "../app/hooks";
import { wrapper } from "../app/store";
import Layout from "../components/Layout/Layout";
import { setAccessTokenRedux, setUserRedux } from "../features/auth/authSlice";
import { IUser } from "../features/auth/types";
import { useAuthen } from "../helpers/useAuthen";

type FormData = {
  email: string;
  password: string;
};
const formDataDefaultValue = {
  email: "admin@gmail.com",
  password: "123456",
};

type Props = {
  user: IUser;
};

const Login: NextPage<Props> = (props) => {
  useAuthen();
  const dispatch = useAppDispatch();
  const [formData, setFormData] = useState<FormData>(formDataDefaultValue);
  const { email, password } = formData;
  const handleChange = (evt: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = evt.target;
    setFormData({ ...formData, [name]: value });
  };
  const handleSubmit = async (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    try {
      const res = await axios.post("/api/login", formData);
      if (res) {
        dispatch(setAccessTokenRedux(res.data.accessToken));
        dispatch(setUserRedux(res.data.user));
        toast.success("Login successful");
      }
    } catch (error: any) {
      console.log(error.message);
      toast.error("Login false");
    }
  };
  return (
    <Layout title="Register - Ecommer App">
      <div className="form-container">
        <form onSubmit={handleSubmit}>
          <h4 className="title text-center mb-5">LOGIN FORM</h4>
          <div className="my-4">
            <input
              autoFocus
              name="email"
              value={email}
              onChange={handleChange}
              className="form-control"
              id="exampleInputEmail1"
              placeholder="Enter Your Email "
              required
            />
          </div>
          <div className="mb-5">
            <input
              value={password}
              name="password"
              onChange={handleChange}
              className="form-control"
              id="exampleInputPassword1"
              placeholder="Enter Your Password"
              required
            />
          </div>
          <button type="submit" className="btn btn-primary">
            LOGIN
          </button>
        </form>
      </div>
    </Layout>
  );
};

export const getServerSideProps = wrapper.getServerSideProps(
  (store) =>
    async ({ query }) => {
      console.log(
        "02 login.tsx store state on the server: ",
        store.getState().auth.user.email
      );
      return {
        props: {
          // data,
        }, // will be passed to the page component as props
      };
    }
);

export default Login;
