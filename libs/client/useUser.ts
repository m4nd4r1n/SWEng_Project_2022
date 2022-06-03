import { Login, User, Manager } from "@prisma/client";
import { useRouter } from "next/router";
import { useEffect } from "react";
import useSWR from "swr";

type Merge<A, B> = {
  [K in keyof A]: K extends keyof B ? B[K] : A[K];
} & B;

interface Profile extends Merge<User, { login: Login; manager: Manager }> {}
interface ProfileResponse {
  ok: boolean;
  profile: Profile;
}

export default function useUser() {
  const { data, error } = useSWR<ProfileResponse>("/api/users/me");
  const router = useRouter();
  useEffect(() => {
    if (data && !data.ok) {
      router.replace("/enter");
    }
  }, [router, data]);
  return { user: data?.profile, isLoading: !data && !error };
}
