import type { NextPage } from "next";
import Layout from "@components/layout";
import useMutation from "@libs/client/useMutation";
import Input from "@components/input";
import { useForm } from "react-hook-form";
import { inNumber } from "@libs/client/utils";
import { useEffect } from "react";
import { useRouter } from "next/router";
import Button from "@components/button";

interface ChargeForm {
  amounts: string;
}

interface MutationResult {
  ok: boolean;
}

const Wallet: NextPage = () => {
  const router = useRouter();
  const [charge, { loading, data }] = useMutation<MutationResult>(
    "/api/users/me/wallet"
  );
  const { register, handleSubmit, setValue, getValues } = useForm<ChargeForm>();

  const onValid = (validForm: ChargeForm) => {
    if (loading) return;
    charge(validForm);
  };
  useEffect(() => {
    if (data?.ok) {
      router.back();
    }
  }, [data, router]);
  return (
    <Layout title="충전" canGoBack seoTitle="Charge">
      <div className="px-4">
        <form
          className="mt-8 flex flex-col pb-10"
          onSubmit={handleSubmit(onValid)}
        >
          <Input
            required
            label="충전 금액"
            name="amounts"
            register={register("amounts", {
              required: true,
              minLength: 4,
              maxLength: 6,
            })}
            type="text"
            kind="price"
            onChange={inNumber}
            maxLength={6}
            minLength={4}
          />
          <div className="mt-8 flex">
            <button
              className="h-12 w-1/3 rounded-l-lg bg-gray-100 text-gray-500"
              onClick={(e) => {
                e.preventDefault();
                if (+getValues("amounts") < 900000)
                  setValue("amounts", +getValues("amounts") + 100000 + "");
              }}
            >
              +10만원
            </button>
            <button
              className="h-12 w-1/3 bg-gray-100 text-gray-500"
              onClick={(e) => {
                e.preventDefault();
                if (+getValues("amounts") < 950000)
                  setValue("amounts", +getValues("amounts") + 50000 + "");
              }}
            >
              +5만원
            </button>
            <button
              className="h-12 w-1/3 rounded-r-lg bg-gray-100 text-gray-500"
              onClick={(e) => {
                e.preventDefault();
                if (+getValues("amounts") < 990000)
                  setValue("amounts", +getValues("amounts") + 10000 + "");
              }}
            >
              +1만원
            </button>
          </div>

          <div className="py-12" />
          <Button text={loading ? "Loading..." : "충전"} large />
        </form>
      </div>
    </Layout>
  );
};

export default Wallet;
