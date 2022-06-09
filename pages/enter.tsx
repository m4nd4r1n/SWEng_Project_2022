import type { NextPage } from "next";
import { useEffect } from "react";
import { useForm } from "react-hook-form";
import Button from "@components/button";
import Input from "@components/input";
import useMutation from "@libs/client/useMutation";
import { useRouter } from "next/router";
import Link from "next/link";
import { isEmail } from "@libs/client/utils";
import Error from "@components/error";

interface EnterForm {
  email: string;
  password: string;
}

interface MutationResult {
  ok: boolean;
  error?: string;
}

const Enter: NextPage = () => {
  const [enter, { loading, data }] =
    useMutation<MutationResult>("/api/users/enter");
  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm<EnterForm>({
    mode: "onChange",
    defaultValues: { email: "", password: "" },
  });

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
              register={register("email", {
                required: "E-mail을 입력해 주세요.",
                validate: { isEmail },
                minLength: { message: "5글자 이상 입력해 주세요.", value: 5 },
                maxLength: 30,
              })}
              name="email"
              label="Email address"
              type="email"
              minLength={5}
              maxLength={30}
              required
            />
            {errors.email && <Error>{errors.email?.message}</Error>}
            <Input
              register={register("password", {
                required: "비밀번호를 입력해 주세요.",
                minLength: { message: "5글자 이상 입력해 주세요.", value: 5 },
                maxLength: 20,
              })}
              name="password"
              label="Password"
              type="password"
              minLength={5}
              maxLength={20}
              required
            />
            {errors.password && <Error>{errors.password?.message}</Error>}
            <Button text={loading ? "Loading" : "Login"} />
            {!data?.ok && (
              <span className="flex justify-center text-red-500">
                {data?.error}
              </span>
            )}
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
