import type { NextPage } from "next";
import Layout from "@components/layout";
import Message from "@components/message";
import { useChannel } from "@libs/client/useChannel";
import React, { useEffect, useRef, useState } from "react";
import * as Ably from "ably";
import { useRouter } from "next/router";
import useUser from "@libs/client/useUser";
import useSWR from "swr";
import ModalBase from "@components/modal";
import { CardModal } from "@components/cardModal";
import useMutation from "@libs/client/useMutation";

interface User {
  name: string;
  id: number;
  avatar: string;
}

interface Product {
  id: number;
  name: string;
  price: number;
  description: string;
  userId: number;
  onSale: boolean;
}

interface RoomWithProduct {
  product: Product;
}

interface ParticipantResponse {
  ok: boolean;
  user?: User;
  room?: RoomWithProduct;
}

interface WalletResponse {
  ok: boolean;
  id: number;
  currency: number;
}

const ChatDetail: NextPage = () => {
  const router = useRouter();
  const { user } = useUser();
  const inputBox = useRef<HTMLInputElement>(null);
  const messageEnd = useRef<HTMLDivElement>(null);
  const [messageText, setMessageText] = useState("");
  const [receivedMessages, setMessages] = useState<Array<Ably.Types.Message>>(
    []
  );
  const { data, mutate } = useSWR<ParticipantResponse>(
    `/api/chats/participant?roomId=${router.query.id}`
  );
  const { data: wallet } = useSWR<WalletResponse>("/api/users/me/wallet");
  const [sell] = useMutation(
    `/api/products/${data?.room?.product.id}/transaction`
  );
  const messageTextIsEmpty = messageText.trim().length === 0;

  const [channel, ably]: any = useChannel(
    `${router.query.id}`,
    (message: Ably.Types.Message) => {
      const history = receivedMessages.slice(-199);
      setMessages([...history, message]);
    }
  );

  useEffect(() => {
    channel.history({ limit: 25 }, (err: any, result: any) => {
      const reverse = result.items.reverse();
      setMessages([...reverse]);
    });
  }, [channel]);

  const sendChatMessage = (messageText: string) => {
    channel.publish({
      name: user?.login.email,
      data: messageText,
    });
    setMessageText("");
    inputBox.current?.focus();
  };

  const handleFormSubmission = (event: React.FormEvent) => {
    event.preventDefault();
    sendChatMessage(messageText);
  };

  const handleKeyPress = (event: React.KeyboardEvent) => {
    if (event.key.charCodeAt(0) !== 13 || messageTextIsEmpty) {
      return;
    }
    sendChatMessage(messageText);
    event.preventDefault();
  };

  const sellProduct = () => {
    if (window.confirm("판매하시겠습니까?")) {
      mutate(
        (prev) =>
          prev &&
          ({
            ...prev,
            room: {
              ...prev.room,
              product: {
                ...prev.room?.product,
                onSale: false,
              },
            },
          } as any),
        false
      );
      sell({ opponentId: data?.user?.id });
    }
  };

  const messages = receivedMessages.map((message, index) => {
    const isMine = message.name === user?.login.email;
    return (
      <Message
        key={index}
        message={message.data?.isRequest ? message.data?.message : message.data}
        reversed={isMine}
        purchase={message.data?.isRequest}
        onClick={sellProduct}
        isSale={data?.room?.product.onSale}
        avatarUrl={isMine ? user.avatar! : data?.user?.avatar}
      />
    );
  });

  const [isActive, setIsActive] = useState(false);

  const onClickModalOff = () => {
    setIsActive(false);
  };

  const sendPurchaseMessage = () => {
    if (receivedMessages.filter((data) => data.data?.isRequest).length !== 0) {
      setIsActive(false);
      return;
    }
    channel.publish({
      name: user?.login.email,
      data: { message: "구매 요청을 보냈습니다.", isRequest: true },
    });
    setIsActive(false);
  };

  const handleModal = (event: React.MouseEvent<HTMLDivElement>) => {
    event.preventDefault();
    setIsActive(true);
  };

  useEffect(() => {
    messageEnd.current?.scrollIntoView({ behavior: "smooth" });
  }, [receivedMessages]);
  return (
    <Layout canGoBack title={data?.user?.name} seoTitle="Chat Detail">
      <div className="space-y-4 py-10 px-4 pb-16">
        <div className="space-y-4">
          {messages}
          <div ref={messageEnd}></div>
        </div>
        <form
          className="fixed inset-x-0 bottom-0  bg-white py-2"
          onSubmit={handleFormSubmission}
        >
          <div className="relative mx-auto flex w-full  max-w-md items-center">
            {user?.id !== data?.room?.product.userId &&
              data?.room?.product.onSale && (
                <div
                  className=" flex h-9 w-9 cursor-pointer items-center justify-center rounded-full bg-orange-500 p-2 text-white hover:bg-orange-600"
                  onClick={handleModal}
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
                      d="M3 10h18M7 15h1m4 0h1m-7 4h12a3 3 0 003-3V8a3 3 0 00-3-3H6a3 3 0 00-3 3v8a3 3 0 003 3z"
                    ></path>
                  </svg>
                </div>
              )}
            <input
              type="text"
              className="ml-2 w-full rounded-full border-gray-300 pr-12 shadow-sm focus:border-orange-500 focus:outline-none focus:ring-orange-500"
              ref={inputBox}
              value={messageText}
              placeholder="Type a message..."
              onChange={(e) => setMessageText(e.target.value)}
              onKeyPress={handleKeyPress}
            />
            <div className="absolute inset-y-0 right-0 flex py-1.5 pr-1.5">
              <button
                className="flex items-center rounded-full bg-orange-500 px-3 text-sm text-white hover:bg-orange-600 focus:ring-2 focus:ring-orange-500 focus:ring-offset-2"
                type="submit"
                disabled={messageTextIsEmpty}
              >
                &rarr;
              </button>
            </div>
          </div>
        </form>
        <ModalBase active={isActive} closeEvent={onClickModalOff}>
          <CardModal
            closeEvent={onClickModalOff}
            title={data?.room?.product.name!}
            actionMsg={
              wallet?.currency! < data?.room?.product.price!
                ? "충전하기"
                : "구매 요청"
            }
            actionEvent={
              wallet?.currency! < data?.room?.product.price!
                ? () => router.push("/profile/wallet/charge")
                : sendPurchaseMessage
            }
          >
            {data?.room?.product.description}
            <br />
            {data?.room?.product.price}원
            {wallet?.currency! < data?.room?.product.price! && (
              <>
                <br />
                <br />
                <span className="text-red-600">
                  현재 잔액: {wallet?.currency!}원
                </span>
              </>
            )}
          </CardModal>
        </ModalBase>
      </div>
    </Layout>
  );
};

export default ChatDetail;
