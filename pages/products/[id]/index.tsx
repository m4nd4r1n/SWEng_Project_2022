import type { GetServerSideProps, NextPage, NextPageContext } from "next";
import Button from "@components/button";
import Layout from "@components/layout";
import { useRouter } from "next/router";
import useSWR from "swr";
import Link from "next/link";
import { Address, Category, Product, User } from "@prisma/client";
import useMutation from "@libs/client/useMutation";
import { cls } from "@libs/client/utils";
import useUser from "@libs/client/useUser";
import Image from "next/image";
import { useEffect } from "react";
import { withSsrSession } from "@libs/server/withSession";
import client from "@libs/server/client";
import Map from "@components/Map";
import FloatingButton from "@components/floating-button";

interface ProductWithUserAndAddressAndCategory extends Product {
  user: User;
  address: Address;
  category: Category;
}
interface ItemDetailResponse {
  ok: boolean;
  product: ProductWithUserAndAddressAndCategory;
  relatedProducts: Product[];
  isLiked: boolean;
}

const ItemDetail: NextPage = () => {
  const { user: me } = useUser();
  const router = useRouter();
  const { data, mutate: boundMutate } = useSWR<ItemDetailResponse>(
    router.query.id ? `/api/products/${router.query.id}` : null
  );
  const [toggleFav] = useMutation(`/api/products/${router.query.id}/fav`);
  const onFavClick = () => {
    if (!data) return;
    boundMutate((prev) => prev && { ...prev, isLiked: !prev.isLiked }, false);
    toggleFav({});
  };
  const [createOrFindChatRoom, { data: roomId }] = useMutation("/api/chats");
  const onChatClick = () => {
    if (!data) return;
    createOrFindChatRoom({
      userId: data.product.userId,
      productId: data.product.id,
    });
  };
  useEffect(() => {
    if (roomId?.ok) {
      router.push(`/chats/${roomId?.id}`);
    }
  }, [roomId, router]);

  const test_la: number = 37.6197503;
  const test_lo: number = 127.060937;

  return (
    <Layout canGoBack seoTitle="Product Detail">
      <div className="px-4 py-4">
        <div className="mb-8">
          <div className="relative pb-80">
            <>
              {data?.product.image ? (
                <Image
                  src={`https://imagedelivery.net/mBDIPXvPr-qhWpouLgwjOQ/${data?.product.image}/public`}
                  className="bg-slate-100 object-contain"
                  layout="fill"
                  alt=""
                />
              ) : (
                <div className="absolute h-80 w-full bg-slate-100" />
              )}
              {!data?.product.onSale && (
                <div className="absolute z-50 h-80 w-full bg-[rgba(249,249,249,0.45)]">
                  <div className="absolute top-1/2 left-1/2 w-full -translate-x-1/2 -translate-y-1/2 rotate-12 select-none bg-[rgba(249,249,249,0.55)] text-center  text-2xl font-bold text-gray-800">
                    SOLD OUT
                  </div>
                </div>
              )}
            </>
          </div>
          <div className="flex items-center justify-between space-x-3 border-t border-b py-3 px-1">
            <div className="flex flex-row space-x-3">
              <div className="">
                {data ? (
                  <div>
                    <p className="text-sm font-medium text-gray-700">
                      {data?.product?.user?.name}
                    </p>
                    <p className="text-xs font-medium text-gray-400">
                      {data?.product?.address?.sido +
                        " " +
                        data?.product?.address?.sigungu}
                    </p>
                  </div>
                ) : (
                  <div className="h-5 animate-pulse rounded-md bg-slate-300" />
                )}
                <Link href={`/users/profiles/${data?.product?.user?.id}`}>
                  <a className="text-xs font-medium text-gray-500 transition hover:text-gray-700">
                    View profile &rarr;
                  </a>
                </Link>
              </div>
            </div>
            <div className="flex flex-col items-end space-y-5">
              {(me?.manager || me?.id === data?.product?.userId) && (
                <>
                  <button
                    className="text-gray-500 transition hover:text-gray-700"
                    onClick={() => {
                      if (
                        window.confirm(
                          `'${data?.product?.name}' 상품을 삭제하겠습니까?`
                        )
                      ) {
                        fetch(`/api/products/${data?.product?.id}`, {
                          method: "DELETE",
                        }).then(() => router.push('/'));
                      }
                    }}
                  >
                    <svg
                      className="h-5 w-5"
                      fill="none"
                      stroke="currentColor"
                      viewBox="0 0 24 24"
                      xmlns="http://www.w3.org/2000/svg"
                    >
                      <path
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        strokeWidth="2"
                        d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16"
                      ></path>
                    </svg>
                  </button>
                  {data?.product.onSale && (
                    <Link href={`/products/${data?.product?.id}/edit`}>
                      <a className="flex text-xs font-medium text-gray-500 transition hover:text-gray-700">
                        Edit product
                        <svg
                          className="ml-1 h-4 w-4"
                          fill="none"
                          stroke="currentColor"
                          viewBox="0 0 24 24"
                          xmlns="http://www.w3.org/2000/svg"
                        >
                          <path
                            strokeLinecap="round"
                            strokeLinejoin="round"
                            strokeWidth="2"
                            d="M11 5H6a2 2 0 00-2 2v11a2 2 0 002 2h11a2 2 0 002-2v-5m-1.414-9.414a2 2 0 112.828 2.828L11.828 15H9v-2.828l8.586-8.586z"
                          ></path>
                        </svg>
                      </a>
                    </Link>
                  )}
                </>
              )}
            </div>
          </div>
          <div className="mt-5">
            {data ? (
              <>
                <h1 className="text-3xl font-bold text-gray-900">
                  {data?.product?.name}
                </h1>
                <span className="mt-3 block text-2xl text-gray-900">
                  ₩{data?.product?.price}
                </span>
                <span className="mt-3 block text-sm text-gray-500">
                  {data.product.category.name}
                  {"ㆍ"}
                  {new Date(data.product.createdAt).toLocaleString()}
                </span>
                <p className="my-6 text-gray-700">
                  {data?.product?.description}
                </p>
              </>
            ) : (
              <>
                <div className="h-[1.875rem] animate-pulse rounded-md bg-slate-300" />
                <div className="mt-3 block h-6 animate-pulse rounded-md bg-slate-300" />
                <div className="my-6 h-4 animate-pulse rounded-md bg-slate-300" />
              </>
            )}
            <div className="mb-2 flex items-center justify-between space-x-2">
              <Button
                onClick={onChatClick}
                text="Talk to seller"
                disabled={
                  me?.id === data?.product.userId || !data?.product.onSale
                }
              />
              <button
                onClick={onFavClick}
                className={cls(
                  "flex items-center justify-center rounded-md p-3 transition hover:bg-gray-100 ",
                  data?.isLiked
                    ? "text-red-500  hover:text-red-600"
                    : "text-gray-400  hover:text-gray-500"
                )}
              >
                {data?.isLiked ? (
                  <svg
                    className="h-6 w-6"
                    fill="currentColor"
                    viewBox="0 0 20 20"
                    xmlns="http://www.w3.org/2000/svg"
                  >
                    <path
                      fillRule="evenodd"
                      d="M3.172 5.172a4 4 0 015.656 0L10 6.343l1.172-1.171a4 4 0 115.656 5.656L10 17.657l-6.828-6.829a4 4 0 010-5.656z"
                      clipRule="evenodd"
                    ></path>
                  </svg>
                ) : (
                  <svg
                    className="h-6 w-6 "
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
                      d="M4.318 6.318a4.5 4.5 0 000 6.364L12 20.364l7.682-7.682a4.5 4.5 0 00-6.364-6.364L12 7.636l-1.318-1.318a4.5 4.5 0 00-6.364 0z"
                    />
                  </svg>
                )}
              </button>
            </div>
            {/* KAKAO Map */}
            <div className="mt-full">
              {data?.product?.latitude && data?.product?.longitude ? (
                <Map
                  latitude={data?.product?.latitude}
                  longitude={data?.product?.longitude}
                />
              ) : (
                <Map latitude={test_la} longitude={test_lo} />
              )}
            </div>
          </div>
        </div>
        <div>
          <h2 className="text-2xl font-bold text-gray-900">Similar items</h2>
          <div className=" mt-6 grid grid-cols-2 gap-4">
            {data?.relatedProducts?.map((product) => (
              <div
                key={product.id}
                className="h-56 w-full cursor-pointer"
                onClick={() => router.push(`/products/${product.id}`)}
              >
                {product.image ? (
                  <Image
                    className="mb-4"
                    src={`https://imagedelivery.net/mBDIPXvPr-qhWpouLgwjOQ/${product.image}/public`}
                    width={264}
                    height={224}
                    objectFit="contain"
                    alt=""
                  />
                ) : (
                  <div className="mb-4 h-56 w-full bg-slate-300" />
                )}
                <h3 className="-mb-1 text-gray-700">{product.name}</h3>
                <span className="text-sm font-medium text-gray-900">
                  ₩{product.price}
                </span>
              </div>
            ))}
            {!data &&
              [1, 2].map((_, i) => (
                <div key={i}>
                  <div className="mb-4 h-56 w-full animate-pulse rounded-md bg-slate-300" />
                  <div className="-mb-1 h-8 animate-pulse rounded-md bg-slate-300" />
                </div>
              ))}
          </div>
          {me?.id !== data?.product?.userId && (
            <FloatingButton href={`/report/${data?.product?.id}/product`}>
              <svg
                className="h-6 w-6"
                fill="none"
                stroke="currentColor"
                viewBox="0 0 24 24"
                xmlns="http://www.w3.org/2000/svg"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth="2"
                  d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z"
                ></path>
              </svg>
            </FloatingButton>
          )}
        </div>
      </div>
    </Layout>
  );
};

export const getServerSideProps: GetServerSideProps = withSsrSession(
  async (context: NextPageContext) => {
    const { id } = context.query;

    if (!parseInt(id as string) && parseInt(id as string) !== 0) {
      return {
        notFound: true,
      };
    }

    const product = await client.product.findUnique({
      where: {
        id: +id!,
      },
    });
    if (!product) {
      return {
        notFound: true,
      };
    }

    return {
      props: {},
    };
  }
);

export default ItemDetail;
