import { useRouter } from "next/router";
import { ChangeEvent, useEffect } from "react";

export function cls(...classnames: string[]) {
  return classnames.join(" ");
}

export function Cleanup() {
  const router = useRouter();
  useEffect(() => {
    const regex = /[^\/]/g;
    if (
      router.pathname.indexOf("/streams") === -1 &&
      (localStorage.streams_scroll || localStorage.streams_size)
    ) {
      localStorage.removeItem("streams_scroll");
      localStorage.removeItem("streams_size");
    }
    if (
      regex.test(router.pathname) &&
      router.pathname.indexOf("/products") === -1 &&
      (localStorage.products_scroll || localStorage.products_size)
    ) {
      localStorage.removeItem("products_scroll");
      localStorage.removeItem("products_size");
    }
  }, [router]);
}

export const inNumber = (e: ChangeEvent<HTMLInputElement>) => {
  e.target.value = e.target.value.replace(/[^0-9]/g, "");
};

export const isEmail = (value: string) => {
  const regex =
    /([\w-.]+)@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.)|(([\w-]+\.)+))([a-zA-Z]{2,4}|[0-9]{1,3})(\]?)$/;
  if (!(value !== undefined && regex.test(value))) {
    return "이메일 형식이 아닙니다.";
  }
};
