import type { NextPage } from "next";
import Button from "@components/button";
import Input from "@components/input";
import Layout from "@components/layout";
import TextArea from "@components/textarea";
import { useForm } from "react-hook-form";
import useMutation from "@libs/client/useMutation";
import { useEffect } from "react";
import { useRouter } from "next/router";
import { Stream } from "@prisma/client";
import { inNumber } from "@libs/client/utils";
import Error from "@components/error";

interface CreateForm {
  live: string;
  price: string;
  description: string;
}

interface CreateResponse {
  ok: boolean;
  stream: Stream;
}

const Create: NextPage = () => {
  const router = useRouter();
  const [createStream, { loading, data }] =
    useMutation<CreateResponse>(`/api/streams`);
  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm<CreateForm>({ mode: "onChange" });
  const onValid = (form: CreateForm) => {
    if (loading) return;
    createStream(form);
  };
  useEffect(() => {
    if (data && data.ok) {
      router.replace(`/streams/${data.stream.id}`);
    }
  }, [data, router]);
  return (
    <Layout canGoBack title="Go Live" seoTitle="Create Stream">
      <form onSubmit={handleSubmit(onValid)} className=" space-y-4 py-10 px-4">
        <Input
          register={register("live", {
            required: "라이브 제목을 입력해 주세요.",
          })}
          required
          label="Live name"
          name="live"
          type="text"
        />
        {errors.live && <Error>{errors.live?.message}</Error>}
        <Input
          register={register("price", {
            required: "가격을 입력해 주세요.",
            valueAsNumber: true,
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
            required: "설명을 입력해 주세요.",
            minLength: { value: 5, message: "5글자 이상 입력해 주세요." },
          })}
          name="description"
          label="Description"
        />
        {errors.description && <Error>{errors.description?.message}</Error>}
        <Button text={loading ? "Loading..." : "Go live"} />
      </form>
    </Layout>
  );
};

export default Create;
