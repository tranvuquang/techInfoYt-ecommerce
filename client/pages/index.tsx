import type { NextPage } from "next";

import { wrapper } from "../app/store";
import React, { useEffect, useState } from "react";
import { Prices } from "../components/Prices";
import { ICategory } from "../features/auth/types";
import Layout from "../components/Layout/Layout";
import Image from "next/image";
import { Checkbox, Radio } from "antd";
import { IProduct, productFilterDefaultValue } from "../features/product/types";
import { queryClient } from "../graphql-client";
import { getProductsQuery } from "../graphql-client/product";
import { useAppDispatch, useAppSelector } from "../app/hooks";
import { selectAuth } from "../features/auth/authSlice";
import { useRouter } from "next/router";
import {
  selectProduct,
  setCartToCookieRedux,
  setProductFilterRedux,
  setResetRedux,
} from "../features/product/productSlice";

type Props = {
  categories: ICategory[];
};

const HomePage: NextPage<Props> = (props) => {
  let categoriesDefault = props.categories.map((category) => {
    return {
      id: category.id,
      name: category.name,
      checked: false,
    };
  });
  const allCategories = props.categories.map((category) => {
    return category.id;
  });
  const [categoriesArr, setCategoriesArr] = useState(categoriesDefault);
  const [products, setProducts] = useState<IProduct[]>([]);

  const { loading } = useAppSelector(selectAuth);
  const { productFilter, reset } = useAppSelector(selectProduct);
  const { page, limit, price, category, searchStr, homeSearch } = productFilter;
  const dispatch = useAppDispatch();
  const { push } = useRouter();

  const handleFilterCheckbox = (value: boolean, id: string) => {
    let all: any[] = [...category];
    let arr: any[] = categoriesArr.map((c) => c);
    if (value === true) {
      all.push(id);
      arr = arr.map((item) => {
        return item.id === id ? { ...item, checked: true } : item;
      });
    } else {
      all = all.filter((c: any) => c !== id);
      arr = arr.map((item) => {
        return item.id === id ? { ...item, checked: false } : item;
      });
    }
    setCategoriesArr(arr);
    dispatch(setProductFilterRedux({ ...productFilter, category: all }));
  };

  useEffect(() => {
    (async () => {
      try {
        const resData = await queryClient("", dispatch, getProductsQuery, {
          page,
          limit,
          category: category.length === 0 ? allCategories : category,
          searchStr: homeSearch ? homeSearch : searchStr ? searchStr : "",
          price,
        });
        if (resData) {
          const { products } = resData.data.getProducts;
          setProducts(products);
          dispatch(
            setProductFilterRedux({
              ...productFilter,
              total: resData.data.getProducts.filter.total,
            })
          );
        }
      } catch (error: any) {
        console.log(error.message);
      }
    })();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [category, dispatch, limit, page, price, homeSearch]);

  const handleLoadmore = () => {
    dispatch(
      setProductFilterRedux({
        ...productFilter,
        limit: productFilter.limit + productFilterDefaultValue.limit,
      })
    );
  };

  const handleAddToCart = (p: IProduct) => {
    dispatch(setCartToCookieRedux(p));
  };

  useEffect(() => {
    setCategoriesArr(categoriesDefault);
    dispatch(setProductFilterRedux(productFilterDefaultValue));
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [reset]);

  return (
    <Layout title={"ALl Products - Best offers "}>
      <div className="home-page" style={{}}>
        <Image
          style={{ transform: "translateY(-16px)" }}
          src={`/images/banner.png`}
          className="card-img-top"
          alt="bannerimage"
          width={865}
          height={150}
        />
        <div className="container-fluid row mt-3 home-page">
          <div className="col-md-3 filters">
            <h4 className="text-center">Filter By Category</h4>
            <div className="d-flex flex-column">
              {categoriesArr.map((c) => {
                return (
                  <Checkbox
                    checked={c.checked}
                    key={c.id}
                    onChange={(e) =>
                      handleFilterCheckbox(e.target.checked, c.id)
                    }
                  >
                    {c.name}
                  </Checkbox>
                );
              })}
            </div>
            {/* price filter */}
            <h4 className="text-center mt-4">Filter By Price</h4>
            <div className="d-flex flex-column">
              <Radio.Group
                value={price}
                onChange={(e) => {
                  dispatch(
                    setProductFilterRedux({
                      ...productFilter,
                      price: e.target.value,
                    })
                  );
                }}
              >
                {Prices?.map((p) => (
                  <div key={p._id}>
                    <Radio value={p.array}>{p.name}</Radio>
                  </div>
                ))}
              </Radio.Group>
            </div>
            <div className="d-flex flex-column">
              <button
                className="btn btn-danger"
                onClick={() => {
                  setCategoriesArr(categoriesDefault);
                  dispatch(setProductFilterRedux(productFilterDefaultValue));
                  dispatch(setResetRedux(!reset));
                }}
              >
                RESET FILTERS
              </button>
            </div>
          </div>
          <div className="col-md-9 ">
            <h1 className="text-center">All Products</h1>
            <div className="d-flex flex-wrap">
              {products?.map((p) => (
                <div className="card m-2" key={p.id}>
                  <Image
                    src={`/images/${p.photo}`}
                    className="card-img-top"
                    alt={p.name}
                    width={200}
                    height={200}
                  />
                  <div className="card-body">
                    <div className="card-name-price">
                      <h5 className="card-title">{p.name}</h5>
                      <h5 className="card-title card-price">
                        {p.price.toLocaleString("en-US", {
                          style: "currency",
                          currency: "USD",
                        })}
                      </h5>
                    </div>
                    <p className="card-text ">
                      {p.description.substring(0, 60)}...
                    </p>
                    <div className="card-name-price">
                      <button
                        className="btn btn-info ms-1"
                        onClick={() => push(`/products/${p.id}`)}
                      >
                        More Details
                      </button>
                      <button
                        className="btn btn-dark ms-1"
                        onClick={() => handleAddToCart(p)}
                      >
                        ADD TO CART
                      </button>
                    </div>
                  </div>
                </div>
              ))}
            </div>
            <div className="m-2 p-3">
              {products &&
                products.length > 0 &&
                products.length < productFilter.total && (
                  <button
                    className="btn loadmore"
                    disabled={loading}
                    onClick={handleLoadmore}
                  >
                    {loading ? "Loading ..." : <> Loadmore</>}
                  </button>
                )}
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
      console.log(
        "02 index.tsx store state on the server: ",
        store.getState().auth.user.email
      );
      return {
        props: {},
      };
    }
);

export default HomePage;
