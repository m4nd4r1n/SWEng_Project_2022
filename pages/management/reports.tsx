import type { NextPage, NextPageContext } from "next";
import Link from "next/link";
import Layout from "@components/layout";
import useUser from "@libs/client/useUser";
import { Report, User } from "@prisma/client";
import useSWR, { SWRConfig, useSWRConfig } from "swr";
import client from "@libs/server/client";
import { withSsrSession } from "@libs/server/withSession";
import { useState } from "react";
import { cls } from "@libs/client/utils";

interface ReportsResponse {
  ok: boolean;
  reports: Report[];
}

const Reports: NextPage = () => {
  const { user: me, isLoading } = useUser();

  const [type, setType] = useState("");
  const { mutate } = useSWRConfig();
  const { data: reports } = useSWR<ReportsResponse>(
    me?.manager ? "/api/reports" : null
  );

  console.log(reports);

  return (
    <Layout title="신고 관리" canGoBack seoTitle="Reports">
      <div className="fixed grid h-10 w-full min-w-[400px] max-w-[576px] grid-cols-2 border-b">
        <button
          className={cls(
            "border-b-2 pb-2 text-lg font-medium",
            type === "user"
              ? " border-orange-500 text-orange-400"
              : "border-transparent text-gray-500 transition-colors hover:text-gray-400"
          )}
          onClick={() => (type === "user" ? setType("") : setType("user"))}
        >
          계정신고
        </button>
        <button
          className={cls(
            "border-b-2 pb-2 text-lg font-medium",
            type === "product"
              ? " border-orange-500 text-orange-400"
              : "border-transparent text-gray-500 transition-colors hover:text-gray-400"
          )}
          onClick={() =>
            type === "product" ? setType("") : setType("product")
          }
        >
          상품신고
        </button>
      </div>
      <div className="mt-14 flex flex-col divide-y">
        {reports?.reports &&
          reports.reports
            .filter(
              (report) =>
                type === "" ||
                (type === "user" && !report.productId) ||
                (type === "product" && report.productId)
            )
            .map((report) => (
              <div
                key={report?.id}
                className="flex w-full min-w-[520px] flex-col items-start space-y-2 p-4"
              >
                <div className="flex w-full justify-between">
                  <h1 className="font-bold text-gray-700">
                    [ {report?.title} ]
                  </h1>
                  <div className="flex items-center justify-center">
                    <button
                      className="text-gray-800"
                      onClick={() => {
                        if (
                          window.confirm(
                            `[${report?.title}]\n신고 기록을 정말 삭제하시겠습니까?`
                          )
                        ) {
                          fetch(`/api/reports/${report.id}`, {
                            method: "DELETE",
                          }).then(() => mutate("/api/reports"));
                        }
                      }}
                    >
                      <svg
                        className="h-3 w-3"
                        fill="currentColor"
                        stroke="currentColor"
                        xmlns="http://www.w3.org/2000/svg"
                        viewBox="0 0 460.775 460.775"
                      >
                        <path
                          d="M285.08,230.397L456.218,59.27c6.076-6.077,6.076-15.911,0-21.986L423.511,4.565c-2.913-2.911-6.866-4.55-10.992-4.55
	c-4.127,0-8.08,1.639-10.993,4.55l-171.138,171.14L59.25,4.565c-2.913-2.911-6.866-4.55-10.993-4.55
	c-4.126,0-8.08,1.639-10.992,4.55L4.558,37.284c-6.077,6.075-6.077,15.909,0,21.986l171.138,171.128L4.575,401.505
	c-6.074,6.077-6.074,15.911,0,21.986l32.709,32.719c2.911,2.911,6.865,4.55,10.992,4.55c4.127,0,8.08-1.639,10.994-4.55
	l171.117-171.12l171.118,171.12c2.913,2.911,6.866,4.55,10.993,4.55c4.128,0,8.081-1.639,10.992-4.55l32.709-32.719
	c6.074-6.075,6.074-15.909,0-21.986L285.08,230.397z"
                        />
                      </svg>
                    </button>
                  </div>
                </div>
                {report?.description && (
                  <div className="text-sm text-gray-700">
                    <a>{report?.description}</a>
                  </div>
                )}
                <div className="flex w-full justify-end space-x-2 text-sm">
                  {report?.productId && (
                    <Link href={`/products/${report?.productId}`}>
                      <span className="text-gray-500 underline hover:text-gray-800">
                        상품정보
                      </span>
                    </Link>
                  )}
                  <Link href={`/users/profiles/${report?.userId}`}>
                    <span className="text-gray-500 underline hover:text-gray-800">
                      계정정보
                    </span>
                  </Link>
                </div>
              </div>
            ))}
      </div>
    </Layout>
  );
};

const Page: NextPage<{ reports: Report[] }> = ({ reports }) => {
  return (
    <SWRConfig
      value={{
        fallback: {
          "/api/reports": {
            ok: true,
            reports,
          },
        },
      }}
    >
      <Reports />
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
    const reports = await client.report.findMany();
    return {
      props: {
        reports: JSON.parse(JSON.stringify(reports)),
      },
    };
  }
);

export default Page;
