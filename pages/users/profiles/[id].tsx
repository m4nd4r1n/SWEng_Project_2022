import type { NextPage, NextPageContext } from "next";
import Link from "next/link";
import Layout from "@components/layout";
import useSWR, { SWRConfig } from "swr";
import { Review, User } from "@prisma/client";
import { cls } from "@libs/client/utils";
import Image from "next/image";
import client from "@libs/server/client";
import { GetServerSideProps } from "next";
import { useState, useEffect, useMemo } from "react";
import "chart.js/auto";
import { Doughnut, Pie } from "react-chartjs-2";

interface ReviewWithUser extends Review {
  createdBy: User;
}
interface ReviewsResponse {
  ok: boolean;
  reviews: ReviewWithUser[];
}

const Profile: NextPage<{ profile: User }> = ({ profile }) => {
  //const { data } = useSWR<ReviewsResponse>("/api/reviews");
  const [meanScore, setMeanScore] = useState(0);
  const reviews = useMemo(
    () => [
      {
        id: 1,
        review: "리뷰1",
        score: 5,
        createdBy: {
          name: "김정폭",
          avatar: null,
        },
      },
      {
        id: 2,
        review: "리뷰2",
        score: 2,
        createdBy: {
          name: "이으리",
          avatar: null,
        },
      },
      {
        id: 3,
        review: "리뷰3",
        score: 3,
        createdBy: {
          name: "박시아",
          avatar: null,
        },
      },
      {
        id: 4,
        review: "리뷰4",
        score: 4,
        createdBy: {
          name: "최명랑",
          avatar: null,
        },
      },
      {
        id: 5,
        review:
          "매우매우긴리뷰5매우매우긴리뷰5매우매우긴리뷰5매우매우긴리뷰5매우매우긴리뷰5매우매우긴리뷰5매우매우긴리뷰5매우매우긴리뷰5",
        score: 5,
        createdBy: {
          name: "신하늘",
          avatar: null,
        },
      },
    ],
    []
  );
  const catData = {
    datasets: [
      {
        data: [1, 2, 10, 1, 0, 0, 0, 0, 0, 0, 0],
        borderRadius: 5,
        backgroundColor: [
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
        ],
        hoverBackgroundColor: [
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
        ],
      },
    ],
    labels: [
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
    ],
  };

  const addData = {
    datasets: [
      {
        data: [15],
        borderRadius: 5,
        backgroundColor: [
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
        ],
        hoverBackgroundColor: [
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
        ],
      },
    ],
    labels: [
      "경기 성남시 분당구",
    ],
  };

  useEffect(() => {
    const score =
      reviews
        .map((review) => review.score)
        .reduce((sum, currValue) => sum + currValue) / reviews.length;
    setMeanScore(score);
  }, [reviews]);

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
              <div className="flex h-16 w-16 items-center justify-center rounded-full bg-slate-300">
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
                  <span className="font-bold text-orange-600"> {10}</span>
                </div>
                <div className="text-sm">
                  <span>평균 거래 만족도</span>
                  <span className="font-bold text-orange-600">
                    {" "}
                    {meanScore}
                  </span>
                </div>
                <div className="text-sm">
                  <span>거래 성사율</span>
                  <span className="font-bold text-orange-600"> {82.5}%</span>
                </div>
              </div>
            </div>
          </div>
        </div>
        <div className="flex border-b p-5 flex-row">
          <div className="flex flex-col w-40 justify-center items-center">
            <h2 className="mb-4 font-bold">등록 상품 품목</h2>
            <Doughnut
                data={catData}
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
          <div className="flex flex-row w-full justify-between items-center pt-8 px-12 space-x-12">
            <div className="flex flex-col space-y-2">
              <span>디지털/가전</span>
              <span>식품</span>
              <span>생활/건강</span>
              <span>출산/육아</span>
            </div>
            <div className="flex flex-col justify-between space-y-2">
              <span>{70}%</span>
              <span>{10}%</span>
              <span>{5}%</span>
              <span>{5}%</span>
            </div>
          </div>
        </div>
        <div className="flex border-b p-5 flex-row">
          <div className="flex flex-col w-40 justify-center items-center">
            <h2 className="mb-4 font-bold">주요 거래 지역</h2>
            <Doughnut
                data={addData}
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
          <div className="flex flex-row w-full justify-between items-center pt-8 px-12 space-x-12">
            <div className="flex flex-col space-y-2">
              <span>경기 성남시 분당구</span>
            </div>
            <div className="flex flex-col justify-between space-y-2">
              <span>{100}%</span>
            </div>
          </div>
        </div>
        {reviews.map((review) => (
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
                <div className="flex h-12 w-12 items-center justify-center rounded-full bg-slate-300">
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

export const getServerSideProps: GetServerSideProps = async (context) => {
  // get request id
  const { id } = context.query;

  // Read profile with user id value
  const profile = await client.user.findUnique({
    where: { id: Number(id) },
  });
  return {
    props: {
      profile: JSON.parse(JSON.stringify(profile)),
    },
  };
};

export default Profile;
