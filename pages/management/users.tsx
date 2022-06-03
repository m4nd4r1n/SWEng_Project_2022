import type { NextPage, NextPageContext } from "next";
import Link from "next/link";
import Layout from "@components/layout";
import useUser from "@libs/client/useUser";
import { Manager, User } from "@prisma/client";
import useSWR, { SWRConfig, useSWRConfig } from "swr";
import Image from "next/image";
import client from "@libs/server/client";
import { withSsrSession } from "@libs/server/withSession";
import { useState } from "react";

interface UserWithManager extends User {
  manager: Manager;
}

interface UsersResponse {
  ok: boolean;
  users: UserWithManager[];
}

const Users: NextPage = () => {
  const { user: me, isLoading } = useUser();
  const { mutate } = useSWRConfig();
  const { data } = useSWR<UsersResponse>("/api/users/all");
  const [query, setQuery] = useState("");

  return (
    <Layout title="계정 관리" hasTabBar={false} canGoBack seoTitle="Management">
      <div className="fixed -mt-4 flex w-full min-w-max max-w-[576px] flex-col border-b bg-white">
        <div
          id="search"
          className="flex w-full items-center justify-center p-4 px-5"
        >
          <input
            value={query}
            onChange={(e) => setQuery(e.target.value)}
            className="flex w-full appearance-none rounded-lg border border-gray-300 px-3 py-2 placeholder-gray-400 shadow-sm focus:border-orange-500 focus:outline-none focus:ring-orange-500"
            placeholder="계정 검색"
          />
        </div>
      </div>
      <div className="mt-14 flex flex-col divide-y">
        {data
          ? data?.users
              .filter(
                (user) =>
                  query === "" ||
                  user?.id.toString().includes(query) ||
                  user?.name.includes(query) ||
                  (query === "관리자" && 1)
              )
              .map((user) => (
                <div
                  key={user?.id}
                  className="flex w-full min-w-[520px] items-center space-x-3 p-4"
                >
                  <div>
                    {user?.avatar ? (
                      <div className="flex h-16 w-16 items-center justify-center">
                        <Image
                          src={`https://imagedelivery.net/mBDIPXvPr-qhWpouLgwjOQ/${user?.avatar}/avatar`}
                          className="rounded-full bg-slate-500"
                          alt=""
                          height={64}
                          width={64}
                        />
                      </div>
                    ) : (
                      <div className="flex h-16 w-16 items-center justify-center rounded-full bg-slate-500">
                        <svg
                          className="h-8 w-8"
                          fill="none"
                          stroke="currentColor"
                          viewBox="0 0 24 24"
                          xmlns="http://www.w3.org/2000/svg"
                        >
                          <path
                            strokeLinecap="round"
                            strokeLinejoin="round"
                            strokeWidth="2"
                            d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z"
                          ></path>
                        </svg>
                      </div>
                    )}
                  </div>
                  <div className="flex w-full flex-row items-center justify-start px-4">
                    <div className="flex w-1/2 flex-col">
                      <div className="space-x-1 pb-2 text-gray-900">
                        <span className="font-bold">{user?.name}</span>
                        {user?.manager && (
                          <span className="rounded bg-orange-200 text-sm">
                            관리자
                          </span>
                        )}
                      </div>
                      <div className="text-sm">
                        <div>
                          <span className="pb-2 text-gray-500">계정번호 </span>
                          <span className="pb-2 font-semibold text-gray-900">
                            {user?.id}
                          </span>
                        </div>
                        {user?.createdAt && (
                          <div>
                            <span className="pb-2 text-gray-500">
                              계정 생성일{" "}
                            </span>
                            <span className="pb-2 font-semibold text-gray-900">
                              {new Date(user?.createdAt).toLocaleDateString(
                                "ko-KR",
                                {
                                  day: "numeric",
                                  month: "short",
                                  year: "numeric",
                                }
                              )}
                            </span>
                          </div>
                        )}
                      </div>
                    </div>
                    <div className="grid w-1/2 grid-cols-2">
                      <Link href={`/users/profiles/${user?.id}`}>
                        <a className="flex items-center justify-center text-gray-400 hover:text-black">
                          <svg
                            stroke="currentColor"
                            fill="currentColor"
                            xmlns="http://www.w3.org/2000/svg"
                            viewBox="0 0 50 50"
                            width="50px"
                            height="50px"
                          >
                            <path d="M 25 2 C 12.309295 2 2 12.309295 2 25 C 2 37.690705 12.309295 48 25 48 C 37.690705 48 48 37.690705 48 25 C 48 12.309295 37.690705 2 25 2 z M 25 4 C 36.609824 4 46 13.390176 46 25 C 46 36.609824 36.609824 46 25 46 C 13.390176 46 4 36.609824 4 25 C 4 13.390176 13.390176 4 25 4 z M 25 11 A 3 3 0 0 0 22 14 A 3 3 0 0 0 25 17 A 3 3 0 0 0 28 14 A 3 3 0 0 0 25 11 z M 21 21 L 21 23 L 22 23 L 23 23 L 23 36 L 22 36 L 21 36 L 21 38 L 22 38 L 23 38 L 27 38 L 28 38 L 29 38 L 29 36 L 28 36 L 27 36 L 27 21 L 26 21 L 22 21 L 21 21 z" />
                          </svg>
                        </a>
                      </Link>
                      {user.id !== me?.id &&
                        (user?.disabled ? (
                          <div
                            className="flex items-center justify-center text-gray-400 hover:text-black"
                            onClick={() => {
                              if (
                                window.confirm(
                                  `${user?.name}의 계정을 복원시키겠습니까?`
                                )
                              ) {
                                fetch(
                                  `/api/users/management/enable/${user?.id}`,
                                  {
                                    method: "POST",
                                  }
                                ).then(() => mutate(`/api/users/all`));
                              }
                            }}
                          >
                            <svg
                              stroke="currentColor"
                              fill="currentColor"
                              width="50px"
                              height="50px"
                              viewBox="0 0 32 32"
                              id="icon"
                              xmlns="http://www.w3.org/2000/svg"
                            >
                              <path d="M18,28A12,12,0,1,0,6,16v6.2L2.4,18.6,1,20l6,6,6-6-1.4-1.4L8,22.2V16H8A10,10,0,1,1,18,26Z" />
                            </svg>
                          </div>
                        ) : (
                          <div
                            className="flex items-center justify-center text-gray-400 hover:text-red-600"
                            onClick={() => {
                              if (
                                window.confirm(
                                  `${user?.name}의 계정을 정지시키겠습니까?`
                                )
                              ) {
                                fetch(
                                  `/api/users/management/disable/${user?.id}`,
                                  {
                                    method: "POST",
                                  }
                                ).then(() => mutate(`/api/users/all`));
                              }
                            }}
                          >
                            <svg
                              stroke="currentColor"
                              fill="currentColor"
                              xmlns="http://www.w3.org/2000/svg"
                              viewBox="0 0 48 48"
                              width="50px"
                              height="50px"
                            >
                              <path
                                d="M5.7 22H42.5V26H5.7z"
                                transform="rotate(-45.001 24.036 24.037)"
                              />
                              <path d="M24,4C13,4,4,13,4,24s9,20,20,20s20-9,20-20S35,4,24,4z M24,40c-8.8,0-16-7.2-16-16S15.2,8,24,8 s16,7.2,16,16S32.8,40,24,40z" />
                            </svg>
                          </div>
                        ))}
                    </div>
                  </div>
                </div>
              ))
          : "Loading..."}
      </div>
    </Layout>
  );
};

const Page: NextPage<{ users: User[] }> = ({ users }) => {
  return (
    <SWRConfig
      value={{
        fallback: {
          "/api/users/all": {
            ok: true,
            users,
          },
        },
      }}
    >
      <Users />
    </SWRConfig>
  );
};

export const getServerSideProps = withSsrSession(
  async ({ req }: NextPageContext) => {
    // 매니저 명단에 없으면 home으로 redirect
    if (!req?.session?.user?.manager) {
      return {
        redirect: {
          permanent: false,
          destination: "/",
        },
      };
    }
    const users = await client.user.findMany();
    return {
      props: {
        users: JSON.parse(JSON.stringify(users)),
      },
    };
  }
);

export default Page;
