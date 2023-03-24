import axios from "axios";
import { NextPage } from "next";
import React, { useEffect, useState } from "react";
import { useAppDispatch, useAppSelector } from "../app/hooks";
import { wrapper } from "../app/store";
import Layout from "../components/Layout/Layout";
import { IUser, Role } from "../features/auth/types";
import {
  removeCartItemRedux,
  removeCartRedux,
  selectProduct,
} from "../features/product/productSlice";
import { cartTransform } from "../helpers/cart";
import Image from "next/image";
import DropIn from "braintree-web-drop-in-react";
import { selectAuth } from "../features/auth/authSlice";
import {
  createPaymentMutation,
  getClientTokenQuery,
} from "../graphql-client/order";
import { mutationClient, queryClient } from "../graphql-client";
import { useRouter } from "next/router";

type Props = {
  clientToken: string;
};

const CartPage: NextPage<Props> = (props) => {
  const { push } = useRouter();
  const { loading, user, accessToken } = useAppSelector(selectAuth);
  const dispatch = useAppDispatch();
  const { cart } = useAppSelector(selectProduct);
  const { cartLength, total } = cartTransform(cart);
  const [instance, setInstance] = useState<any>("");
  const [clientToken, setClientToken] = useState(props.clientToken);

  useEffect(() => {
    if (cart.length === 0) {
      setClientToken("");
    }
  }, [cart.length]);

  const removeCartItem = (id: string) => {
    dispatch(removeCartItemRedux(id));
  };

  const handlePayment = async () => {
    try {
      const { nonce } = await instance.requestPaymentMethod();
      const { resData } = (await mutationClient(
        accessToken,
        dispatch,
        createPaymentMutation,
        {
          nonce,
          cart: cart.map((item: any) => {
            const {
              id,
              name,
              description,
              price,
              categoryId,
              quantity,
              photo,
              shipping,
            } = item;
            return {
              id,
              name,
              description,
              price,
              categoryId,
              quantity,
              photo,
              shipping,
            };
          }),
          total,
          buyer: user.id,
        }
      )) as any;
      if (resData) {
        dispatch(removeCartRedux());
      }
    } catch (error) {
      console.log(error);
    }
  };
  return (
    <Layout>
      <div className=" cart-page">
        <div className="row">
          <div className="col-md-12">
            <h1 className="text-center bg-light p-2 mb-1">
              {user.name && accessToken ? `Hello  ${user.name}` : `Hello Guest`}
              <p className="text-center">
                {cartLength > 0
                  ? `You Have ${cartLength} items in your cart ${
                      user.name && accessToken
                        ? ""
                        : ", please login to checkout !"
                    }`
                  : " Your Cart Is Empty"}
              </p>
            </h1>
          </div>
        </div>
        <div className="container">
          <div className="row ">
            <div className="col-md-7  p-0 m-0">
              {cart?.map((p) => (
                <div className="row card flex-row" key={p.id}>
                  <div className="col-md-4">
                    <Image
                      src={`/images/${p.photo}`}
                      className="card-img-top"
                      alt={p.name}
                      width={100}
                      height={200}
                    />
                  </div>
                  <div className="col-md-4">
                    <p>{p.name}</p>
                    <p>{p.description.substring(0, 30)}</p>
                    <p>Price : {p.price}</p>
                    <p>Quantity : {p.quantity}</p>
                  </div>
                  <div className="col-md-4 cart-remove-btn">
                    <button
                      className="btn btn-danger"
                      onClick={() => {
                        removeCartItem(p.id);
                      }}
                    >
                      Remove
                    </button>
                  </div>
                </div>
              ))}
            </div>
            <div className="col-md-5 cart-summary ">
              <h2>Cart Summary</h2>
              <p>Total | Checkout | Payment</p>
              <hr />
              <h4>Total : {total} </h4>

              {!accessToken && (
                <>
                  <button
                    className="btn btn-outline-warning"
                    onClick={() => push("/login")}
                  >
                    Plase Login to checkout
                  </button>
                </>
              )}

              {accessToken &&
                user.role !== Role.Admin &&
                !user.address.address && (
                  <>
                    <button
                      className="btn btn-outline-warning"
                      // onClick={() =>
                      //   navigate("/login", {
                      //     state: "/cart",
                      //   })
                      // }
                    >
                      Update Address
                    </button>
                  </>
                )}

              <div className="mt-2">
                {accessToken &&
                  user.role !== Role.Admin &&
                  user.address.address &&
                  clientToken && (
                    <>
                      <DropIn
                        options={{
                          authorization: clientToken,
                          paypal: {
                            flow: "vault",
                          },
                        }}
                        onInstance={(instance) => setInstance(instance)}
                      />

                      {instance && (
                        <button
                          className="btn btn-primary"
                          onClick={handlePayment}
                          disabled={loading}
                        >
                          {loading ? "Processing ...." : "Make Payment"}
                        </button>
                      )}
                    </>
                  )}
              </div>
            </div>
          </div>
        </div>
      </div>
    </Layout>
  );
};

export const getServerSideProps = wrapper.getServerSideProps(
  (store) =>
    async ({ query }) => {
      let clientToken = "";
      const { dispatch, getState } = store;
      const { accessToken } = getState().auth;
      const { cart } = getState().product;
      console.log(
        "02 carts.tsx store state on the server: ",
        store.getState().auth.user.email
      );
      try {
        if (cart.length > 0) {
          const resData = await queryClient(
            accessToken,
            dispatch,
            getClientTokenQuery
          );
          if (resData) {
            clientToken = resData.data.getClientToken;
            return {
              props: {
                clientToken,
              },
            };
          }
          return {
            props: {
              clientToken,
            },
          };
        }
        return {
          props: {
            clientToken,
          },
        };
      } catch (error: any) {
        console.log(error.message);
        return {
          props: {
            clientToken,
          },
        };
      }
    }
);

export default CartPage;
