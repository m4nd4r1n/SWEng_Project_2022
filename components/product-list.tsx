import { ProductWithCountAndAddress } from "pages";
import useSWR from "swr";
import Item from "./item";

interface ProductListProps {
  kind: "favs" | "sales" | "purchases";
}

interface Record {
  id: number;
  product: ProductWithCountAndAddress;
}

interface ProductListResponse {
  [key: string]: Record[];
}

export default function ProductList({ kind }: ProductListProps) {
  const { data } = useSWR<ProductListResponse>(`/api/users/me/${kind}`);
  return data ? (
    <>
      {data[kind]?.map((record) => (
        <Item
          id={record.product.id}
          key={record.id}
          title={record.product.name}
          price={record.product.price}
          categoryId={record.product.categoryId}
          address={
            record.product.address.sido + " " + record.product.address.sigungu
          }
          hearts={record.product._count.favs}
          image={record.product.image}
        />
      ))}
    </>
  ) : null;
}
