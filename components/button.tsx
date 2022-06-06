import React from "react";
import { cls } from "../libs/client/utils";

interface ButtonProps {
  large?: boolean;
  text: string;
  disabled?: boolean;
  [key: string]: any;
}

export default function Button({
  large = false,
  onClick,
  text,
  disabled = false,
  ...rest
}: ButtonProps) {
  return (
    <button
      {...rest}
      className={cls(
        "w-full rounded-md border border-transparent px-4 font-medium text-white shadow-sm  transition focus:outline-none focus:ring-2 focus:ring-orange-500 focus:ring-offset-2",
        large ? "py-3 text-base" : "py-2 text-sm ",
        disabled ? "bg-gray-300" : "bg-orange-500 hover:bg-orange-600"
      )}
      onClick={onClick}
      disabled={disabled}
    >
      {text}
    </button>
  );
}
