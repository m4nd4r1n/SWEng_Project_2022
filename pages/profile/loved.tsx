import type { NextPage } from "next";
import Layout from "@components/layout";
import ProductList from "@components/product-list";

const Loved: NextPage = () => {
  return (
    <Layout title="관심목록" canGoBack seoTitle="Watchlist">
      <div className="flex flex-col space-y-5 divide-y  pb-10">
        <ProductList kind="favs" />
      </div>
    </Layout>
  );
};

export default Loved;
