import type { NextPage } from "next";
import Link from "next/link";
import Layout from "@components/layout";
import useSWR from "swr";

interface Join {
  user: {
    id: number;
    name: string;
  };
}
interface RoomList {
  id: number;
  join: Array<Join>;
  lastMessage?: string;
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
              <div className="h-12 w-12 rounded-full bg-slate-300" />
              <div>
                <p className="text-gray-700">{list.join[0].user.name}</p>
                <p className="text-sm  text-gray-500">
                  {list?.lastMessage?.slice(0, 30)}
                  {list?.lastMessage?.length! > 30 && "..."}
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
