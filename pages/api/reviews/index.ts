import { NextApiRequest, NextApiResponse } from "next";
import withHandler, { ResponseType } from "@libs/server/withHandler";
import client from "@libs/server/client";
import { withApiSession } from "@libs/server/withSession";

async function handler(
  req: NextApiRequest,
  res: NextApiResponse<ResponseType>
) {
  if (req.method === "POST") {
    const {
      session: { user },
      body: { review, score, userId, productId },
    } = req;

    const purchase = await client.purchase.findFirst({
      where: {
        productId: +productId,
        userId: user?.id,
      },
      select: {
        id: true,
      },
    });

    const sale = await client.sale.findFirst({
      where: {
        productId: +productId,
        userId: +userId,
      },
      select: {
        id: true,
      },
    });

    const reviews = await client.review.create({
      data: {
        review,
        createdBy: {
          connect: {
            id: user?.id,
          },
        },
        createdFor: {
          connect: {
            id: +userId,
          },
        },
        score: score,
        Purchase: {
          connect: {
            id: purchase?.id,
          },
        },
        Sale: {
          connect: {
            id: sale?.id,
          },
        },
      },
    });
    res.json({ ok: true });
  }
  if (req.method === "GET") {
    const {
      query: { productId },
    } = req;

    const isReviewed = await client.purchase.findFirst({
      where: {
        productId: +productId,
      },
      select: {
        review: true,
      },
    });

    res.json({ ok: true, ...isReviewed });
  }
}

export default withApiSession(
  withHandler({
    methods: ["GET", "POST"],
    handler,
  })
);
