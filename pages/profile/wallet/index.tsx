import type { NextPage } from "next";
import Layout from "@components/layout";
import useSWR from "swr";
import Link from "next/link";

interface WalletResponse {
  ok: boolean;
  id?: number;
  currency?: number;
}

interface HistoryObject {
  amounts: number;
  createdAt: string;
}

interface WalletHistoryResponse {
  ok: boolean;
  history: Array<HistoryObject>;
}

const Wallet: NextPage = () => {
  const { data } = useSWR<WalletResponse>("/api/users/me/wallet");
  const { data: history } = useSWR<WalletHistoryResponse>(
    "/api/users/me/wallet/history"
  );
  return (
    <Layout title="Carrot Pay" canGoBack seoTitle="Carrot Pay">
      <div className="px-4">
        <div className="mt-8 flex h-40 flex-col rounded-xl border-2 border-orange-400 p-5">
          <span className="select-none text-gray-400">Carrot Pay</span>
          <span className="select-none py-3 text-xl font-bold text-gray-700">
            {data?.currency}원
          </span>
          <Link href="/profile/wallet/charge">
            <button className="h-10 select-none rounded-lg bg-gray-200 text-gray-700">
              충전하기
            </button>
          </Link>
        </div>
        <div className="mt-12 flex flex-col">
          <span className="text-lg font-semibold text-gray-700">
            최근 이용내역
          </span>
          {history?.history?.map((data, i) => (
            <div key={i} className="flex py-4">
              <div className="flex h-14 w-14 items-center justify-center rounded-full bg-orange-100 text-gray-700">
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
                    d="M17 9V7a2 2 0 00-2-2H5a2 2 0 00-2 2v6a2 2 0 002 2h2m2 4h10a2 2 0 002-2v-6a2 2 0 00-2-2H9a2 2 0 00-2 2v6a2 2 0 002 2zm7-5a2 2 0 11-4 0 2 2 0 014 0z"
                  ></path>
                </svg>
              </div>
              <div className="ml-4 flex flex-col justify-center">
                <span className="text-gray-700">Carrot Pay 충전</span>
                <span className="text-xs text-gray-400 ">
                  {new Date(data.createdAt).toLocaleDateString()}{" "}
                  {new Date(data.createdAt).toLocaleTimeString()} | 충전
                </span>
              </div>
              <div className="ml-auto flex items-center">
                <span className="text-lg font-bold text-gray-700">
                  {data.amounts}원
                </span>
              </div>
            </div>
          ))}
        </div>
      </div>
    </Layout>
  );
};

export default Wallet;
