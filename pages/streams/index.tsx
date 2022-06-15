import type { NextPage } from "next";
import Link from "next/link";
import FloatingButton from "@components/floating-button";
import Layout from "@components/layout";
import { Stream } from "@prisma/client";
import useSWRInfinite from "swr/infinite";
import { useEffect } from "react";
import Image from "next/image";

interface StreamsResponse {
  ok: boolean;
  streams: Stream[];
}

const Streams: NextPage = () => {
  const getKey = (index: number) => `/api/streams?page=${index}`;
  const { data, size, setSize } = useSWRInfinite<StreamsResponse>(getKey);
  const isEnd = data && data[data.length - 1]?.streams?.length < 15;
  useEffect(() => {
    if (localStorage.streams_scroll && localStorage.streams_size) {
      setSize(+localStorage.streams_size);
      window.scrollTo(0, localStorage.streams_scroll);
    }
  }, [setSize]);
  return (
    <Layout hasTabBar title="라이브" seoTitle="Streams">
      <div className=" space-y-4 divide-y-[1px]">
        {data?.map((data) => {
          return data?.streams?.map((stream) => (
            <Link key={stream.id} href={`/streams/${stream.id}`}>
              <a
                className="block px-4 pt-4"
                onClick={() => {
                  localStorage.streams_scroll = window.scrollY;
                  localStorage.streams_size = size;
                }}
              >
                <div className="relative aspect-video w-full overflow-hidden rounded-md bg-slate-300 shadow-sm">
                  <Image
                    layout="fill"
                    src={`https://videodelivery.net/${stream.cloudflareId}/thumbnails/thumbnail.jpg?height=320`}
                    alt=""
                  />
                </div>
                <h1 className="mt-2 text-2xl font-bold text-gray-900">
                  {stream.name}
                </h1>
              </a>
            </Link>
          ));
        })}
        <FloatingButton
          href="/streams/create"
          onClick={() => {
            localStorage.streams_scroll = window.scrollY;
            localStorage.streams_size = size;
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
              d="M15 10l4.553-2.276A1 1 0 0121 8.618v6.764a1 1 0 01-1.447.894L15 14M5 18h8a2 2 0 002-2V8a2 2 0 00-2-2H5a2 2 0 00-2 2v8a2 2 0 002 2z"
            ></path>
          </svg>
        </FloatingButton>
      </div>
      <div className="flex justify-center">
        {!isEnd && (
          <button
            className="mt-4 h-12 w-1/2 rounded-md border border-transparent  bg-orange-500 px-4 font-medium text-white shadow-sm hover:bg-orange-600 focus:outline-none focus:ring-2 focus:ring-orange-500 focus:ring-offset-2"
            onClick={() =>
              +localStorage.streams_size === size
                ? setSize(+localStorage.streams_size + 1)
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

export default Streams;
