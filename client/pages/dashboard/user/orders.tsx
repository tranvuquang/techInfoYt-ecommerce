import type { NextPage } from "next";
import { wrapper } from "../../../app/store";
import React from "react";
import Layout from "../../../components/Layout/Layout";
import { useUser } from "../../../helpers/useAuthen";
import UserMenu from "../../../components/Layout/UserMenu";
import { queryClient } from "../../../graphql-client";
import { getOrdersByBuyerIdQuery } from "../../../graphql-client/order";
import moment from "moment";
import Image from "next/image";

type Props = {
  orders: any;
};

const UserOrderDashboard: NextPage<Props> = ({ orders }) => {
  useUser();
  return (
    <Layout title={"Your Orders"}>
      <div className="container-flui p-3 m-3 dashboard">
        <div className="row">
          <div className="col-md-3">
            <UserMenu />
          </div>
          <div className="col-md-9">
            <h1 className="text-center">All Orders</h1>
            {orders?.map((o: any, i: number) => {
              return (
                <div className="border shadow" key={o.id}>
                  <table className="table">
                    <thead>
                      <tr>
                        <th scope="col">#</th>
                        <th scope="col">Status</th>
                        <th scope="col">Buyer</th>
                        <th scope="col"> date</th>
                        <th scope="col">Payment</th>
                        <th scope="col">Total</th>
                      </tr>
                    </thead>
                    <tbody>
                      <tr>
                        <td>{i + 1}</td>
                        <td>{o?.status}</td>
                        <td>{o?.buyer?.name}</td>
                        <td>{moment(o?.createdAt).fromNow()}</td>
                        <td>{o?.payment.success ? "Success" : "Failed"}</td>
                        <td>{o.payment.amount}</td>
                      </tr>
                    </tbody>
                  </table>
                  <div className="container">
                    {o?.cart?.map((p: any, i: number) => (
                      <div className="row mb-2 p-3 card flex-row" key={p._id}>
                        <div className="col-md-4">
                          <Image
                            src={`/images/${p.photo}`}
                            className="card-img-top"
                            alt={p.name}
                            width={100}
                            height={150}
                          />
                        </div>
                        <div className="col-md-8">
                          <p>{p.name}</p>
                          <p>{p.description.substring(0, 30)}</p>
                          <p>Price : {p.price}</p>
                          <p>Quantity : {p.quantity}</p>
                        </div>
                      </div>
                    ))}
                  </div>
                </div>
              );
            })}
          </div>
        </div>
      </div>
    </Layout>
  );
};

export const getServerSideProps = wrapper.getServerSideProps(
  (store) =>
    async ({ query }) => {
      let orders: any = [];
      const { dispatch, getState } = store;
      const { accessToken, user } = getState().auth;
      console.log(
        "02 dashboard/user/orders.tsx store state on the server: ",
        store.getState().auth.user.email
      );

      try {
        const resData = (await queryClient(
          accessToken,
          dispatch,
          getOrdersByBuyerIdQuery,
          {
            id: user.id,
          }
        )) as any;

        if (resData) {
          orders = resData.data.getOrdersByBuyerId as any;
          return {
            props: {
              orders,
            },
          };
        }
      } catch (error) {
        return {
          props: {
            orders,
          },
        };
      }
      return {
        props: {
          orders,
        },
      };
    }
);

export default UserOrderDashboard;
