import type { GetServerSideProps, NextPage, NextPageContext } from "next";
import Layout from "@components/layout";
import TextArea from "@components/textarea";
import { Answer, Post, User } from "@prisma/client";
import { useRouter } from "next/router";
import useSWR from "swr";
import Link from "next/link";
import useMutation from "@libs/client/useMutation";
import { cls } from "@libs/client/utils";
import { useForm } from "react-hook-form";
import { useEffect } from "react";
import { withSsrSession } from "@libs/server/withSession";
import client from "@libs/server/client";
import Image from "next/image";
import Error from "@components/error";
import useUser from "@libs/client/useUser";

interface AnswerWithUser extends Answer {
  user: User;
  createdAt: Date;
}
interface PostWithUser extends Post {
  user: User;
  _count: {
    answers: number;
    wondering: number;
  };
  answers: AnswerWithUser[];
}

interface CommunityPostResponse {
  ok: boolean;
  post: PostWithUser;
  isWondering: boolean;
}

interface AnswerForm {
  answer: string;
}

interface AnswerResponse {
  ok: boolean;
  response: Answer;
}

const CommunityPostDetail: NextPage = () => {
  const router = useRouter();
  const {
    register,
    handleSubmit,
    reset,
    formState: { errors },
  } = useForm<AnswerForm>({ mode: "onChange" });
  const { data, mutate } = useSWR<CommunityPostResponse>(
    router.query.id ? `/api/posts/${router.query.id}` : null
  );
  const [wonder, { loading }] = useMutation(
    `/api/posts/${router.query.id}/wonder`
  );
  const [sendAnswer, { data: answerData, loading: answerLoading }] =
    useMutation<AnswerResponse>(`/api/posts/${router.query.id}/answers`);
  const { user } = useUser();
  const onWonderClick = () => {
    if (!data) return;
    mutate(
      {
        ...data,
        post: {
          ...data.post,
          _count: {
            ...data.post._count,
            wondering: data.isWondering
              ? data?.post._count.wondering - 1
              : data?.post._count.wondering + 1,
          },
        },
        isWondering: !data.isWondering,
      },
      false
    );
    if (!loading) {
      wonder({});
    }
  };
  const onValid = (form: AnswerForm) => {
    if (answerLoading) return;
    sendAnswer(form);
  };
  useEffect(() => {
    if (answerData && answerData.ok) {
      reset();
      mutate();
    }
  }, [answerData, reset, mutate]);
  useEffect(() => {
    if (data?.post === null) {
      router.back();
    }
  }, [data, router]);
  return (
    <Layout canGoBack seoTitle={data?.post?.question}>
      <div>
        <span className="my-3 ml-4 inline-flex items-center rounded-full bg-gray-100 px-2.5 py-0.5 text-xs font-medium text-gray-800">
          동네질문
        </span>
        <div className="mb-3 flex items-center justify-start space-x-3 border-b px-4 pb-3">
          {data?.post?.user.avatar ? (
            <div className="flex">
              <Image
                className="rounded-full"
                src={`https://imagedelivery.net/mBDIPXvPr-qhWpouLgwjOQ/${data?.post.user.avatar}/avatar`}
                width={40}
                height={40}
                alt=""
              />
            </div>
          ) : (
            <div className="h-10 w-10 rounded-full bg-slate-300" />
          )}
          <div>
            {data ? (
              <p className="text-sm font-medium text-gray-700">
                {data?.post?.user.name}
              </p>
            ) : (
              <div className="h-[0.875rem] animate-pulse rounded-md bg-slate-300" />
            )}
            <Link href={`/users/profiles/${data?.post?.user?.id}`}>
              <a className="text-xs font-medium text-gray-500 transition hover:text-gray-700">
                View profile &rarr;
              </a>
            </Link>
          </div>
          {(user?.id === data?.post?.user.id || user?.manager) && (
            <button
              className="!ml-auto"
              onClick={() => {
                if (window.confirm("삭제하시겠습니까?")) {
                  fetch(`/api/posts/${router.query.id}`, {
                    method: "DELETE",
                  }).then(() => router.replace("/community"));
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
                  d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16"
                ></path>
              </svg>
            </button>
          )}
        </div>
        <div>
          <div className="mt-2 px-4 text-gray-700">
            <span className="font-medium text-orange-500">Q.</span>{" "}
            {data?.post?.question}
          </div>
          <div className="mt-3 flex w-full space-x-5 border-t border-b-[2px] px-4 py-2.5  text-gray-700">
            <button
              onClick={onWonderClick}
              className={cls(
                "flex items-center space-x-2 text-sm",
                data?.isWondering ? "text-teal-600" : ""
              )}
            >
              <svg
                className="h-4 w-4"
                fill="none"
                stroke="currentColor"
                viewBox="0 0 24 24"
                xmlns="http://www.w3.org/2000/svg"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth="2"
                  d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z"
                ></path>
              </svg>
              <span>궁금해요 {data?.post?._count?.wondering}</span>
            </button>
            <span className="flex items-center space-x-2 text-sm">
              <svg
                className="h-4 w-4"
                fill="none"
                stroke="currentColor"
                viewBox="0 0 24 24"
                xmlns="http://www.w3.org/2000/svg"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth="2"
                  d="M8 12h.01M12 12h.01M16 12h.01M21 12c0 4.418-4.03 8-9 8a9.863 9.863 0 01-4.255-.949L3 20l1.395-3.72C3.512 15.042 3 13.574 3 12c0-4.418 4.03-8 9-8s9 3.582 9 8z"
                ></path>
              </svg>
              <span>답변 {data?.post?._count?.answers}</span>
            </span>
          </div>
        </div>
        <div className="my-5 space-y-5 px-4">
          {data?.post?.answers?.map((answer) => (
            <div key={answer.id} className="flex items-start space-x-3">
              {answer.user.avatar ? (
                <div className="block">
                  <Image
                    src={`https://imagedelivery.net/mBDIPXvPr-qhWpouLgwjOQ/${answer.user.avatar}/avatar`}
                    className="block rounded-full"
                    height={32}
                    width={32}
                    alt=""
                  />
                </div>
              ) : (
                <div className="h-8 w-8 rounded-full bg-slate-200" />
              )}
              <div className="w-5/6">
                <span className="block text-sm font-medium text-gray-700">
                  {answer.user.name}
                </span>
                <span className="block text-xs text-gray-500 ">
                  {new Date(answer.createdAt).toLocaleString()}
                </span>
                <p className="mt-2 break-words text-gray-700">
                  {answer.answer}
                </p>
              </div>
              {(user?.id === answer.user.id || user?.manager) && (
                <button
                  className="!ml-auto"
                  onClick={() => {
                    if (window.confirm("삭제하시겠습니까?")) {
                      fetch(`/api/posts/${answer.id}/answers`, {
                        method: "DELETE",
                      }).then(() =>
                        mutate({
                          ...data,
                          post: {
                            ...data.post,
                          },
                        })
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
                      d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16"
                    ></path>
                  </svg>
                </button>
              )}
            </div>
          ))}
        </div>
        <form className="px-4" onSubmit={handleSubmit(onValid)}>
          <TextArea
            name="description"
            placeholder="Answer this question!"
            required
            register={register("answer", {
              required: true,
              minLength: { value: 5, message: "5글자 이상 입력해 주세요." },
            })}
          />
          {errors.answer && <Error>{errors.answer.message}</Error>}
          <button className="mt-2 w-full rounded-md border border-transparent bg-orange-500 py-2 px-4 text-sm font-medium text-white shadow-sm transition hover:bg-orange-600 focus:outline-none focus:ring-2 focus:ring-orange-500 focus:ring-offset-2 ">
            {answerLoading ? "Loading..." : "Reply"}
          </button>
        </form>
      </div>
    </Layout>
  );
};

export const getServerSideProps: GetServerSideProps = withSsrSession(
  async (context: NextPageContext) => {
    const { id } = context.query;

    if (!parseInt(id as string) && parseInt(id as string) !== 0) {
      return {
        notFound: true,
      };
    }

    const post = await client.post.findUnique({
      where: {
        id: +id!,
      },
    });

    if (!post) {
      return {
        notFound: true,
      };
    }

    return {
      props: {},
    };
  }
);

export default CommunityPostDetail;
