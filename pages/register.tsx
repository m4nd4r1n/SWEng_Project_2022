import type { NextPage } from "next";
import { useEffect } from "react";
import { useForm } from "react-hook-form";
import Button from "@components/button";
import Input from "@components/input";
import useMutation from "@libs/client/useMutation";
import { useRouter } from "next/router";
import Link from "next/link";
import { inNumber } from "@libs/client/utils";
import { isEmail } from "@libs/client/utils";
import Error from "@components/error";

interface EnterForm {
  email: string;
  password: string;
  passwordConfirm: string;
  phoneFirst: string;
  phoneMiddle: string;
  phoneLast: string;
  name: string;
}

interface MutationResult {
  ok: boolean;
  error?: string;
}

const Register: NextPage = () => {
  const [reg, { loading, data }] = useMutation<MutationResult>(
    "/api/users/register"
  );
  const {
    register,
    handleSubmit,
    getValues,
    formState: { errors },
  } = useForm<EnterForm>({
    mode: "onChange",
  });

  const onValid = (validForm: EnterForm) => {
    if (loading) return;
    const { phoneFirst, phoneMiddle, phoneLast } = validForm;
    const data = {
      ...validForm,
      phone: phoneFirst + phoneMiddle + phoneLast,
    };
    reg(data);
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
        <h3 className="text-center text-3xl font-bold">Register to Carrot</h3>
        <div className="mt-12">
          <form
            onSubmit={handleSubmit(onValid)}
            className="mt-8 mb-8 flex flex-col space-y-4"
          >
            <Input
              register={register("email", {
                required: "E-mail을 입력해 주세요.",
                minLength: { message: "5글자 이상 입력해 주세요.", value: 5 },
                maxLength: 30,
                validate: { isEmail },
              })}
              name="email"
              label="E-mail"
              type="email"
              minLength={5}
              maxLength={30}
              required
            />
            {errors.email && <Error>{errors.email?.message}</Error>}
            <Input
              register={register("password", {
                required: "비밀번호를 입력해 주세요",
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
            <Input
              register={register("passwordConfirm", {
                required: "비밀번호를 한 번 더 입력해 주세요",
                minLength: { message: "5글자 이상 입력해 주세요.", value: 5 },
                maxLength: 20,
                validate: {
                  matchPreviousPassword: (value) => {
                    const { password } = getValues();
                    return (
                      password === value || "비밀번호가 일치하지 않습니다."
                    );
                  },
                },
              })}
              name="passwordConfirm"
              label="Password confirm"
              type="password"
              minLength={5}
              maxLength={20}
              required
            />
            {errors.passwordConfirm && (
              <Error>{errors.passwordConfirm?.message}</Error>
            )}
            <Input
              register={register("name", {
                required: "이름을 입력해 주세요.",
                minLength: { message: "2글자 이상 입력해 주세요.", value: 2 },
                maxLength: 15,
              })}
              name="name"
              label="Name"
              type="name"
              minLength={2}
              maxLength={15}
              required
            />
            {errors.name && <Error>{errors.name?.message}</Error>}
            <div className="flex items-center space-x-4">
              <Input
                register={register("phoneFirst", {
                  required: true,
                  minLength: 3,
                  maxLength: 3,
                })}
                name="phoneFirst"
                label="Phone"
                type="text"
                onChange={inNumber}
                minLength={3}
                maxLength={3}
                required
              />
              <Input
                register={register("phoneMiddle", {
                  required: true,
                  minLength: 3,
                  maxLength: 4,
                })}
                name="phoneMiddle"
                label={`\u00A0`}
                type="text"
                onChange={inNumber}
                minLength={3}
                maxLength={4}
                required
              />
              <Input
                register={register("phoneLast", {
                  required: true,
                  minLength: 4,
                  maxLength: 4,
                })}
                name="phoneLast"
                label={`\u00A0`}
                type="text"
                onChange={inNumber}
                minLength={4}
                maxLength={4}
                required
              />
            </div>
            {(errors.phoneFirst || errors.phoneMiddle || errors.phoneLast) && (
              <Error>전화번호를 입력해 주세요.</Error>
            )}
            <Button text={loading ? "Loading..." : "Register"} />
            {!data?.ok && <Error>{data?.error}</Error>}
          </form>
          <div className="mb-8 flex">
            <Link href="/enter">
              <a className="ml-auto mr-2 text-sm text-gray-500 underline underline-offset-2">
                로그인
              </a>
            </Link>
          </div>
        </div>
      </div>
    </div>
  );
};
export default Register;
