import { UseFormRegisterReturn } from "react-hook-form";

interface CategoryProps {
  label: string;
  name: string;
  register: UseFormRegisterReturn;
  [key: string]: any;
}

interface CategoryListProps {
  id: number;
  value: string;
}

// 카테고리의 정의는 여기에 함
const categoryList: CategoryListProps[] = [
    {id: 1, value: "생활"},
    {id: 2, value: "전자기기"},
    {id: 3, value: "가전제품"}
];

// category의 id로 category의 이름을 찾는 함수
export function find_category_name(id: number): string {
  categoryList.map(elem => {
    if (elem.id == id) {
      return elem;
    }
  });
  return "";
}

export default function Category ({
  label,
  name,
  register,
  ...rest
}: CategoryProps) {

  return (
    <div>
      {label ? (
        <label
          htmlFor={name}
          className="mb-1 block text-sm font-medium text-gray-700"
        >
          {label}
        </label>
      ) : null}
      <select
        id={name}
        {...register}
        className="mt-1 w-full rounded-md border-gray-300 shadow-sm focus:border-orange-500 focus:ring-orange-500 "
        {...rest}
      >
        {categoryList.map((option) => (
          <option
            key={option.id}
            value={option.id}
            >
              {option.value}
            </option>
        ))}
      </select>
    </div>
  );
}
