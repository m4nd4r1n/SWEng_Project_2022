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
