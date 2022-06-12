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
  const { register, handleSubmit } = useForm<UploadReportForm>();
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
          register={register("title", { required: true })}
          required
          label="제목"
          name="title"
          type="text"
        />
        <TextArea
          register={register("description", { required: true })}
          name="description"
          label="신고사유"
          required
        />
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
