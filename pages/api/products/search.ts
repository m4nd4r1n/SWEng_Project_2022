import { NextApiRequest, NextApiResponse } from "next";
import withHandler, { ResponseType } from "@libs/server/withHandler";
import client from "@libs/server/client";
import { withApiSession } from "@libs/server/withSession";
import { Prisma } from "@prisma/client";

type Sort = "price_asc" | "price_dsc" | "fav" | "date";

async function handler(
  req: NextApiRequest,
  res: NextApiResponse<ResponseType>
) {
  const {
    query: { sort, catId },
  } = req;

  const sortOptions = {
    price_asc: {
      price: "asc",
    },
    price_dsc: {
      price: "desc",
    },
    fav: {
      favs: {
        _count: "desc",
      },
    },
    date: {
      createdAt: "desc",
    },
  };

  const order:
    | Prisma.Enumerable<Prisma.ProductOrderByWithRelationInput>
    | undefined =
    sort !== ""
      ? [sortOptions[sort as Sort] as Prisma.ProductOrderByWithRelationInput]
      : undefined;

  const products = await client.product.findMany({
    where: {
      // categoryId가 0이면 모든 카테고리 상품 조회
      AND: [
        {
          categoryId: +catId.toString() !== 0 ? +catId.toString() : undefined,
        },
      ],
    },
    orderBy: order,
    include: {
      _count: {
        select: {
          favs: true,
        },
      },
    },
  });
  res.json({
    ok: true,
    products,
  });
}

export default withApiSession(withHandler({ methods: ["GET"], handler }));
