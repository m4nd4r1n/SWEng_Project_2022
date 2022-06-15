import type { NextPage } from "next";
import { useState } from "react";
import FloatingButton from "@components/floating-button";
import Item from "@components/item";
import Layout from "@components/layout";
import useSWR from "swr";
import { ProductWithCountAndAddress } from "../index";
import qs from "qs";
import Dropdown from "@components/dropdown";

interface ProductsResponse {
  ok: boolean;
  products: ProductWithCountAndAddress[];
}

const Search: NextPage = () => {
  const [sort, setSort] = useState("");
  const [catId, setCatId] = useState("");
  const [query, setQuery] = useState("");
  const [inputText, setinputText] = useState("");
  const { data } = useSWR<ProductsResponse>(
    `/api/products/search?${qs.stringify({ query, sort, catId })}`
  );

  return (
    <Layout title="검색" hasTabBar seoTitle="Search">
      <div className="fixed -mt-4 flex w-full min-w-max max-w-[576px] flex-col border-b bg-white">
        <div
          id="select"
          className="flex w-full items-center justify-around pt-4 pb-4"
        >
          <Dropdown
            type="category"
            spaceholder="카테고리"
            value={catId}
            handleChangeSelect={(e) => setCatId(e.target.value)}
          />
          <Dropdown
            type="option"
            spaceholder="정렬 옵션"
            value={sort}
            handleChangeSelect={(e) => setSort(e.target.value)}
          />
        </div>
        <div
          id="search"
          className="flex w-full items-center justify-center px-5 pb-4"
        >
          <input
            value={inputText}
            onChange={(e) => setinputText(e.target.value)}
            onKeyDown={(e) => {
              if (e.key === "Enter") {
                setQuery(inputText);
              }
            }}
            className="flex w-full appearance-none rounded-l-lg border border-gray-300 px-3 py-2 placeholder-gray-400 shadow-sm transition focus:border-orange-500 focus:outline-none focus:ring-orange-500"
          />
          <button
            onClick={() => setQuery(inputText)}
            className="flex h-[42px] min-w-[50px] items-center justify-center rounded-r-lg bg-orange-400 transition hover:bg-orange-500 hover:ring-2 hover:ring-orange-200"
          >
            <svg
              className="h-5 w-5 transition-colors"
              fill="white"
              stroke="currentColor"
              viewBox="0 0 500 500"
              xmlns="http://www.w3.org/2000/svg"
            >
              <path
                d="M481.8,453l-140-140.1c27.6-33.1,44.2-75.4,44.2-121.6C386,85.9,299.5,0.2,193.1,0.2S0,86,0,191.4s86.5,191.1,192.9,191.1
			c45.2,0,86.8-15.5,119.8-41.4l140.5,140.5c8.2,8.2,20.4,8.2,28.6,0C490,473.4,490,461.2,481.8,453z M41,191.4
			c0-82.8,68.2-150.1,151.9-150.1s151.9,67.3,151.9,150.1s-68.2,150.1-151.9,150.1S41,274.1,41,191.4z"
              />
            </svg>
          </button>
        </div>
      </div>
      <div className="mt-32 flex flex-col space-y-5 divide-y">
        {data
          ? data?.products?.map((product) => (
              <Item
                id={product.id}
                key={product.id}
                title={product.name}
                categoryId={product.categoryId}
                address={product.address.sido + " " + product.address.sigungu}
                price={product.price}
                hearts={product._count?.favs || 0}
                image={product.image}
                onSale={product.onSale}
              />
            ))
          : "Loading..."}
        <FloatingButton href="/products/upload">
          <svg
            className="h-6 w-6"
            xmlns="http://www.w3.org/2000/svg"
            fill="none"
            viewBox="0 0 24 24"
            stroke="currentColor"
            aria-hidden="true"
          >
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              strokeWidth="2"
              d="M12 6v6m0 0v6m0-6h6m-6 0H6"
            />
          </svg>
        </FloatingButton>
      </div>
    </Layout>
  );
};

export default Search;
