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
                          className="-z-20 rounded-full bg-slate-500"
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
                        <a className="flex items-center justify-center text-gray-400 transition hover:text-black">
                          <svg
                            className="h-14 w-14"
                            fill="none"
                            stroke="currentColor"
                            viewBox="0 0 24 24"
                            xmlns="http://www.w3.org/2000/svg"
                          >
                            <path
                              strokeLinecap="round"
                              strokeLinejoin="round"
                              strokeWidth="2"
                              d="M13 16h-1v-4h-1m1-4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z"
                            ></path>
                          </svg>
                        </a>
                      </Link>
                      {user.id !== me?.id &&
                        (user?.disabled ? (
                          <div
                            className="flex items-center justify-center text-gray-400 transition hover:text-black"
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
                              className="h-14 w-14"
                              fill="none"
                              stroke="currentColor"
                              viewBox="0 0 24 24"
                              xmlns="http://www.w3.org/2000/svg"
                            >
                              <path
                                strokeLinecap="round"
                                strokeLinejoin="round"
                                strokeWidth="2"
                                d="M4 4v5h.582m15.356 2A8.001 8.001 0 004.582 9m0 0H9m11 11v-5h-.581m0 0a8.003 8.003 0 01-15.357-2m15.357 2H15"
                              ></path>
                            </svg>
                          </div>
                        ) : (
                          <div
                            className="flex items-center justify-center text-gray-400 transition hover:text-red-600"
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
                              className="h-14 w-14"
                              fill="none"
                              stroke="currentColor"
                              viewBox="0 0 24 24"
                              xmlns="http://www.w3.org/2000/svg"
                            >
                              <path
                                strokeLinecap="round"
                                strokeLinejoin="round"
                                strokeWidth="2"
                                d="M18.364 18.364A9 9 0 005.636 5.636m12.728 12.728A9 9 0 015.636 5.636m12.728 12.728L5.636 5.636"
                              ></path>
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
