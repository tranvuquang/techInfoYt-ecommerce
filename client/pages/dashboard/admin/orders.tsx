import type { NextPage } from "next";
import { wrapper } from "../../../app/store";
import React, { useEffect, useState } from "react";
import Layout from "../../../components/Layout/Layout";
import AdminMenu from "../../../components/Layout/AdminMenu";
import { useAdmin } from "../../../helpers/useAuthen";
import { queryClient } from "../../../graphql-client";
import { useAppDispatch, useAppSelector } from "../../../app/hooks";
import { selectAuth } from "../../../features/auth/authSlice";
import { getAllOrdersQuery } from "../../../graphql-client/order";
import Image from "next/image";
import { Select } from "antd";
import moment from "moment";
const { Option } = Select;

type Props = {};

const AdminOrderPage: NextPage<Props> = (props) => {
  useAdmin();
  const { accessToken } = useAppSelector(selectAuth);
  const dispatch = useAppDispatch();
  const [orders, setOrders] = useState([]);
  useEffect(() => {
    (async () => {
      const resData = (await queryClient(
        accessToken,
        dispatch,
        getAllOrdersQuery
      )) as any;
      if (resData) {
        setOrders(resData.data.getAllOrders);
      }
    })();
  }, [accessToken, dispatch]);

  return (
    <Layout title={"All Orders Data"}>
      <div className="row dashboard">
        <div className="col-md-3">
          <AdminMenu />
        </div>
        <div className="col-md-9">
          <h1 className="text-center">All Orders</h1>
          {orders?.map((o: any, i) => {
            return (
              <div className="border shadow" key={i}>
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
                      <td>
                        {/* <Select
                          bordered={false}
                          onChange={(value) => handleChange(o._id, value)}
                          defaultValue={o?.status}
                        >
                          {status.map((s, i) => (
                            <Option key={i} value={s}>
                              {s}
                            </Option>
                          ))}
                        </Select> */}
                      </td>
                      <td>{o?.buyer?.name}</td>
                      <td>{moment(o?.createdAt).fromNow()}</td>
                      <td>{o?.payment.success ? "Success" : "Failed"}</td>
                      <td>{o.payment.amount}</td>
                    </tr>
                  </tbody>
                </table>
                <div className="container">
                  {o?.cart?.map((p: any) => (
                    <div className="row mb-2 p-3 card flex-row" key={p.id}>
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
    </Layout>
  );
};

export const getServerSideProps = wrapper.getServerSideProps(
  (store) =>
    async ({ query }) => {
      console.log(
        "02 dashboard/admin/orders.tsx store state on the server: ",
        store.getState().auth.user.email
      );
      return {
        props: {},
      };
    }
);

export default AdminOrderPage;
