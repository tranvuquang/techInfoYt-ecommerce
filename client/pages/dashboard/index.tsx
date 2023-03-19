import type { NextPage } from "next";
import { useRouter } from "next/router";
import React, { useEffect } from "react";

type Props = {};

const DashboardPage: NextPage<Props> = (props) => {
  const { push } = useRouter();
  useEffect(() => {
    push("/dashboard/admin");
  }, [push]);

  return <div></div>;
};

export default DashboardPage;
