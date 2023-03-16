import axios from "axios";
import { NextPage } from "next";
import React, { useState } from "react";
import { useAppDispatch } from "../app/hooks";
import { wrapper } from "../app/store";
import { setAccessTokenRedux, setUserRedux } from "../features/auth/authSlice";
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
  user: {
    id: string;
    email: string;
  };
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
    const res = await axios.post("/api/login", formData);
    if (res) {
      dispatch(setAccessTokenRedux(res.data.accessToken));
      dispatch(setUserRedux(res.data.user));
    }
  };
  return (
    <div className="ass1-login">
      <div className="ass1-login__logo">
        <a href="index.html" className="ass1-logo">
          ZendVn Meme
        </a>
      </div>
      <div className="ass1-login__content">
        <p>Đăng nhập</p>
        <div className="ass1-login__form">
          <form onSubmit={handleSubmit}>
            <input
              type="text"
              className="form-control"
              placeholder="Email"
              name="email"
              onChange={handleChange}
              required
              value={email}
            />
            <div className="ass1-input-copy">
              <input
                type="text"
                className="form-control"
                placeholder="Mật khẩu"
                name="password"
                onChange={handleChange}
                value={password}
                required
              />
            </div>
            <div className="ass1-login__send">
              <a href="dang-ky.html">Đăng ký một tài khoản</a>
              <button type="submit" className="ass1-btn">
                Đăng nhập
              </button>
            </div>
          </form>
        </div>
      </div>
    </div>
  );
};

export const getServerSideProps = wrapper.getServerSideProps(
  (store) =>
    async ({ query }) => {
      console.log(
        "02 login.tsx store state on the server: ",
        store.getState().auth.user
      );
      return {
        props: {
          // data,
        }, // will be passed to the page component as props
      };
    }
);

export default Login;
