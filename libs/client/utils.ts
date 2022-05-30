import { useRouter } from "next/router";
import { ChangeEvent, useEffect } from "react";

export function cls(...classnames: string[]) {
  return classnames.join(" ");
}

export function Cleanup() {
  const router = useRouter();
  useEffect(() => {
    if (
      router.pathname.indexOf("/streams") === -1 &&
      (localStorage.streams_scroll || localStorage.streams_size)
    ) {
      localStorage.removeItem("streams_scroll");
      localStorage.removeItem("streams_size");
    }
  }, [router]);
}

export const inNumber = (e: ChangeEvent<HTMLInputElement>) => {
  e.target.value = e.target.value.replace(/[^0-9]/g, "");
};
