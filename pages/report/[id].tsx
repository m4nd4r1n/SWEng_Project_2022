import type { NextPage } from "next";
import { useRouter } from "next/router";
import useMutation from "@libs/client/useMutation";
import Button from "@components/button";
import Input from "@components/input";
import Layout from "@components/layout";
import TextArea from "@components/textarea";
import { Report } from "@prisma/client";
import { useForm } from "react-hook-form";
import { useEffect, useRef, useState } from "react";
import { totalmem } from "os";

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
  const userId = parseInt(router.query.id as string);
  const { register, handleSubmit } = useForm<UploadReportForm>();
  const [uploadReport, { loading, data }] =
    useMutation<UploadReportMutation>("/api/reports");

  const onValid = async ({
   title,
   description 
  }: UploadReportForm) => {
    if (loading) return;
    console.log("User_id: " + userId);
    uploadReport({
      title,
      description,
      userId,
    });
  };

  useEffect(() => {
    if (data?.ok) {
      router.replace(`/users/profiles/${userId}`);
    }
  });

  return (
    <Layout canGoBack title="Report User" seoTitle="Report User">
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

export default WriteReport;
