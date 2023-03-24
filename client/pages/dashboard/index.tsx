import type { NextPage } from "next";
import { useRouter } from "next/router";
import React, { useEffect } from "react";
import { useAppSelector } from "../../app/hooks";
import { selectAuth } from "../../features/auth/authSlice";
import { Role } from "../../features/auth/types";

type Props = {
};

const DashboardPage: NextPage<Props> = (props) => {
  const {user: { name, role }}=useAppSelector(selectAuth)
  const { push } = useRouter();
  useEffect(() => {
    if (!name) {
      push("/");
    } else {
      if (role === Role.Admin) {
        push("/dashboard/admin");
      }
      if (role === Role.User) {
        push("/dashboard/user");
      }
    }
  }, [name, push, role]);

  return <div></div>;
};

export default DashboardPage;
