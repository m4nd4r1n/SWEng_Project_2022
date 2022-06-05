import type { NextPage } from "next";
import Button from "@components/button";
import Layout from "@components/layout";
import { useRouter } from "next/router";
import useSWR from "swr";
import Link from "next/link";
import { Product, User } from "@prisma/client";
import useMutation from "@libs/client/useMutation";
import { cls } from "@libs/client/utils";
import useUser from "@libs/client/useUser";
import Image from "next/image";
import { useEffect } from "react";
import Map from "@components/Map";

interface ProductWithUser extends Product {
  user: User;
}
interface ItemDetailResponse {
  ok: boolean;
  product: ProductWithUser;
  relatedProducts: Product[];
  isLiked: boolean;
}

const ItemDetail: NextPage = () => {
  const { user, isLoading } = useUser();
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
      <div className="px-4  py-4">
        <div className="mb-8">
          <div className="relative pb-80">
            <Image
              src={`https://imagedelivery.net/mBDIPXvPr-qhWpouLgwjOQ/${data?.product.image}/public`}
              className="bg-slate-100 object-contain"
              layout="fill"
              alt=""
            />
          </div>
          <div className="flex cursor-pointer items-center space-x-3 border-t border-b py-3">
            <Image
              src={`https://imagedelivery.net/mBDIPXvPr-qhWpouLgwjOQ/${data?.product?.user?.avatar}/avatar`}
              className="h-12 w-12 rounded-full bg-slate-300"
              alt=""
              height={48}
              width={48}
            />
            <div className="">
              {data ? (
                <p className="text-sm font-medium text-gray-700">
                  {data?.product?.user?.name}
                </p>
              ) : (
                <div className="h-5 animate-pulse rounded-md bg-slate-300" />
              )}
              <Link href={`/users/profiles/${data?.product?.user?.id}`}>
                <a className="text-xs font-medium text-gray-500">
                  View profile &rarr;
                </a>
              </Link>
            </div>
          </div>
          <div className="mt-5">
            {data ? (
              <>
                <h1 className="text-3xl font-bold text-gray-900">
                  {data?.product?.name}
                </h1>
                <span className="mt-3 block text-2xl text-gray-900">
                  ${data?.product?.price}
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
            {/* KAKAO Map */}
            <div className="mt-full">
              {(data?.product?.latitude) && (data?.product?.longitude) ? (
                <Map latitude={data?.product?.latitude} longitude={data?.product?.longitude}/>
              ) : (
                <Map latitude={test_la} longitude={test_lo}/>
              )}
            </div>
            <div className="flex items-center justify-between space-x-2">
              <Button
                onClick={onChatClick}
                text="Talk to seller"
                disabled={user?.id === data?.product.userId}
              />
              <button
                onClick={onFavClick}
                className={cls(
                  "flex items-center justify-center rounded-md p-3 hover:bg-gray-100 ",
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
                  ${product.price}
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
        </div>
      </div>
    </Layout>
  );
};

export default ItemDetail;
