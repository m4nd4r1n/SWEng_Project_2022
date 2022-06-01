import type { NextPage, NextPageContext } from "next";
import Layout from "@components/layout";
import useSWR, { SWRConfig } from "swr";
import { Review, User, Product, Address } from "@prisma/client";
import { cls } from "@libs/client/utils";
import Image from "next/image";
import { withSsrSession } from "@libs/server/withSession";
import client from "@libs/server/client";
import { GetServerSideProps } from "next";
import { useState, useEffect } from "react";
import "chart.js/auto";
import { Doughnut } from "react-chartjs-2";
import { useRouter } from "next/router";

interface ReviewWithUser extends Review {
  createdBy: User;
}

interface ReviewsResponse {
  ok: boolean;
  reviews: ReviewWithUser[];
}

interface ProductWithAddressAndReviews extends Product {
  address: Address;
  receivedReviews: ReviewWithUser[];
}

interface ProfileWithProductAndReview extends User {
  products: Array<ProductWithAddressAndReviews>;
  receivedReviews: Array<ReviewWithUser>;
}

const catCount = (products: Array<ProductWithAddressAndReviews>) => [
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

const addCount = (
  products: Array<ProductWithAddressAndReviews>,
  addList: number[]
) =>
  addList.map(
    (address) =>
      products.filter((product) => product.addressId === address).length
  );

const CATEGORY = [
  "생활/건강",
  "식품",
  "디지털/가전",
  "출산/육아",
  "스포츠/레저",
  "패션잡화",
  "패션의류",
  "가구/인테리어",
  "도서",
  "화장품/미용",
  "여가/생활편의",
];

const COLORS = [
  "#FF6384",
  "#FF8C00",
  "#36A2EB",
  "#9ACD32",
  "#FFCE56",
  "#40E0D0",
  "#7B68EE",
  "#C71585",
  "#B8860B",
  "#663399",
  "#191970",
];

const Profile: NextPage<{ profile: ProfileWithProductAndReview }> = ({
  profile,
}) => {
  const router = useRouter();
  const { data } = useSWR<ReviewsResponse>(`/api/reviews/${router.query.id}`);
  const [count, setCount] = useState<{
    category: number[];
    addList: { id: number; sido: string; sigungu: string }[];
    address: number[];
  }>({ category: [], addList: [], address: [] });

  useEffect(() => {
    if (profile) {
      const address = Array.from(
        new Set(
          profile?.products.map((product) => JSON.stringify(product.address))
        )
      ).map((product) => JSON.parse(product));
      console.log(address);
      console.log(
        addCount(
          profile?.products,
          address.map((addr) => addr.id)
        )
      );
      setCount((prev) => ({
        ...prev,
        category: catCount(profile?.products),
        addList: address,
        address: addCount(
          profile?.products,
          address.map((addr) => addr.id)
        ),
      }));
    }
  }, [profile]);

  return (
    <Layout hasTabBar title="사용자 정보" seoTitle="Profile">
      <div className="min-w-[440px] px-4">
        <div className="flex w-full items-center space-x-3 border-b-2 py-4">
          <div>
            {profile?.avatar ? (
              <Image
                src={`https://imagedelivery.net/aSbksvJjax-AUC7qVnaC4A/${profile?.avatar}/avatar`}
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
            <span className="pb-2 font-bold text-gray-900">
              {profile?.name}
            </span>
            <div className="flex w-full flex-row">
              <div className="flex w-full justify-between">
                <div className="text-sm">
                  <span>등록 상품수</span>
                  <span className="font-bold text-orange-600">
                    {" "}
                    {profile?.products.length}
                  </span>
                </div>
                <div className="text-sm">
                  <span>평균 거래 만족도</span>
                  <span className="font-bold text-orange-600">
                    {" "}
                    {(data?.reviews ?? profile?.receivedReviews)
                      .map((review) => review?.score)
                      .reduce((sum, currValue) => sum + currValue) /
                      (data?.reviews ?? profile?.receivedReviews).length}
                  </span>
                </div>
                <div className="text-sm">
                  <span>거래 성사율</span>
                  <span className="font-bold text-orange-600">
                    {" "}
                    {(profile?.products
                      .map((product) =>
                        product?.onSale ? (0 as number) : (1 as number)
                      )
                      .reduce((sum, currValue) => sum + currValue) *
                      100) /
                      profile?.products.length}
                    %
                  </span>
                </div>
              </div>
            </div>
          </div>
        </div>
        <div className="flex flex-row border-b p-5">
          <div className="flex w-40 flex-col items-center justify-center">
            <h2 className="mb-4 font-bold">등록 상품 품목</h2>
            <Doughnut
              data={{
                datasets: [
                  {
                    data: count?.category,
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
              {count.category &&
                count.category
                  .map((count, index) => ({
                    category: CATEGORY[index],
                    count,
                  }))
                  .sort((a, b) => b.count - a.count)
                  .map(
                    (item, index) =>
                      index < 4 &&
                      item.count > 0 && <span key={index}>{item.category}</span>
                  )}
            </div>
            <div className="flex flex-col justify-between space-y-2">
              {count.category &&
                count.category
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
                            count.category.reduce((prev, curr) => prev + curr)
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
                    data: count.address,
                    borderRadius: 5,
                    backgroundColor: COLORS,
                    hoverBackgroundColor: COLORS,
                  },
                ],
                labels: count.addList.map(
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
              {count.address &&
                count.address
                  .map((cnt, index) => ({
                    address: count.addList[index],
                    cnt,
                  }))
                  .sort((a, b) => b.cnt - a.cnt)
                  .map(
                    (item, index) =>
                      index < 4 &&
                      item.cnt > 0 && (
                        <span key={index}>
                          {item.address.sido + " " + item.address.sigungu}
                        </span>
                      )
                  )}
            </div>
            <div className="flex flex-col justify-between space-y-2">
              {count.address &&
                count.address
                  .map((cnt, index) => ({
                    address: count.addList[index],
                    cnt,
                  }))
                  .sort((a, b) => b.cnt - a.cnt)
                  .map(
                    (item, index) =>
                      index < 4 &&
                      item.cnt > 0 && (
                        <span className="text-right" key={index}>
                          {(
                            (item.cnt * 100) /
                            count.address.reduce((prev, curr) => prev + curr)
                          ).toFixed(0)}
                          %
                        </span>
                      )
                  )}
            </div>
          </div>
        </div>
        {(data?.reviews ?? profile?.receivedReviews).map((review) => (
          <div
            key={review.id}
            className="flex items-start space-x-2 border-b py-4"
          >
            <div>
              {review?.createdBy?.avatar ? (
                <Image
                  src={`https://imagedelivery.net/aSbksvJjax-AUC7qVnaC4A/${profile?.avatar}/avatar`}
                  className="h-12 w-12 rounded-full bg-slate-500"
                  alt=""
                  height={12}
                  width={12}
                />
              ) : (
                <div className="flex h-12 w-12 items-center justify-center rounded-full bg-slate-500">
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
                </div>
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
                      review.score >= star ? "text-orange-400" : "text-gray-400"
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
    </Layout>
  );
};

export const getServerSideProps: GetServerSideProps = withSsrSession(
  async (context: NextPageContext) => {
    // get request id
    const { id } = context.query;

    // Read profile with user id value
    const profile = await client.user.findUnique({
      where: { id: Number(id) },
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
        receivedReviews: {
          include: {
            createdBy: {
              select: {
                name: true,
              },
            },
          },
        },
      },
    });
    return {
      props: {
        profile: JSON.parse(JSON.stringify(profile)),
      },
    };
  }
);

export default Profile;
