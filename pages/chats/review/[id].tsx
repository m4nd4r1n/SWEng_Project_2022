import Layout from "@components/layout";
import { cls } from "@libs/client/utils";
import { GetServerSideProps, NextPage, NextPageContext } from "next";
import Image from "next/image";
import { useEffect, useState } from "react";
import useSWR from "swr";
import client from "@libs/server/client";
import TextArea from "@components/textarea";
import { useRouter } from "next/router";
import useMutation from "@libs/client/useMutation";
import { useForm } from "react-hook-form";
import Button from "@components/button";
import { Address, Product, User } from "@prisma/client";
import { withSsrSession } from "@libs/server/withSession";
import Error from "@components/error";

interface UserInfoResponse {
  ok: boolean;
  info: {
    avatar?: string;
    name: string;
  };
}

interface ReviewResponse {
  ok: boolean;
}

interface ReviewForm {
  review: string;
  formErrors?: string;
}

interface ProductWithUserAndAddress extends Product {
  user: User;
  address: Address;
}
interface ItemDetailResponse {
  ok: boolean;
  product: ProductWithUserAndAddress;
  relatedProducts: Product[];
  isLiked: boolean;
}

const Review: NextPage<{ userId: number; productId: number }> = ({
  userId,
  productId,
}) => {
  const [score, setScore] = useState(0);
  const [hoverScore, setHoverScore] = useState(0);
  const { data: product } = useSWR<ItemDetailResponse>(
    productId ? `/api/products/${productId}` : null
  );

  const router = useRouter();
  const {
    register,
    handleSubmit,
    setError,
    formState: { errors },
    clearErrors,
  } = useForm<ReviewForm>({ mode: "onChange" });
  const [send, { loading, data: response }] =
    useMutation<ReviewResponse>("/api/reviews");
  const onValid = (data: ReviewForm) => {
    if (loading) return;
    if (score === 0) {
      setError("formErrors", { message: "별점을 입력해 주세요." });
      return;
    }
    send({ ...data, score, userId, productId });
  };
  useEffect(() => {
    if (response && response.ok) {
      router.back();
    }
  }, [response, router]);

  useEffect(() => {
    clearErrors("formErrors");
  }, [score, clearErrors]);
  return (
    <Layout title="리뷰 남기기" canGoBack seoTitle="Leave a review">
      <div className="flex w-full flex-col items-center justify-center">
        <div className="mb-4 -mt-4 flex w-full bg-gray-100 p-5">
          <div className="flex">
            {product?.product.image ? (
              <Image
                className="rounded-lg bg-slate-300"
                src={`https://imagedelivery.net/mBDIPXvPr-qhWpouLgwjOQ/${product?.product.image}/avatar`}
                height={64}
                width={64}
                alt=""
              />
            ) : (
              <div className="h-16 w-16 rounded-lg bg-slate-300" />
            )}
          </div>
          <div className="ml-4 flex flex-col justify-between">
            <span className="text-gray-500">거래한 물건</span>
            <span className="text-gray-800">{product?.product.name}</span>
          </div>
        </div>
        <div className="mb-4 flex items-center justify-center">
          <div>
            <Image
              className="rounded-full"
              src={`https://imagedelivery.net/mBDIPXvPr-qhWpouLgwjOQ/${product?.product.user.avatar}/avatar`}
              height={48}
              width={48}
              alt=""
            />
          </div>
          <span className="ml-4 text-lg font-semibold text-gray-800">
            {product?.product.user.name}님과 거래가 어떠셨나요?
          </span>
        </div>
        <div className="flex w-full justify-center border-y py-4">
          {[1, 2, 3, 4, 5].map((star) => (
            <svg
              key={star}
              className={cls(
                "h-8 w-8 cursor-pointer hover:fill-orange-500 hover:text-orange-500",
                hoverScore >= star ? "fill-orange-500 text-orange-500" : "",
                !hoverScore && score >= star
                  ? "fill-orange-400 text-orange-400"
                  : ""
              )}
              fill="none"
              stroke="currentColor"
              viewBox="0 0 24 24"
              xmlns="http://www.w3.org/2000/svg"
              onClick={() => setScore(star)}
              onMouseOver={() => setHoverScore(star)}
              onMouseLeave={() => setHoverScore(0)}
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth="2"
                d="M11.049 2.927c.3-.921 1.603-.921 1.902 0l1.519 4.674a1 1 0 00.95.69h4.915c.969 0 1.371 1.24.588 1.81l-3.976 2.888a1 1 0 00-.363 1.118l1.518 4.674c.3.922-.755 1.688-1.538 1.118l-3.976-2.888a1 1 0 00-1.176 0l-3.976 2.888c-.783.57-1.838-.197-1.538-1.118l1.518-4.674a1 1 0 00-.363-1.118l-3.976-2.888c-.784-.57-.38-1.81.588-1.81h4.914a1 1 0 00.951-.69l1.519-4.674z"
              ></path>
            </svg>
          ))}
        </div>
        {errors.formErrors && <Error>{errors.formErrors?.message}</Error>}
        <form onSubmit={handleSubmit(onValid)} className="w-full space-y-4 p-4">
          <TextArea
            label="후기"
            register={register("review", {
              required: true,
              minLength: { value: 5, message: "5글자 이상 작성해 주세요." },
            })}
            required
            placeholder="후기를 작성해 주세요!"
          />
          {errors.review && <Error>{errors.review?.message}</Error>}
          <Button text={loading ? "Loading..." : "Submit"} />
        </form>
      </div>
    </Layout>
  );
};

export const getServerSideProps: GetServerSideProps = withSsrSession(
  async (context: NextPageContext) => {
    const { id, productId } = context.query;

    if (!parseInt(id as string)) return { notFound: true };

    if (!parseInt(productId as string)) return { notFound: true };

    const isUser = await client.user.findUnique({
      where: {
        id: +id!,
      },
    });

    if (!isUser) return { notFound: true };

    const isPurchased = await client.purchase.findFirst({
      where: {
        productId: +productId!,
        userId: +context.req?.session?.user?.id!,
      },
    });

    if (!isPurchased) return { notFound: true };

    if (isPurchased.reviewId) return { notFound: true };

    return {
      props: {
        userId: id,
        productId,
      },
    };
  }
);

export default Review;
