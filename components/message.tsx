import { cls } from "@libs/client/utils";
import Image from "next/image";

interface Product {
  id: number;
  name: string;
  price: number;
  description: string;
  userId: number;
  onSale: boolean;
  image?: string;
}

interface MessageProps {
  message: string;
  reversed?: boolean;
  avatarUrl?: string;
  purchase?: boolean;
  onClick?: () => void;
  isSale?: boolean;
  product?: Product;
}

export default function Message({
  message,
  avatarUrl,
  reversed,
  purchase,
  onClick,
  isSale,
  product,
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
          <>
            <div className="mt-2 flex">
              <Image
                src={`https://imagedelivery.net/mBDIPXvPr-qhWpouLgwjOQ/${product?.image}/avatar`}
                className="rounded-lg"
                height={64}
                width={64}
                alt=""
              />
              <div className="ml-2 flex flex-col items-start justify-center space-y-2">
                <span>{product?.name}</span>
                <span>{product?.price}원</span>
              </div>
            </div>
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
          </>
        )}
      </div>
    </div>
  );
}
