import type { NextPage } from "next";
import Layout from "@components/layout";
import Message from "@components/message";
import useSWR from "swr";
import { useRouter } from "next/router";
import { Stream } from "@prisma/client";
import { useForm } from "react-hook-form";
import useMutation from "@libs/client/useMutation";
import useUser from "@libs/client/useUser";
import ModalBase from "@components/modal";
import { CardModal } from "@components/cardModal";
import { useState } from "react";

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

const Streams: NextPage = () => {
  const { user } = useUser();
  const router = useRouter();
  const { register, handleSubmit, reset } = useForm<MessageForm>();
  const { data, mutate } = useSWR<StreamResponse>(
    router.query.id ? `/api/streams/${router.query.id}` : null,
    { refreshInterval: 1000 }
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
        {data?.stream?.live ? (
          <h1 className="text-3xl font-bold text-gray-900">Live</h1>
        ) : (
          <h1 className="text-3xl font-bold text-gray-900">최근 진행된 Live</h1>
        )}
        {data?.stream?.cloudflareId ? (
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
        ) : null}
        <div className="mt-5">
          <h1 className="text-3xl font-bold text-gray-900">
            {data?.stream?.name}
          </h1>
          <span className="mt-3 block text-2xl text-gray-900">
            ${data?.stream?.price}
          </span>
          <p className="my-6 text-gray-700">{data?.stream?.description}</p>
          {data?.stream?.userId === user?.id && (
            <button
              className="rounded-lg bg-orange-400 p-2 text-white transition hover:bg-orange-500"
              onClick={handleModal}
            >
              Stream Key 보기
            </button>
          )}
        </div>
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
          <h2 className="text-2xl font-bold text-gray-900">Live Chat</h2>
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

export default Streams;
