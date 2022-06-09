import type { NextPage } from "next";
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
import useCoords from "@libs/client/useCoords";
import Error from "@components/error";

interface UploadProductForm {
  name: string;
  price: string;
  description: string;
  photo: FileList;
  catId: string;
}

interface UploadProductMutation {
  ok: boolean;
  product: Product;
}

const Upload: NextPage = () => {
  const router = useRouter();
  const { id: addressId, sido, sigungu } = useAddress();
  const selectRef = useRef<HTMLSelectElement>(null);
  const {
    register,
    handleSubmit,
    watch,
    setValue,
    setError,
    clearErrors,
    formState: { errors },
  } = useForm<UploadProductForm>({
    mode: "onChange",
    defaultValues: { catId: "" },
  });
  const catId = watch("catId");
  const [uploadProduct, { loading, data }] =
    useMutation<UploadProductMutation>("/api/products");
  const { latitude, longitude } = useCoords();
  const onValid = async ({
    name,
    price,
    description,
    photo,
  }: UploadProductForm) => {
    if (loading) return;
    if (photo && photo.length > 0) {
      const { uploadURL } = await (await fetch(`/api/files`)).json();
      const form = new FormData();
      form.append("file", photo[0], name);
      const {
        result: { id },
      } = await (await fetch(uploadURL, { method: "POST", body: form })).json();
      uploadProduct({
        name,
        price,
        description,
        photoId: id,
        addressId,
        sido,
        sigungu,
        categoryId: catId,
        latitude,
        longitude,
      });
    } else {
      uploadProduct({
        name,
        price,
        description,
        addressId,
        sido,
        sigungu,
        categoryId: catId,
        latitude,
        longitude,
      });
    }
  };
  useEffect(() => {
    if (data?.ok) {
      router.replace(`/products/${data.product.id}`);
    }
  }, [data, router]);
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
    <Layout canGoBack title="Upload Product" seoTitle="Product Upload">
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
          register={register("name", {
            required: "상품명을 입력해 주세요.",
          })}
          required
          label="Product name"
          name="product"
          type="text"
        />
        {errors.name && <Error>{errors.name?.message}</Error>}
        <Input
          register={register("price", {
            required: "가격을 입력해 주세요.",
          })}
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
        <Button text={loading ? "Loading..." : "Upload item"} />
      </form>
    </Layout>
  );
};

export default Upload;
