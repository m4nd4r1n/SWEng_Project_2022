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
        w-40
        appearance-none
        rounded-lg
        border-2
        border-solid
        border-gray-400 bg-white bg-clip-padding
        bg-no-repeat px-4
        py-2.5
        text-base
        font-medium
        text-gray-700
        transition ease-in-out hover:border-orange-400 focus:border-orange-400 focus:bg-white
        focus:text-gray-700 focus:outline-none
        focus:ring-4
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
  const { data } = useSWR<ProductsResponse>(
    `/api/products/search?${qs.stringify({ sort, catId })}`
  );
  // const data = useMemo(
  //   () => ({
  //     products: [
  //       {
  //         id: 1,
  //         name: "testProduct",
  //         price: 10000,
  //         _count: { favs: 0 },
  //       },
  //       {
  //         id: 2,
  //         name: "testProduct",
  //         price: 10000,
  //         _count: { favs: 0 },
  //       },
  //       {
  //         id: 3,
  //         name: "testProduct",
  //         price: 10000,
  //         _count: { favs: 0 },
  //       },
  //       {
  //         id: 4,
  //         name: "testProduct",
  //         price: 10000,
  //         _count: { favs: 0 },
  //       },
  //       {
  //         id: 5,
  //         name: "testProduct",
  //         price: 10000,
  //         _count: { favs: 0 },
  //       },
  //       {
  //         id: 6,
  //         name: "testProduct",
  //         price: 10000,
  //         _count: { favs: 0 },
  //       },
  //       {
  //         id: 7,
  //         name: "testProduct",
  //         price: 10000,
  //         _count: { favs: 0 },
  //       },
  //       {
  //         id: 8,
  //         name: "testProduct",
  //         price: 10000,
  //         _count: { favs: 0 },
  //       },
  //     ],
  //   }),
  //   []
  // );

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
      <div className="fixed -mt-4 flex w-full max-w-[576px] items-center justify-center border-b bg-white pt-4 pb-4">
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
      <div className="mt-14 flex flex-col space-y-5 divide-y">
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
