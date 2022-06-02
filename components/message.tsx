import { cls } from "@libs/client/utils";
import Image from "next/image";

interface MessageProps {
  message: string;
  reversed?: boolean;
  avatarUrl?: string;
  purchase?: boolean;
  onClick?: () => void;
  isSale?: boolean;
}

export default function Message({
  message,
  avatarUrl,
  reversed,
  purchase,
  onClick,
  isSale,
}: MessageProps) {
  return (
    <div
      className={cls(
        "flex items-start space-x-2",
        reversed ? "flex-row-reverse space-x-reverse" : ""
      )}
    >
      {avatarUrl ? (
        <Image
          src={`https://imagedelivery.net/mBDIPXvPr-qhWpouLgwjOQ/${avatarUrl}/avatar`}
          className="h-8 w-8 rounded-full bg-slate-300"
          alt=""
          height={32}
          width={32}
        />
      ) : (
        <div className="h-8 w-8 rounded-full bg-slate-400" />
      )}
      <div className="flex w-1/2 flex-col rounded-md border border-gray-300 p-2 text-sm text-gray-700">
        <span className="break-all">{message}</span>
        {purchase && (
          <button
            onClick={onClick}
            className={cls(
              "mt-2 h-8 rounded",
              reversed ? "bg-gray-200" : "bg-orange-400 text-white",
              !isSale ? "bg-gray-200" : ""
            )}
            disabled={reversed || !isSale}
          >
            {reversed ? "요청 보냄" : isSale ? "판매하기" : "판매완료"}
          </button>
        )}
      </div>
    </div>
  );
}
