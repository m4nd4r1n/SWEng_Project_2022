import type { NextPage } from "next";
import FloatingButton from "@components/floating-button";
import Item from "@components/item";
import Layout from "@components/layout";
import useUser from "@libs/client/useUser";
import { Address, Product } from "@prisma/client";
import useSWRInfinite from "swr/infinite";
import Admin from "@components/admin";
import { useEffect } from "react";

export interface ProductWithCountAndAddress extends Product {
  _count: {
    favs: number;
  };
  address: Address;
}

interface ProductsResponse {
  ok: boolean;
  products: ProductWithCountAndAddress[];
}

const Home: NextPage = () => {
  const { user } = useUser();
  const getKey = (index: number) => `/api/products?page=${index}`;
  const { data, size, setSize } = useSWRInfinite<ProductsResponse>(getKey, {
    revalidateFirstPage: false,
  });
  const isEnd = data && data[data.length - 1]?.products?.length < 15;
  useEffect(() => {
    if (localStorage.products_scroll && localStorage.products_size) {
      setSize(+localStorage.products_size);
      window.scrollTo(0, localStorage.products_scroll);
    }
  }, [setSize]);
  return (
    <Layout title="홈" hasTabBar seoTitle="Home">
      <Admin manager={user?.manager} />
      <div className="flex flex-col space-y-5 divide-y">
        {data
          ? data?.map((data) => {
              return data?.products?.map((product) => (
                <Item
                  id={product.id}
                  key={product.id}
                  title={product.name}
                  categoryId={product.categoryId}
                  address={product.address.sido + " " + product.address.sigungu}
                  price={product.price}
                  hearts={product._count?.favs || 0}
                  image={product.image}
                  onClick={() => {
                    localStorage.products_scroll = window.scrollY;
                    localStorage.products_size = size;
                  }}
                />
              ));
            })
          : "Loading..."}
        <FloatingButton
          href="/products/upload"
          onClick={() => {
            localStorage.products_scroll = window.scrollY;
            localStorage.products_size = size;
          }}
        >
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
      <div className="flex justify-center">
        {!isEnd && (
          <button
            className="mt-4 h-12 w-1/2 rounded-md border border-transparent bg-orange-500 px-4 font-medium text-white shadow-sm transition hover:bg-orange-600 focus:outline-none focus:ring-2 focus:ring-orange-500 focus:ring-offset-2"
            onClick={() =>
              +localStorage.products_size === size
                ? setSize(+localStorage.products_size + 1)
                : setSize(size + 1)
            }
          >
            More
          </button>
        )}
      </div>
    </Layout>
  );
};

export default Home;
