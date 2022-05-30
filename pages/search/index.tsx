import { ChangeEvent, useMemo, useState, useEffect } from "react";
import type { NextPage } from "next";
import FloatingButton from "@components/floating-button";
import Item from "@components/item";
import Layout from "@components/layout";
import useUser from "@libs/client/useUser";
import useSWR, { SWRConfig } from "swr";
import { ProductWithCount } from "../index";
import qs from "qs";

interface ProductsResponse {
  ok: boolean;
  products: ProductWithCount[];
}

const Dropdown = ({
  options,
  spaceholder,
  handleChangeSelect,
}: {
  options: Array<{ name: string; value: string }>;
  spaceholder?: string;
  handleChangeSelect?: (event: ChangeEvent<HTMLSelectElement>) => void;
}) => {
  return (
    <select
      id="dropdownDefault"
      className="form-select m-0
        mx-5
        block
        w-1/2
        appearance-none
        border
        border-solid
        border-gray-300 bg-white bg-clip-padding
        bg-no-repeat px-4
        py-2.5
        text-base
        font-medium
        text-gray-700
        transition ease-in-out hover:border-orange-400 focus:border-orange-400 focus:bg-white
        focus:text-gray-700 focus:outline-none
        focus:ring-2
        focus:ring-orange-200"
      onChange={handleChangeSelect}
    >
      <option className="bg-orange-100 font-semibold" value="">
        {spaceholder}
      </option>
      {options.map((item, index) => (
        <option key={index} value={item.value}>
          {item?.name}
        </option>
      ))}
    </select>
  );
};

const Search: NextPage = () => {
  const { user, isLoading } = useUser();
  const [sort, setSort] = useState("");
  const [catId, setCatId] = useState("");
  const [query, setQuery] = useState("");
  const [inputText, setinputText] = useState("");
  const { data } = useSWR<ProductsResponse>(
    `/api/products/search?${qs.stringify({ query, sort, catId })}`
  );

  const categories = useMemo(
    () => [
      {
        name: "생활/건강",
        value: "10000",
      },
      {
        name: "식품",
        value: "20000",
      },
      {
        name: "디지털/가전",
        value: "30000",
      },
      {
        name: "출산/육아",
        value: "40000",
      },
      {
        name: "스포츠/레저",
        value: "50000",
      },
      {
        name: "패션잡화",
        value: "60001",
      },
      {
        name: "패션의류",
        value: "60002",
      },
      {
        name: "가구/인테리어",
        value: "70000",
      },
      {
        name: "도서",
        value: "80000",
      },
      {
        name: "화장품/미용",
        value: "60003",
      },
      {
        name: "여가/생활편의",
        value: "90000",
      },
    ],
    []
  );

  const options = useMemo(
    () => [
      {
        name: "낮은 가격순",
        value: "price_asc",
      },
      {
        name: "높은 가격순",
        value: "price_dsc",
      },
      {
        name: "좋아요순",
        value: "fav",
      },
      {
        name: "등록일순",
        value: "date",
      },
    ],
    []
  );

  return (
    <Layout title="검색" hasTabBar seoTitle="Search">
      <div className="fixed -mt-4 flex w-full min-w-max max-w-[576px] flex-col border-b bg-white">
        <div
          id="select"
          className="flex w-full items-center justify-around pt-4 pb-4"
        >
          <Dropdown
            options={categories}
            spaceholder="카테고리"
            handleChangeSelect={(e) => setCatId(e.target.value)}
          />
          <Dropdown
            options={options}
            spaceholder="정렬 옵션"
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
            className="flex w-full appearance-none border border-gray-300 px-3 py-2 placeholder-gray-400 shadow-sm focus:border-orange-500 focus:outline-none focus:ring-orange-500"
          />
          <button
            onClick={() => setQuery(inputText)}
            className="flex h-[42px] min-w-[50px] items-center justify-center bg-orange-400 hover:ring-2 hover:ring-orange-200"
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
      <div className="mt-28 flex flex-col space-y-5 divide-y">
        {data
          ? data?.products?.map((product) => (
              <Item
                id={product.id}
                key={product.id}
                title={product.name}
                price={product.price}
                hearts={product._count?.favs || 0}
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

const Page: NextPage<{ products: ProductWithCount[] }> = ({ products }) => {
  return (
    <SWRConfig
      value={{
        fallback: {
          "/api/products": {
            ok: true,
            products,
          },
        },
      }}
    >
      <Search />
    </SWRConfig>
  );
};

export default Page;
