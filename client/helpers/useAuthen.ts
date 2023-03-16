import { useEffect } from "react";
import { useRouter } from "next/router";
import { selectAuth } from "../features/auth/authSlice";
import { useAppSelector } from "../app/hooks";

// Da dang nhap roi -> Day qua homepage
const useAuthen = () => {
  const { accessToken, user } = useAppSelector(selectAuth);
  const router = useRouter();

  useEffect(() => {
    if (accessToken && user) {
      router.push("/");
    }
  }, [accessToken, router, user]);
};

// Chua dang nhap day ve trang login
const useNotAuthen = () => {
  const router = useRouter();
  const { accessToken, user } = useAppSelector(selectAuth);

  useEffect(() => {
    if (!accessToken || !user.id || !user.email) {
      router.push("/login");
    }
  }, [accessToken, router, user.email, user.id]);
};

export { useAuthen , useNotAuthen };
