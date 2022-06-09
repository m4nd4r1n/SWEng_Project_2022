import type { GetServerSideProps, NextPage, NextPageContext } from "next";
import Button from "@components/button";
import Input from "@components/input";
import Layout from "@components/layout";
import TextArea from "@components/textarea";
import { useForm } from "react-hook-form";
import useMutation from "@libs/client/useMutation";
import { Product } from "@prisma/client";
import { useRouter } from "next/router";
import { useEffect, useRef, useState } from "react";
import Image from "next/image";
import { inNumber } from "@libs/client/utils";
import useAddress from "@libs/client/useAddress";
import Dropdown from "@components/dropdown";
import { withSsrSession } from "@libs/server/withSession";
import client from "@libs/server/client";
import Error from "@components/error";

interface EditProductForm {
  name: string;
  price: string;
  description: string;
  photo: FileList;
  catId: string;
}

interface EditProductResponse {
  ok: boolean;
  error?: string;
}

const EditProduct: NextPage<{ product: Product }> = ({ product }) => {
  const router = useRouter();
  const { id: addressId, sido, sigungu } = useAddress();
  const selectRef = useRef<HTMLSelectElement>(null);
  const {
    register,
    setValue,
    handleSubmit,
    watch,
    setError,
    clearErrors,
    formState: { errors },
  } = useForm<EditProductForm>({ mode: "onChange" });
  const catId = watch("catId");
  useEffect(() => {
    if (product?.name) setValue("name", product.name);
    if (product?.price) setValue("price", product.price.toString());
    if (product?.description) setValue("description", product.description);
    if (product?.categoryId) setValue("catId", product.categoryId.toString());
    if (product?.image)
      setPhotoPreview(
        `https://imagedelivery.net/mBDIPXvPr-qhWpouLgwjOQ/${product?.image}/public`
      );
  }, [product, setValue]);
  const [editProduct, { loading, data }] = useMutation<EditProductResponse>(
    `/api/products/${product?.id}`
  );
  const onValid = async ({
    name,
    price,
    description,
    photo,
  }: EditProductForm) => {
    if (loading) return;
    if (photo && photo.length > 0) {
      const { uploadURL } = await (await fetch(`/api/files`)).json();
      const form = new FormData();
      form.append("file", photo[0], name);
      const {
        result: { id },
      } = await (await fetch(uploadURL, { method: "POST", body: form })).json();
      editProduct({
        name,
        price: +price,
        description,
        photoId: id,
        addressId,
        sido,
        sigungu,
        categoryId: +catId,
      });
    } else {
      editProduct({
        name,
        price: +price,
        description,
        addressId,
        sido,
        sigungu,
        categoryId: +catId,
      });
    }
  };
  useEffect(() => {
    if (data?.ok) {
      router.replace(`/products/${product.id}`);
    }
  }, [data?.ok, product, router]);
  const photo = watch("photo");
  const [photoPreview, setPhotoPreview] = useState("");
  useEffect(() => {
    if (photo && photo.length > 0) {
      const file = photo[0];
      setPhotoPreview(URL.createObjectURL(file));
    }
  }, [photo]);
  useEffect(() => {
    if (!catId) {
      setError("catId", {
        type: "validate",
        message: "카테고리를 선택해 주세요.",
      });
    }
    if (catId) {
      clearErrors("catId");
    }
  }, [catId, setError, clearErrors]);
  return (
    <Layout canGoBack title="Edit Product" seoTitle="Product Edit">
      <form className="space-y-4 p-4" onSubmit={handleSubmit(onValid)}>
        <div className="relative h-80 w-full">
          {photoPreview ? (
            <>
              <Image
                src={photoPreview}
                layout="fill"
                objectFit="contain"
                alt=""
              />
              <div className="z-50 flex h-full items-end justify-end">
                <label
                  htmlFor="picture"
                  className="z-10 cursor-pointer rounded-md border border-gray-300 bg-white py-2  px-3 text-sm font-medium text-gray-700 shadow-sm transition hover:bg-gray-50 focus:ring-2 focus:ring-orange-500 focus:ring-offset-2"
                >
                  Change
                  <input
                    {...register("photo")}
                    id="picture"
                    type="file"
                    className="hidden"
                    accept="image/*"
                  />
                </label>
              </div>
            </>
          ) : (
            <label className="flex h-80 w-full cursor-pointer items-center justify-center rounded-md border-2 border-dashed border-gray-300 text-gray-600 hover:border-orange-500 hover:text-orange-500">
              <svg
                className="h-12 w-12"
                stroke="currentColor"
                fill="none"
                viewBox="0 0 48 48"
                aria-hidden="true"
              >
                <path
                  d="M28 8H12a4 4 0 00-4 4v20m32-12v8m0 0v8a4 4 0 01-4 4H12a4 4 0 01-4-4v-4m32-4l-3.172-3.172a4 4 0 00-5.656 0L28 28M8 32l9.172-9.172a4 4 0 015.656 0L28 28m0 0l4 4m4-24h8m-4-4v8m-12 4h.02"
                  strokeWidth={2}
                  strokeLinecap="round"
                  strokeLinejoin="round"
                />
              </svg>
              <input
                {...register("photo")}
                accept="image/*"
                className="hidden"
                type="file"
              />
            </label>
          )}
        </div>
        <div>
          <Dropdown
            type="category"
            value={catId}
            isProduct={true}
            spaceholder="카테고리"
            selectRef={selectRef}
            handleChangeSelect={(e) => setValue("catId", e.target.value)}
          />
        </div>
        {errors.catId && <Error>{errors.catId?.message}</Error>}
        <Input
          register={register("name", { required: "상품명을 입력해 주세요." })}
          required
          label="Product name"
          name="product"
          type="text"
        />
        {errors.name && <Error>{errors.name?.message}</Error>}
        <Input
          register={register("price", { required: "가격을 입력해 주세요." })}
          required
          label="Price"
          name="price"
          type="text"
          kind="price"
          onChange={inNumber}
        />
        {errors.price && <Error>{errors.price?.message}</Error>}
        <TextArea
          register={register("description", {
            required: "상품 설명을 입력해 주세요.",
            minLength: { value: 5, message: "5글자 이상 입력해 주세요." },
          })}
          name="description"
          label="Description"
          required
        />
        {errors.description && <Error>{errors.description?.message}</Error>}
        <Button text={loading ? "Loading..." : "Edit item"} />
      </form>
    </Layout>
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

    const product = await client.product.findUnique({
      where: { id: parseInt(id as string) },
    });

    // 상품 없거나 관리자 또는 상품 게시자가 아닌 경우
    if (
      !product ||
      (product?.userId !== context.req?.session.user?.id &&
        !context.req?.session.user?.manager)
    ) {
      return {
        notFound: true,
      };
    }
    return {
      props: {
        product: JSON.parse(JSON.stringify(product)),
      },
    };
  }
);

export default EditProduct;
