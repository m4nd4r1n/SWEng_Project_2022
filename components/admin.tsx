import { Manager } from "@prisma/client";
import Link from "next/link";

export default function Admin({ manager }: any) {
  return (
    manager && (
      <div className="flex justify-around border-b p-4">
        <Link href="/management/users">
          <a className="flex flex-col items-center">
            <div className="flex h-14 w-14 items-center justify-center rounded-full bg-orange-400 text-white">
              <svg
                className="h-6 w-6"
                fill="none"
                stroke="currentColor"
                viewBox="0 0 24 24"
                xmlns="http://www.w3.org/2000/svg"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth="2"
                  d="M12 4.354a4 4 0 110 5.292M15 21H3v-1a6 6 0 0112 0v1zm0 0h6v-1a6 6 0 00-9-5.197M13 7a4 4 0 11-8 0 4 4 0 018 0z"
                ></path>
              </svg>
            </div>
            <span className="mt-2 text-sm font-medium text-gray-700">
              사용자 관리
            </span>
          </a>
        </Link>
        <Link href="/management/reports">
          <a className="flex flex-col items-center">
            <div className="flex h-14 w-14 items-center justify-center rounded-full bg-orange-400 text-white">
              <svg
                className="h-6 w-6"
                fill="none"
                stroke="currentColor"
                viewBox="0 0 24 24"
                xmlns="http://www.w3.org/2000/svg"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth="2"
                  d="M20.618 5.984A11.955 11.955 0 0112 2.944a11.955 11.955 0 01-8.618 3.04A12.02 12.02 0 003 9c0 5.591 3.824 10.29 9 11.622 5.176-1.332 9-6.03 9-11.622 0-1.042-.133-2.052-.382-3.016zM12 9v2m0 4h.01"
                ></path>
              </svg>
            </div>
            <span className="mt-2 text-sm font-medium text-gray-700">
              신고 관리
            </span>
          </a>
        </Link>
      </div>
    )
  );
}
