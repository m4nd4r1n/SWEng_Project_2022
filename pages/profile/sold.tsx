import type { NextPage } from "next";
import Layout from "@components/layout";
import ProductList from "@components/product-list";
import { useState } from "react";
import { cls } from "@libs/client/utils";

const Sold: NextPage = () => {
  const [state, setState] = useState<"onsale" | "sales">("onsale");
  return (
    <Layout title="판매내역" canGoBack seoTitle="Sale History">
      <div className="grid h-10 w-full grid-cols-2 border-b">
        <button
          className={cls(
            "border-b-2 pb-2 text-lg font-medium",
            state === "onsale"
              ? " border-orange-500 text-orange-400"
              : "border-transparent text-gray-500 transition-colors hover:text-gray-400"
          )}
          onClick={() => (state !== "onsale" ? setState("onsale") : null)}
        >
          판매중
        </button>
        <button
          className={cls(
            "border-b-2 pb-2 text-lg font-medium",
            state === "sales"
              ? " border-orange-500 text-orange-400"
              : "border-transparent text-gray-500 transition-colors hover:text-gray-400"
          )}
          onClick={() => (state !== "sales" ? setState("sales") : null)}
        >
          판매완료
        </button>
      </div>
      <div className="flex flex-col space-y-5 divide-y  pb-10">
        <ProductList kind={state} />
      </div>
    </Layout>
  );
};

export default Sold;
