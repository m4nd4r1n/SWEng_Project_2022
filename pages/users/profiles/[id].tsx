import type { NextPage, NextPageContext, GetServerSideProps } from "next";
import Layout from "@components/layout";
import useSWR, { useSWRConfig, SWRConfig } from "swr";
import { Review, User, Product, Address, Report } from "@prisma/client";
import { cls } from "@libs/client/utils";
import Image from "next/image";
import { withSsrSession } from "@libs/server/withSession";
import client from "@libs/server/client";
import { useState, useEffect } from "react";
import "chart.js/auto";
import { Doughnut } from "react-chartjs-2";
import { useRouter } from "next/router";
import useUser from "@libs/client/useUser";
import { CATEGORY, COLORS } from "@libs/string";
import FloatingButton from "@components/floating-button";

interface ReviewWithUser extends Review {
  createdBy: User;
}

interface ReviewsResponse {
  ok: boolean;
  reviews: ReviewWithUser[];
}

interface ReportsResponse {
  ok: boolean;
  reports: Report[];
}

interface ProductWithAddress extends Product {
  address: Address;
}

interface ProfileWithProduct extends User {
  products: Array<ProductWithAddress>;
}

interface ProfileResponse {
  ok: boolean;
  profile: ProfileWithProduct;
}

const catCount = (products: Array<ProductWithAddress>) => [
  products.filter((product) => product.categoryId === 10000).length,
  products.filter((product) => product.categoryId === 20000).length,
  products.filter((product) => product.categoryId === 30000).length,
  products.filter((product) => product.categoryId === 40000).length,
  products.filter((product) => product.categoryId === 50000).length,
  products.filter((product) => product.categoryId === 60001).length,
  products.filter((product) => product.categoryId === 60002).length,
  products.filter((product) => product.categoryId === 60003).length,
  products.filter((product) => product.categoryId === 70000).length,
  products.filter((product) => product.categoryId === 80000).length,
  products.filter((product) => product.categoryId === 90000).length,
];

const addCount = (products: Array<ProductWithAddress>, addList: number[]) =>
  addList.map(
    (address) =>
      products.filter((product) => product.addressId === address).length
  );

