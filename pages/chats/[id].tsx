import type { NextPage } from "next";
import Layout from "@components/layout";
import Message from "@components/message";
import { useChannel } from "@libs/client/useChannel";
import React, { useEffect, useRef, useState } from "react";
import * as Ably from "ably";
import { useRouter } from "next/router";
import useUser from "@libs/client/useUser";

const ChatDetail: NextPage = () => {
  const router = useRouter();
  const { user } = useUser();
  const inputBox = useRef<HTMLInputElement>(null);
  const messageEnd = useRef<HTMLDivElement>(null);
  const [messageText, setMessageText] = useState("");
  const [receivedMessages, setMessages] = useState<Array<Ably.Types.Message>>(
    []
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
      console.log(reverse);
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
  const messages = receivedMessages.map((message, index) => {
    return (
      <Message
        key={index}
        message={message.data}
        reversed={message.name === user?.login.email}
      />
    );
  });

  useEffect(() => {
    messageEnd.current?.scrollIntoView({ behavior: "smooth" });
  }, [receivedMessages]);
  return (
    <Layout canGoBack title="Steve" seoTitle="Chat Detail">
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
            <input
              type="text"
              className="w-full rounded-full border-gray-300 pr-12 shadow-sm focus:border-orange-500 focus:outline-none focus:ring-orange-500"
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
      </div>
    </Layout>
  );
};

export default ChatDetail;
