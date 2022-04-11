import type { NextPage } from "next";
import { useEffect } from "react";
import { useForm } from "react-hook-form";
import Button from "@components/button";
import Input from "@components/input";
import useMutation from "@libs/client/useMutation";
import { useRouter } from "next/router";
import Link from "next/link";

interface EnterForm {
  email: string;
  password: string;
}

interface MutationResult {
  ok: boolean;
}

const Enter: NextPage = () => {
  const [enter, { loading, data, error }] =
    useMutation<MutationResult>("/api/users/enter");
  const { register, handleSubmit, reset } = useForm<EnterForm>();

  const onValid = (validForm: EnterForm) => {
    if (loading) return;
    enter(validForm);
  };

  const router = useRouter();
  useEffect(() => {
    if (data?.ok) {
      router.push("/");
    }
  }, [data, router]);
  return (
    <div className="mx-auto w-full max-w-xl">
      <div className="mt-16 px-4">
        <h3 className="text-center text-3xl font-bold">Enter to Carrot</h3>
        <div className="mt-12">
          <form
            onSubmit={handleSubmit(onValid)}
            className="mt-8 mb-8 flex flex-col space-y-4"
          >
            <Input
              register={register("email", { required: true })}
              name="email"
              label="Email address"
              type="email"
              required
            />
            <Input
              register={register("password", { required: true })}
              name="password"
              label="Password"
              type="password"
              required
            />
            <Button text={loading ? "Loading" : "Login"} />
          </form>
          <div className="mb-4 flex">
            <Link href="/register">
              <a className="ml-auto mr-2 text-right text-sm text-gray-500 underline underline-offset-2">
                회원가입
              </a>
            </Link>
          </div>
        </div>
      </div>
    </div>
  );
};
export default Enter;
