import type { GetServerSideProps, NextPage, NextPageContext } from "next";
import { useRouter } from "next/router";
import useMutation from "@libs/client/useMutation";
import Button from "@components/button";
import Input from "@components/input";
import Layout from "@components/layout";
import TextArea from "@components/textarea";
import { Report } from "@prisma/client";
import { useForm } from "react-hook-form";
import { useEffect } from "react";
import { withSsrSession } from "@libs/server/withSession";
import Error from "@components/error";

interface UploadReportForm {
  title: string;
  description: string;
}

interface UploadReportMutation {
  ok: boolean;
  report: Report;
}

const WriteReport: NextPage = () => {
  const router = useRouter();
  const productId = parseInt(router.query.id as string);
  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm<UploadReportForm>({ mode: "onChange" });
  const [uploadReport, { loading, data }] =
    useMutation<UploadReportMutation>("/api/reports");

  const onValid = async ({ title, description }: UploadReportForm) => {
    if (loading) return;
    console.log("Product_id: " + productId);
    uploadReport({
      title,
      description,
      productId,
    });
  };

  useEffect(() => {
    if (data?.ok) {
      router.replace(`/products/${productId}`);
    }
  });

  return (
    <Layout canGoBack title="Report Product" seoTitle="Report">
      <form className="space-y-4 p-4" onSubmit={handleSubmit(onValid)}>
        <Input
          register={register("title", {
            required: "제목을 입력해 주세요.",
            maxLength: {
              message: "최대 100자까지 입력할 수 있습니다.",
              value: 100,
            },
          })}
          required
          label="제목"
          name="title"
          type="text"
          maxLength={100}
        />
        {errors.title && <Error>{errors.title?.message}</Error>}
        <TextArea
          register={register("description", {
            required: "신고사유를 입력해 주세요.",
          })}
          name="description"
          label="신고사유"
          required
        />
        {errors.description && <Error>{errors.description?.message}</Error>}
        <Button text={loading ? "Loading..." : "Report"} />
      </form>
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

    return {
      props: {},
    };
  }
);

export default WriteReport;
