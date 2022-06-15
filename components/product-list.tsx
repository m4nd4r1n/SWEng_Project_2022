import { ProductWithCountAndAddress } from "pages";
import useSWR from "swr";
import Item from "./item";

interface ProductListProps {
  kind: "favs" | "sales" | "purchases" | "onsale";
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
    kind !== "onsale" ? (
      <>
        {data[kind]?.map((record) => (
          <Item
            id={record.product.id}
            key={record.id}
            title={record.product.name}
            price={record.product.price}
            categoryId={record.product.categoryId}
            address={
              record.product.address?.sido +
              " " +
              record.product.address?.sigungu
            }
            hearts={record.product._count.favs}
            image={record.product.image}
            onSale={record.product.onSale}
          />
        ))}
      </>
    ) : (
      <>
        {data[kind]?.map((product: any) => (
          <Item
            id={product.id}
            key={product.id}
            title={product.name}
            price={product.price}
            categoryId={product.categoryId}
            address={product.address?.sido + " " + product.address?.sigungu}
            hearts={product._count.favs}
            image={product.image}
            onSale={product.onSale}
          />
        ))}
      </>
    )
  ) : null;
}
