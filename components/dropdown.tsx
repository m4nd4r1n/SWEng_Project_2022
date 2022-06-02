import { cls } from "@libs/client/utils";
import React, { useMemo } from "react";

interface DropdownProps {
  type: string;
  isProduct?: boolean;
  spaceholder?: string;
  selectRef?: React.RefObject<HTMLSelectElement>;
  handleChangeSelect?: (event: React.ChangeEvent<HTMLSelectElement>) => void;
}

export default function Dropdown({
  type,
  isProduct = false,
  spaceholder,
  selectRef,
  handleChangeSelect,
}: DropdownProps) {
  const categories = useMemo(
    () => [
      {
        name: "생활/건강",
        value: "10000",
      },
      {
        name: "식품",
        value: "20000",
      },
      {
        name: "디지털/가전",
        value: "30000",
      },
      {
        name: "출산/육아",
        value: "40000",
      },
      {
        name: "스포츠/레저",
        value: "50000",
      },
      {
        name: "패션잡화",
        value: "60001",
      },
      {
        name: "패션의류",
        value: "60002",
      },
      {
        name: "가구/인테리어",
        value: "70000",
      },
      {
        name: "도서",
        value: "80000",
      },
      {
        name: "화장품/미용",
        value: "60003",
      },
      {
        name: "여가/생활편의",
        value: "90000",
      },
    ],
    []
  );

  const options = useMemo(
    () => [
      {
        name: "낮은 가격순",
        value: "price_asc",
      },
      {
        name: "높은 가격순",
        value: "price_dsc",
      },
      {
        name: "좋아요순",
        value: "fav",
      },
      {
        name: "등록일순",
        value: "date",
      },
    ],
    []
  );
  return (
    <>
      {isProduct && (
        <label className="mb-1 block text-sm font-medium text-gray-700">
          {spaceholder}
        </label>
      )}
      <select
        id="dropdownDefault"
        className={cls(
          "rounded-lg border border-solid border-gray-300 bg-white px-4 py-2.5 text-base font-medium text-gray-700 transition ease-in-out hover:border-orange-400 focus:border-orange-400 focus:bg-white focus:text-gray-700 focus:outline-none focus:ring-2 focus:ring-orange-200",
          isProduct ? "w-full shadow" : "mx-5 w-1/2"
        )}
        onChange={handleChangeSelect}
        ref={selectRef}
      >
        <option className="bg-orange-100 font-semibold" value="">
          {spaceholder}
        </option>
        {type === "option" &&
          options.map((item, index) => (
            <option key={index} value={item.value}>
              {item?.name}
            </option>
          ))}
        {type === "category" &&
          categories.map((item, index) => (
            <option key={index} value={item.value}>
              {item?.name}
            </option>
          ))}
      </select>
    </>
  );
}
