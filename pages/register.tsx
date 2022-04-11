import type { NextPage } from "next";
import { ChangeEvent, useEffect } from "react";
import { useForm } from "react-hook-form";
import Button from "@components/button";
import Input from "@components/input";
import useMutation from "@libs/client/useMutation";
import { useRouter } from "next/router";
import Link from "next/link";

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
}

const Register: NextPage = () => {
  const [reg, { loading, data, error }] = useMutation<MutationResult>(
    "/api/users/register"
  );
  const { register, handleSubmit, getValues } = useForm<EnterForm>();

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
  const inNumber = (e: ChangeEvent<HTMLInputElement>) => {
    e.target.value = e.target.value.replace(/[^0-9]/g, "");
  };
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
                required: true,
                minLength: 5,
                maxLength: 30,
              })}
              name="email"
              label="E-mail"
              type="email"
              minLength={5}
              maxLength={30}
              required
            />
            <Input
              register={register("password", {
                required: true,
                minLength: 5,
                maxLength: 20,
              })}
              name="password"
              label="Password"
              type="password"
              minLength={5}
              maxLength={20}
              required
            />
            <Input
              register={register("passwordConfirm", {
                required: true,
                minLength: 5,
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
            <Input
              register={register("name", {
                required: true,
                minLength: 2,
                maxLength: 15,
              })}
              name="name"
              label="Name"
              type="name"
              minLength={2}
              maxLength={15}
              required
            />
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

            <Button text={loading ? "Loading..." : "Register"} />
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