const Profile: NextPage = () => {
  const { user: me } = useUser();
  const { mutate } = useSWRConfig();
  const router = useRouter();
  const { data: profile } = useSWR<ProfileResponse>(
    `/api/profile/${router.query.id}`
  );
  const { data: reviews } = useSWR<ReviewsResponse>(
    router.query.id ? `/api/reviews/${router.query.id}` : null
  );
  const { data: reports } = useSWR<ReportsResponse>(
    me?.manager && router.query.id ? `/api/reports/${router.query.id}` : null
  );
  const [state, setState] = useState<{
    printReview: boolean;
    printReport: boolean;
    category: number[];
    addList: { id: number; sido: string; sigungu: string }[];
    address: number[];
  }>({
    printReview: false,
    printReport: false,
    category: [],
    addList: [],
    address: [],
  });
  const onReportClick = () => {
    router.push(`/report/${profile?.profile?.id}`);
  };

  useEffect(() => {
    if (profile?.profile) {
      const address = Array.from(
        new Set(
          profile?.profile?.products.map((product) =>
            JSON.stringify(product.address)
          )
        )
      ).map((product) => JSON.parse(product));
      console.log(address);
      console.log(
        addCount(
          profile?.profile?.products,
          address.map((addr) => addr.id)
        )
      );
      setState((prev) => ({
        ...prev,
        category: catCount(profile?.profile?.products),
        addList: address,
        address: addCount(
          profile?.profile?.products,
          address.map((addr) => addr.id)
        ),
      }));
    }
  }, [profile]);

  return (
    <Layout hasTabBar={false} canGoBack title="사용자 정보" seoTitle="Profile">
      <div className="min-w-[440px] px-4">
        <div className="flex w-full items-center space-x-3 border-b-2 py-4">
          <div>
            {profile?.profile?.avatar ? (
              <Image
                src={`https://imagedelivery.net/mBDIPXvPr-qhWpouLgwjOQ/${profile?.profile?.avatar}/avatar`}
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
          <div className="flex h-16 w-[465px] flex-col items-start justify-center px-4">
            <div className="flex w-full justify-between">
              <span className="pb-2 font-bold text-gray-900">
                {profile?.profile?.name}
              </span>
              <div className="flex items-center justify-center">
                {me?.manager &&
                  me.id !== profile?.profile.id &&
                  (profile?.profile.disabled ? (
                    <button
                      className="flex items-center justify-center text-gray-400 transition hover:text-black"
                      onClick={() => {
                        if (
                          window.confirm(
                            `${profile?.profile?.name}의 계정을 복원시키겠습니까?`
                          )
                        ) {
                          fetch(
                            `/api/users/management/enable/${profile?.profile?.id}`,
                            {
                              method: "POST",
                            }
                          ).then(() =>
                            mutate(`/api/profile/${router.query.id}`)
                          );
                        }
                      }}
                    >
                      <svg
                        className="h-6 w-6"
                        stroke="currentColor"
                        fill="currentColor"
                        viewBox="0 0 32 32"
                        id="icon"
                        xmlns="http://www.w3.org/2000/svg"
                      >
                        <path d="M18,28A12,12,0,1,0,6,16v6.2L2.4,18.6,1,20l6,6,6-6-1.4-1.4L8,22.2V16H8A10,10,0,1,1,18,26Z" />
                      </svg>
                    </button>
                  ) : (
                    <button
                      className="text-gray-500 transition hover:text-red-700"
                      onClick={() => {
                        if (
                          window.confirm(
                            `${profile?.profile?.name}의 계정을 정지시키겠습니까?`
                          )
                        ) {
                          fetch(
                            `/api/users/management/disable/${profile?.profile?.id}`,
                            {
                              method: "POST",
                            }
                          ).then(() =>
                            mutate(`/api/profile/${router.query.id}`)
                          );
                        }
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
                          d="M18.364 18.364A9 9 0 005.636 5.636m12.728 12.728A9 9 0 015.636 5.636m12.728 12.728L5.636 5.636"
                        ></path>
                      </svg>
                    </button>
                  ))}
              </div>
            </div>

            <div className="flex w-full flex-row">
              <div className="flex w-full justify-between">
                <div className="text-sm">
                  <span>등록 상품수</span>
                  <span className="font-bold text-orange-600">
                    {" "}
                    {profile?.profile?.products.length}
                  </span>
                </div>
                <div className="text-sm">
                  <span>평균 거래 만족도</span>
                  <span className="font-bold text-orange-600">
                    {" "}
                    {reviews?.reviews &&
                      Math.round(
                        (reviews?.reviews
                          .map((review) => review?.score)
                          .reduce((sum, currValue) => sum + currValue, 0) /
                          (reviews?.reviews.length || 1)) *
                          100
                      ) / 100}
                  </span>
                </div>
                <div className="text-sm">
                  <span>거래 성사율</span>
                  <span className="font-bold text-orange-600">
                    {" "}
                    {profile?.profile &&
                      Math.round(
                        ((profile?.profile?.products
                          .map((product) =>
                            product?.onSale ? (0 as number) : (1 as number)
                          )
                          .reduce((sum, currValue) => sum + currValue, 0) *
                          100) /
                          (profile?.profile?.products.length || 1)) *
                          10
                      ) / 10}
                    %
                  </span>
                </div>
              </div>
            </div>
          </div>
        </div>
        {me?.id !== profile?.profile?.id && (
          <FloatingButton href={`/report/${profile?.profile?.id}`}>
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
                d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z"
              ></path>
            </svg>
          </FloatingButton>
        )}
        {profile?.profile?.products.length !== 0 && (
          <>
            <div className="flex flex-row border-b p-5">
              <div className="flex w-40 flex-col items-center justify-center">
                <h2 className="mb-4 font-bold">등록 상품 품목</h2>
                <Doughnut
                  data={{
                    datasets: [
                      {
                        data: state?.category,
                        borderRadius: 5,
                        backgroundColor: COLORS,
                        hoverBackgroundColor: COLORS,
                      },
                    ],
                    labels: CATEGORY,
                  }}
                  width={200}
                  height={200}
                  options={{
                    plugins: {
                      legend: {
                        display: false,
                      },
                    },
                  }}
                />
              </div>
              <div className="flex w-full flex-row items-center justify-between space-x-12 px-12 pt-8">
                <div className="flex flex-col space-y-2">
                  {state.category &&
                    state.category
                      .map((count, index) => ({
                        category: CATEGORY[index],
                        count,
                      }))
                      .sort((a, b) => b.count - a.count)
                      .map(
                        (item, index) =>
                          index < 4 &&
                          item.count > 0 && (
                            <span key={index}>{item.category}</span>
                          )
                      )}
                </div>
                <div className="flex flex-col justify-between space-y-2">
                  {state.category &&
                    state.category
                      .map((count, index) => ({
                        category: CATEGORY[index],
                        count,
                      }))
                      .sort((a, b) => b.count - a.count)
                      .map(
                        (item, index) =>
                          index < 4 &&
                          item.count > 0 && (
                            <span className="text-right" key={index}>
                              {(
                                (item.count * 100) /
                                state.category.reduce(
                                  (prev, curr) => prev + curr
                                )
                              ).toFixed(0)}
                              %
                            </span>
                          )
                      )}
                </div>
              </div>
            </div>
            <div className="flex flex-row border-b p-5">
              <div className="flex w-40 flex-col items-center justify-center">
                <h2 className="mb-4 font-bold">주요 거래 지역</h2>
                <Doughnut
                  data={{
                    datasets: [
                      {
                        data: state.address,
                        borderRadius: 5,
                        backgroundColor: COLORS,
                        hoverBackgroundColor: COLORS,
                      },
                    ],
                    labels: state.addList.map(
                      (address) => address.sido + " " + address.sigungu
                    ),
                  }}
                  width={200}
                  height={200}
                  options={{
                    plugins: {
                      legend: {
                        display: false,
                      },
                    },
                  }}
                />
              </div>
              <div className="flex w-full flex-row items-center justify-between space-x-12 px-12 pt-8">
                <div className="flex flex-col space-y-2">
                  {state.address &&
                    state.address
                      .map((count, index) => ({
                        address: state.addList[index],
                        count,
                      }))
                      .sort((a, b) => b.count - a.count)
                      .map(
                        (item, index) =>
                          index < 4 &&
                          item.count > 0 && (
                            <span key={index}>
                              {item.address.sido + " " + item.address.sigungu}
                            </span>
                          )
                      )}
                </div>
                <div className="flex flex-col justify-between space-y-2">
                  {state.address &&
                    state.address
                      .map((count, index) => ({
                        address: state.addList[index],
                        count,
                      }))
                      .sort((a, b) => b.count - a.count)
                      .map(
                        (item, index) =>
                          index < 4 &&
                          item.count > 0 && (
                            <span className="text-right" key={index}>
                              {(
                                (item.count * 100) /
                                state.address.reduce(
                                  (prev, curr) => prev + curr
                                )
                              ).toFixed(0)}
                              %
                            </span>
                          )
                      )}
                </div>
              </div>
            </div>
          </>
        )}
        {reviews?.reviews && reviews?.reviews.length !== 0 && (
          <div className="flex flex-col justify-end divide-y border-b-2">
            <button
              className="flex items-center justify-end space-x-2 p-4 text-sm text-gray-500 transition hover:text-black"
              onClick={() =>
                setState((prev) => ({
                  ...prev,
                  printReview: !state.printReview,
                }))
              }
            >
              {state.printReview ? (
                <>
                  <span>리뷰 닫기</span>
                  <svg
                    className="h-3 w-3 items-center justify-center"
                    fill="currentColor"
                    stroke="currentColor"
                    xmlns="http://www.w3.org/2000/svg"
                    x="0px"
                    y="0px"
                    viewBox="0 0 330 330"
                  >
                    <path
                      d="M324.001,209.25L173.997,96.75c-5.334-4-12.667-4-18,0L6.001,209.25c-6.627,4.971-7.971,14.373-3,21
	c2.947,3.93,7.451,6.001,12.012,6.001c3.131,0,6.29-0.978,8.988-3.001L164.998,127.5l141.003,105.75c6.629,4.972,16.03,3.627,21-3
	C331.972,223.623,330.628,214.221,324.001,209.25z"
                    />
                  </svg>
                </>
              ) : (
                <>
                  <span>리뷰 보기</span>
                  <svg
                    className="h-3 w-3 items-center justify-center"
                    fill="currentColor"
                    stroke="currentColor"
                    xmlns="http://www.w3.org/2000/svg"
                    x="0px"
                    y="0px"
                    viewBox="0 0 330 330"
                  >
                    <path
                      d="M325.607,79.393c-5.857-5.857-15.355-5.858-21.213,0.001l-139.39,139.393L25.607,79.393
	c-5.857-5.857-15.355-5.858-21.213,0.001c-5.858,5.858-5.858,15.355,0,21.213l150.004,150c2.813,2.813,6.628,4.393,10.606,4.393
	s7.794-1.581,10.606-4.394l149.996-150C331.465,94.749,331.465,85.251,325.607,79.393z"
                    />
                  </svg>
                </>
              )}
            </button>
            {reviews?.reviews &&
              state.printReview &&
              reviews?.reviews.map((review) => (
                <div
                  key={review.id}
                  className="flex items-start space-x-2 py-4"
                >
                  <div className="flex h-12 w-12 items-center justify-center rounded-full bg-slate-500">
                    {review?.createdBy?.avatar ? (
                      <Image
                        src={`https://imagedelivery.net/mBDIPXvPr-qhWpouLgwjOQ/${review.createdBy?.avatar}/avatar`}
                        className="h-12 w-12 rounded-full bg-slate-500"
                        alt=""
                        height={48}
                        width={48}
                      />
                    ) : (
                      <svg
                        className="h-6 w-6 items-center justify-center"
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
                    )}
                  </div>
                  <div className="flex flex-col">
                    <span className="text-sm font-bold text-gray-800">
                      {review.createdBy.name}
                    </span>
                    <div className="flex items-center">
                      {[1, 2, 3, 4, 5].map((star) => (
                        <svg
                          key={star}
                          className={cls(
                            "h-5 w-5",
                            review.score >= star
                              ? "text-orange-400"
                              : "text-gray-400"
                          )}
                          xmlns="http://www.w3.org/2000/svg"
                          viewBox="0 0 20 20"
                          fill="currentColor"
                          aria-hidden="true"
                        >
                          <path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118l-2.8-2.034a1 1 0 00-1.175 0l-2.8 2.034c-.784.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 00-.364-1.118L2.98 8.72c-.783-.57-.38-1.81.588-1.81h3.461a1 1 0 00.951-.69l1.07-3.292z" />
                        </svg>
                      ))}
                    </div>
                    <div className="mt-4 text-sm text-gray-600">
                      <p>{review.review}</p>
                    </div>
                  </div>
                </div>
              ))}
          </div>
        )}
        {reports?.reports && reports?.reports.length !== 0 && me?.manager && (
          <div className="flex flex-col justify-end divide-y border-b-2">
            <button
              className="flex items-center justify-end space-x-2 p-4 text-sm text-gray-500 transition hover:text-black"
              onClick={() =>
                setState((prev) => ({
                  ...prev,
                  printReport: !state.printReport,
                }))
              }
            >
              {state.printReport ? (
                <>
                  <span>신고기록 닫기</span>
                  <svg
                    className="h-3 w-3 items-center justify-center"
                    fill="currentColor"
                    stroke="currentColor"
                    xmlns="http://www.w3.org/2000/svg"
                    x="0px"
                    y="0px"
                    viewBox="0 0 330 330"
                  >
                    <path
                      d="M324.001,209.25L173.997,96.75c-5.334-4-12.667-4-18,0L6.001,209.25c-6.627,4.971-7.971,14.373-3,21
	c2.947,3.93,7.451,6.001,12.012,6.001c3.131,0,6.29-0.978,8.988-3.001L164.998,127.5l141.003,105.75c6.629,4.972,16.03,3.627,21-3
	C331.972,223.623,330.628,214.221,324.001,209.25z"
                    />
                  </svg>
                </>
              ) : (
                <>
                  <span>신고기록 보기</span>
                  <svg
                    className="h-3 w-3 items-center justify-center"
                    fill="currentColor"
                    stroke="currentColor"
                    xmlns="http://www.w3.org/2000/svg"
                    x="0px"
                    y="0px"
                    viewBox="0 0 330 330"
                  >
                    <path
                      d="M325.607,79.393c-5.857-5.857-15.355-5.858-21.213,0.001l-139.39,139.393L25.607,79.393
	c-5.857-5.857-15.355-5.858-21.213,0.001c-5.858,5.858-5.858,15.355,0,21.213l150.004,150c2.813,2.813,6.628,4.393,10.606,4.393
	s7.794-1.581,10.606-4.394l149.996-150C331.465,94.749,331.465,85.251,325.607,79.393z"
                    />
                  </svg>
                </>
              )}
            </button>
            {state.printReport &&
              reports?.reports &&
              reports?.reports.length !== 0 &&
              reports?.reports.map((report) => (
                <div
                  key={report.id}
                  className="flex flex-col items-start space-y-2 border-b p-4 text-gray-600"
                >
                  <h2 className="flex w-full font-bold">[ {report?.title} ]</h2>
                  {report?.description && (
                    <a className="flex w-full text-sm">{report?.description}</a>
                  )}
                  {report?.createdAt && (
                    <span className="flex w-full justify-end text-xs">
                      {new Date(report?.createdAt).toLocaleDateString("ko-KR", {
                        day: "numeric",
                        month: "short",
                        year: "numeric",
                      })}
                    </span>
                  )}
                </div>
              ))}
          </div>
        )}
      </div>
    </Layout>
  );
};

const Page: NextPage<{ profile: ProfileResponse; id: string }> = ({
  profile,
  id,
}) => {
  const url = "/api/profile/" + id;

  return (
    <SWRConfig
      value={{
        fallback: {
          [url]: {
            ok: true,
            profile,
          },
        },
      }}
    >
      <Profile />
    </SWRConfig>
  );
};

export const getServerSideProps: GetServerSideProps = withSsrSession(
  async (context: NextPageContext) => {
    // get request id
    const { id } = context.query;

    if (!parseInt(id as string) && parseInt(id as string) !== 0) {
      return {
        notFound: true,
      };
    }

    // Read profile with user id value
    const profile = await client.user.findUnique({
      where: { id: parseInt(id as string) },
      include: {
        login: {
          select: {
            email: true,
          },
        },
        products: {
          select: {
            categoryId: true,
            addressId: true,
            onSale: true,
            address: {
              select: {
                id: true,
                sido: true,
                sigungu: true,
              },
            },
          },
          orderBy: {
            categoryId: "asc",
          },
        },
      },
    });

    if (!profile) {
      return {
        notFound: true,
      };
    }
    return {
      props: {
        profile: JSON.parse(JSON.stringify(profile)),
        id,
      },
    };
  }
);

export default Page;
