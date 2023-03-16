import {
  ApolloClient,
  InMemoryCache,
  createHttpLink,
  DocumentNode,
  NormalizedCacheObject,
} from "@apollo/client";
import { setContext } from "@apollo/client/link/context";
import { AnyAction, Dispatch } from "@reduxjs/toolkit";
import { setLoadingRedux } from "../features/auth/authSlice";

const URL = "http://localhost:5001/graphql";

export const graphqlClient = (accessToken: string | null = "") => {
  const httpLink = createHttpLink({
    uri: URL,
    credentials: "include",
  });

  const authLink = setContext((_, { headers }) => {
    return {
      headers: {
        ...headers,
        authorization: accessToken ? `Bearer ${accessToken}` : "",
      },
    };
  });

  const client = new ApolloClient({
    link: authLink.concat(httpLink),
    cache: new InMemoryCache(),
  });
  return client;
};

export const queryClient = async (
  accessToken: string = "",
  dispatch: Dispatch<AnyAction>,
  query: DocumentNode,
  variables: any = {}
) => {
  dispatch(setLoadingRedux(true));
  try {
    const resData = await graphqlClient(accessToken).query({
      query,
      variables,
    });
    return resData;
  } catch (error: any) {
    console.log(error.message);
  } finally {
    dispatch(setLoadingRedux(false));
  }
};

export const mutationClient = async (
  accessToken: string = "",
  dispatch: Dispatch<AnyAction>,
  mutation: DocumentNode,
  variables: any,
  query: any = null,
  value: any = {}
) => {
  dispatch(setLoadingRedux(true));
  try {
    let reFetchData = {};
    const resData = (await graphqlClient(accessToken).mutate({
      mutation,
      variables,
    })) as ApolloClient<NormalizedCacheObject>;
    if (resData && query && value) {
      let reFetchData = await graphqlClient(accessToken).query({
        query,
        variables: value,
      });
      return { resData, reFetchData };
    }
    return { resData, reFetchData };
  } catch (error: any) {
    console.log(error.message);
  } finally {
    dispatch(setLoadingRedux(false));
  }
};
