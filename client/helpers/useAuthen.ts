import { useEffect } from "react";
import { useRouter } from "next/router";
import { selectAuth } from "../features/auth/authSlice";
import { useAppSelector } from "../app/hooks";
import { Role } from "../features/auth/types";

// Da dang nhap roi -> Day qua homepage
// su dung cho public route: login, register, forgot password
const useAuthen = () => {
  const { accessToken, user } = useAppSelector(selectAuth);
  const router = useRouter();

  useEffect(() => {
    if (accessToken && user.id) {
      router.push("/");
    }
  }, [accessToken, router, user]);
};

// Chua dang nhap roi -> Day qua homepage
// su dung cho private route:
const useNotAuthen = () => {
  const { accessToken, user } = useAppSelector(selectAuth);
  const router = useRouter();

  useEffect(() => {
    if (accessToken && user.id) {
      router.push("/");
    }
  }, [accessToken, router, user]);
};

//Neu chua dang nhap hoac role!=user day ve trang home
// su dung cho route dashboard/users
const useUser = () => {
  const router = useRouter();
  const { accessToken, user } = useAppSelector(selectAuth);

  useEffect(() => {
    if (!(accessToken && user.id) || user.role !== Role.User) {
      router.push("/login");
    }
  }, [accessToken, router, user.id, user.role]);
};

// Neu chua dang nhap hoac role!=admin => day ve trang home
// su dung cho route dashboard/admin
const useAdmin = () => {
  const { accessToken, user } = useAppSelector(selectAuth);
  const router = useRouter();

  useEffect(() => {
    if (!(accessToken && user.id) || user.role !== Role.Admin) {
      router.push("/");
    }
  }, [accessToken, router, user.id, user.role]);
};

export { useUser, useAuthen, useAdmin, useNotAuthen };
