import type { NextPage } from "next";
import Button from "@components/button";
import Layout from "@components/layout";
import TextArea from "@components/textarea";
import { Post } from "@prisma/client";
import { useRouter } from "next/router";
import { useForm } from "react-hook-form";
import useMutation from "@libs/client/useMutation";
import { useEffect } from "react";
import useCoords from "@libs/client/useCoords";
import Error from "@components/error";

interface WriteForm {
  question: string;
}

interface WriteResponse {
  ok: boolean;
  post: Post;
}

const Write: NextPage = () => {
  const { latitude, longitude } = useCoords();
  const router = useRouter();
  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm<WriteForm>({ mode: "onChange" });
  const [post, { loading, data }] = useMutation<WriteResponse>("/api/posts");
  const onValid = (data: WriteForm) => {
    if (loading) return;
    post({ ...data, latitude, longitude });
  };
  useEffect(() => {
    if (data && data.ok) {
      router.replace(`/community/${data.post.id}`);
    }
  }, [data, router]);
  return (
    <Layout canGoBack title="Write Post" seoTitle="Post Write">
      <form onSubmit={handleSubmit(onValid)} className="space-y-4 p-4">
        <TextArea
          register={register("question", {
            required: true,
            minLength: { message: "5글자 이상 입력해 주세요.", value: 5 },
          })}
          required
          placeholder="Ask a question!"
        />
        {errors.question && <Error>{errors.question.message}</Error>}
        <Button text={loading ? "Loading..." : "Submit"} />
      </form>
    </Layout>
  );
};

export default Write;
