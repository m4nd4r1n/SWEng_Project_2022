import type { GetServerSideProps, NextPage, NextPageContext } from "next";
import Layout from "@components/layout";
import Message from "@components/message";
import useSWR from "swr";
import { useRouter } from "next/router";
import { Product, Stream } from "@prisma/client";
import { useForm } from "react-hook-form";
import useMutation from "@libs/client/useMutation";
import useUser from "@libs/client/useUser";
import ModalBase from "@components/modal";
import { CardModal } from "@components/cardModal";
import { useState } from "react";
import { withSsrSession } from "@libs/server/withSession";
import client from "@libs/server/client";
import Image from "next/image";

interface StreamMessage {
  message: string;
  id: number;
  user: {
    avatar?: string;
    id: number;
  };
}

interface StreamWithMessages extends Stream {
  messages: StreamMessage[];
  videoUID: string | null;
  live: boolean;
  thumbnail?: string;
  preview?: string;
}

interface StreamResponse {
  ok: true;
  stream: StreamWithMessages;
}

interface MessageForm {
  message: string;
}

interface ProductListResponse {
  ok: boolean;
  productList: Product[];
}

const Streams: NextPage = () => {
  const { user } = useUser();
  const router = useRouter();
  const [reveal, setReveal] = useState(false);
  const { register, handleSubmit, reset } = useForm<MessageForm>();
  const { data, mutate } = useSWR<StreamResponse>(
    router.query.id ? `/api/streams/${router.query.id}` : null,
    { refreshInterval: 1000 }
  );
  const { data: products } = useSWR<ProductListResponse>(
    router.query.id ? `/api/streams/${router.query.id}/products` : null
  );
  const [sendMessage, { loading, data: sendMessageData }] = useMutation(
    `/api/streams/${router.query.id}/messages`
  );
  const onValid = (form: MessageForm) => {
    if (loading) return;
    reset();
    mutate(
      (prev) =>
        prev &&
        ({
          ...prev,
          stream: {
            ...prev.stream,
            messages: [
              ...prev.stream.messages,
              { id: Date.now(), message: form.message, user: { ...user } },
            ],
          },
        } as any),
      false
    );
    sendMessage(form);
  };
  const [isActive, setIsActive] = useState(false);

  const onClickModalOff = () => {
    setIsActive(false);
  };

  const handleModal = (event: React.MouseEvent<HTMLButtonElement>) => {
    event.preventDefault();
    setIsActive(true);
  };
  return (
    <Layout canGoBack seoTitle="Stream Detail">
      <div className="space-y-4 px-4  pb-10">
        <h1 className="text-3xl font-bold text-gray-900">
          {data?.stream?.live
            ? "Live"
            : data?.stream?.preview
            ? "최근 진행된 Live"
            : data
            ? "Live 준비 중 입니다."
            : "Loading..."}
        </h1>
        {data?.stream?.cloudflareId
          ? (data?.stream?.live || data?.stream?.preview) && (
              <iframe
                className="aspect-video w-full rounded-md shadow-sm"
                src={
                  data?.stream?.live
                    ? `https://iframe.videodelivery.net/${
                        data?.stream?.cloudflareId
                      }?poster=${encodeURIComponent(
                        `https://videodelivery.net/${data?.stream.cloudflareId}/thumbnails/thumbnail.jpg?height=320`
                      )}`
                    : data?.stream?.preview
                }
                allow="gyroscope; autoplay; encrypted-media; picture-in-picture;"
                allowFullScreen={true}
              ></iframe>
            )
          : null}
        <div className="mt-5 flex">
          <div>
            <h1 className="text-3xl font-bold text-gray-900">
              {data?.stream?.name}
            </h1>
            <span className="mt-3 block text-2xl text-gray-900">
              ₩{data?.stream?.price}
            </span>
            <p className="my-6 text-gray-700">{data?.stream?.description}</p>
          </div>
          {(user?.id === data?.stream.userId || user?.manager) && (
            <button
              className="ml-auto"
              onClick={() => {
                if (window.confirm("삭제하시겠습니까?")) {
                  fetch(`/api/streams/${router.query.id}`, {
                    method: "DELETE",
                  }).then(() => router.back());
                }
              }}
            >
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
                  d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16"
                ></path>
              </svg>
            </button>
          )}
        </div>

        <div className="border-y p-2">
          <div className="flex justify-between">
            {data?.stream?.userId === user?.id && (
              <button
                className="text-gray-500 transition hover:text-orange-500"
                onClick={handleModal}
              >
                Stream Key 보기
              </button>
            )}
            {products?.productList.length !== 0 && (
              <button
                className="ml-auto text-gray-500 transition hover:text-gray-900"
                onClick={() => setReveal(true)}
              >
                판매 상품 목록 보기
              </button>
            )}
          </div>
        </div>

        <ModalBase
          active={reveal}
          closeEvent={() => setReveal(false)}
          isProductList
        >
          <CardModal
            closeEvent={() => setReveal(false)}
            title="판매 상품 목록"
            actionMsg="확인"
          >
            {products?.productList?.map(
              (product) =>
                product.onSale && (
                  <div
                    className="flex cursor-pointer border-t p-2"
                    key={product.id}
                    onClick={() => router.push(`/products/${product.id}`)}
                  >
                    <div className="flex">
                      {product.image ? (
                        <Image
                          className="rounded-lg bg-slate-100"
                          src={`https://imagedelivery.net/mBDIPXvPr-qhWpouLgwjOQ/${product.image}/avatar`}
                          height={48}
                          width={48}
                          alt=""
                        />
                      ) : (
                        <div className="h-12 w-12 rounded-lg bg-slate-100" />
                      )}
                    </div>

                    <div className="ml-4 flex flex-col">
                      <span className="text-gray-800">{product.name}</span>
                      <span className="text-sm text-gray-800">
                        ₩{product.price}
                      </span>
                    </div>
                  </div>
                )
            )}
          </CardModal>
        </ModalBase>
        <ModalBase active={isActive} closeEvent={onClickModalOff}>
          <CardModal
            closeEvent={onClickModalOff}
            title="Stream Keys (secret)"
            actionMsg="확인"
          >
            <span className="font-medium text-gray-800">URL:</span>{" "}
            {data?.stream?.cloudflareUrl}
            <br />
            <br />
            <span className="font-medium text-gray-800">Key:</span>{" "}
            <span className="break-all">{data?.stream?.cloudflareKey}</span>
          </CardModal>
        </ModalBase>
        <div>
          <h2 className="text-2xl font-bold text-gray-900">
            {data?.stream?.live ? "Live Chat" : "Chat History"}
          </h2>
          <div className="h-[45vh] space-y-4 overflow-y-scroll py-10  px-4 pb-16">
            {data?.stream.messages.map((message) => (
              <Message
                key={message.id}
                message={message.message}
                reversed={message.user.id === user?.id}
                avatarUrl={message.user.avatar}
              />
            ))}
          </div>
          {data?.stream?.live && (
            <div className="fixed inset-x-0 bottom-0  bg-white py-2">
              <form
                onSubmit={handleSubmit(onValid)}
                className="relative mx-auto flex w-full  max-w-md items-center"
              >
                <input
                  type="text"
                  {...register("message", { required: true })}
                  className="w-full rounded-full border-gray-300 pr-12 shadow-sm focus:border-orange-500 focus:outline-none focus:ring-orange-500"
                />
                <div className="absolute inset-y-0 right-0 flex py-1.5 pr-1.5">
                  <button className="flex items-center rounded-full bg-orange-500 px-3 text-sm text-white hover:bg-orange-600 focus:ring-2 focus:ring-orange-500 focus:ring-offset-2">
                    &rarr;
                  </button>
                </div>
              </form>
            </div>
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

    const streamInfo = await client.stream.findUnique({
      where: {
        id: +id!,
      },
    });

    if (!streamInfo) {
      return {
        notFound: true,
      };
    }
    return {
      props: {},
    };
  }
);

export default Streams;
