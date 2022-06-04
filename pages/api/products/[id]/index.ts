import { NextApiRequest, NextApiResponse } from "next";
import withHandler, { ResponseType } from "@libs/server/withHandler";
import client from "@libs/server/client";
import { withApiSession } from "@libs/server/withSession";

async function handler(
  req: NextApiRequest,
  res: NextApiResponse<ResponseType>
) {
  const {
    query: { id },
    session: { user },
  } = req;
  if (req?.method === "GET") {
    const product = await client.product.findUnique({
      where: {
        id: +id.toString(),
      },
      include: {
        user: {
          select: {
            id: true,
            name: true,
            avatar: true,
          },
        },
      },
    });
    const terms = product?.name.split(" ").map((word) => ({
      name: {
        contains: word,
      },
    }));
    const relatedProducts = await client.product.findMany({
      where: {
        OR: terms,
        AND: {
          id: {
            not: product?.id,
          },
        },
      },
    });
    const isLiked = Boolean(
      await client.fav.findFirst({
        where: {
          productId: product?.id,
          userId: user?.id,
        },
        select: {
          id: true,
        },
      })
    );
    res.json({ ok: true, product, isLiked, relatedProducts });
  }
  if (req?.method === "DELETE") {
    const product = await client.product.findUnique({
      where: {
        id: +id.toString(),
      },
    });

    // 관리자, 상품 등록자만 삭제 가능
    if (user?.manager || user?.id === product?.userId) {
      await client.product.delete({
        where: {
          id: +id.toString(),
        },
      });
      res.json({ ok: true });
    } else {
      return res.status(403).json({ ok: false });
    }
  }
}

export default withApiSession(
  withHandler({ methods: ["GET", "DELETE"], handler })
);
