import type { NextPage } from "next";
import Link from "next/link";
import Layout from "@components/layout";
import useSWR from "swr";
import Image from "next/image";
import { Product } from "@prisma/client";

interface Join {
  user: {
    id: number;
    name: string;
    avatar?: string;
  };
}
interface RequestMessage {
  message: string;
  isRequest: boolean;
}
interface RoomList {
  id: number;
  join: Join[];
  lastMessage?: string | RequestMessage;
  product: Product;
}

interface ChatRoomListResponse {
  ok: boolean;
  roomList: Array<RoomList>;
}

const Chats: NextPage = () => {
  const { data } = useSWR<ChatRoomListResponse>("/api/chats");

  return (
    <Layout hasTabBar title="채팅" seoTitle="Chat">
      <div className="divide-y-[1px] ">
        {data?.roomList?.map((list, i) => (
          <Link href={`/chats/${list.id}`} key={i}>
            <a className="flex cursor-pointer items-center space-x-3 px-4 py-3">
              {list.join[0].user.avatar ? (
                <Image
                  src={`https://imagedelivery.net/mBDIPXvPr-qhWpouLgwjOQ/${list.join[0].user.avatar}/avatar`}
                  className="h-12 w-12 rounded-full bg-slate-300"
                  alt=""
                  height={48}
                  width={48}
                />
              ) : (
                <div className="h-12 w-12 rounded-full bg-slate-300" />
              )}
              <div>
                <p className="flex items-center text-gray-700">
                  {list.join[0].user.name}
                  {"ㆍ"}
                  <span className="text-sm text-gray-600">
                    {list.product.name}
                  </span>
                </p>
                <p className="text-sm  text-gray-500">
                  {typeof list.lastMessage === "string"
                    ? list?.lastMessage?.slice(0, 30)
                    : list.lastMessage?.message}
                  {typeof list.lastMessage === "string" &&
                    list?.lastMessage?.length! > 30 &&
                    "..."}
                </p>
              </div>
            </a>
          </Link>
        ))}
      </div>
    </Layout>
  );
};

export default Chats;
