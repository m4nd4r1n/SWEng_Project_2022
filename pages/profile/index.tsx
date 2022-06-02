import type { NextPage, NextPageContext } from "next";
import Link from "next/link";
import Layout from "@components/layout";
import useUser from "@libs/client/useUser";
import useSWR, { SWRConfig } from "swr";
import { Review, User } from "@prisma/client";
import { cls } from "@libs/client/utils";
import Image from "next/image";
import { withSsrSession } from "@libs/server/withSession";
import client from "@libs/server/client";

interface ReviewWithUser extends Review {
  createdBy: User;
}
interface ReviewsResponse {
  ok: boolean;
  reviews: ReviewWithUser[];
}

interface WalletResponse {
  ok: boolean;
  id?: number;
  currency?: number;
}

const Profile: NextPage = () => {
  const { user } = useUser();
  const { data: wallet } = useSWR<WalletResponse>("/api/users/me/wallet");
  return (
    <Layout hasTabBar title="나의 캐럿" seoTitle="Profile">
      <div className="px-4">
        <div className="mt-4 flex items-center space-x-3">
          <div>
            {user?.avatar ? (
              <Image
                src={`https://imagedelivery.net/mBDIPXvPr-qhWpouLgwjOQ/${user?.avatar}/avatar`}
                className="h-16 w-16 rounded-full bg-slate-500"
                alt=""
                height={56}
                width={56}
              />
            ) : (
              <div className="flex h-16 w-16 items-center justify-center rounded-full bg-slate-500">
                <svg
                  className="h-8 w-8 items-center justify-center"
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
          <div className="flex h-16 w-[465px] flex-col items-start justify-center pl-4 pr-10">
            <span className="pb-2 font-bold text-gray-900">{user?.name}</span>
            <div className="flex w-full justify-between">
              <Link href={`/users/profiles/${user?.id}`}>
                <a className="flex space-x-1 text-sm text-gray-400 hover:text-black">
                  <span>상세정보</span>
                  <div className="flex items-center justify-center">
                    <svg
                      fill="black"
                      stroke="currentColor"
                      xmlns="http://www.w3.org/2000/svg"
                      viewBox="0 0 24 24"
                      width="15px"
                      height="15px"
                    >
                      <path d="M 12 2 C 6.4889971 2 2 6.4889971 2 12 C 2 17.511003 6.4889971 22 12 22 C 17.511003 22 22 17.511003 22 12 C 22 6.4889971 17.511003 2 12 2 z M 12 4 C 16.430123 4 20 7.5698774 20 12 C 20 16.430123 16.430123 20 12 20 C 7.5698774 20 4 16.430123 4 12 C 4 7.5698774 7.5698774 4 12 4 z M 11 7 L 11 9 L 13 9 L 13 7 L 11 7 z M 11 11 L 11 17 L 13 17 L 13 11 L 11 11 z" />
                    </svg>
                  </div>
                </a>
              </Link>
              <Link href="/profile/edit">
                <a className="flex space-x-1 text-sm text-gray-400 hover:text-black">
                  <span>프로필 수정</span>
                  <div className="flex items-center justify-center">
                    <svg
                      fill="black"
                      stroke="currentColor"
                      xmlns="http://www.w3.org/2000/svg"
                      viewBox="0 0 24 24"
                      width="15px"
                      height="15px"
                    >
                      <path d="M 18.414062 2 C 18.158062 2 17.902031 2.0979687 17.707031 2.2929688 L 15.707031 4.2929688 L 14.292969 5.7070312 L 3 17 L 3 21 L 7 21 L 21.707031 6.2929688 C 22.098031 5.9019687 22.098031 5.2689063 21.707031 4.8789062 L 19.121094 2.2929688 C 18.926094 2.0979687 18.670063 2 18.414062 2 z M 18.414062 4.4140625 L 19.585938 5.5859375 L 18.292969 6.8789062 L 17.121094 5.7070312 L 18.414062 4.4140625 z M 15.707031 7.1210938 L 16.878906 8.2929688 L 6.171875 19 L 5 19 L 5 17.828125 L 15.707031 7.1210938 z" />
                    </svg>
                  </div>
                </a>
              </Link>
            </div>
          </div>
        </div>
        <div className="mt-8 flex h-14 w-full justify-between rounded-lg border-2 border-orange-400">
          <Link href="/profile/wallet">
            <a className="flex w-full items-center">
              <span className="select-none pl-4 font-bold text-orange-400">
                Carrot Pay
              </span>
              <span className="select-none pl-4 font-bold text-gray-700">
                {wallet?.currency}원
              </span>
            </a>
          </Link>
          <Link href="/profile/wallet/charge">
            <a className="flex w-1/5 items-center justify-end">
              <span className="select-none pr-4 text-gray-500">충전하기</span>
            </a>
          </Link>
        </div>
        <div className="mt-10 flex justify-around">
          <Link href="/profile/sold">
            <a className="flex flex-col items-center">
              <div className="flex h-14 w-14 items-center justify-center rounded-full bg-orange-400 text-white">
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
                    d="M3 3h2l.4 2M7 13h10l4-8H5.4M7 13L5.4 5M7 13l-2.293 2.293c-.63.63-.184 1.707.707 1.707H17m0 0a2 2 0 100 4 2 2 0 000-4zm-8 2a2 2 0 11-4 0 2 2 0 014 0z"
                  ></path>
                </svg>
              </div>
              <span className="mt-2 text-sm font-medium text-gray-700">
                판매내역
              </span>
            </a>
          </Link>
          <Link href="/profile/bought">
            <a className="flex flex-col items-center">
              <div className="flex h-14 w-14 items-center justify-center rounded-full bg-orange-400 text-white">
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
                    d="M16 11V7a4 4 0 00-8 0v4M5 9h14l1 12H4L5 9z"
                  ></path>
                </svg>
              </div>
              <span className="mt-2 text-sm font-medium text-gray-700">
                구매내역
              </span>
            </a>
          </Link>
          <Link href="/profile/loved">
            <a className="flex flex-col items-center">
              <div className="flex h-14 w-14 items-center justify-center rounded-full bg-orange-400 text-white">
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
                    d="M4.318 6.318a4.5 4.5 0 000 6.364L12 20.364l7.682-7.682a4.5 4.5 0 00-6.364-6.364L12 7.636l-1.318-1.318a4.5 4.5 0 00-6.364 0z"
                  ></path>
                </svg>
              </div>
              <span className="mt-2 text-sm font-medium text-gray-700">
                관심목록
              </span>
            </a>
          </Link>
        </div>
      </div>
    </Layout>
  );
};

// export const getServerSideProps = withSsrSession(async function ({
//   req,
// }: NextPageContext) {
//   const profile = await client.user.findUnique({
//     where: { id: req?.session.user?.id },
//   });
//   return {
//     props: {
//       profile: JSON.parse(JSON.stringify(profile)),
//     },
//   };
// });

export default Profile;
