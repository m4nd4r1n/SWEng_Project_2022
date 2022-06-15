import { NextApiRequest, NextApiResponse } from "next";
import withHandler, { ResponseType } from "@libs/server/withHandler";
import client from "@libs/server/client";
import { withApiSession } from "@libs/server/withSession";

async function handler(
  req: NextApiRequest,
  res: NextApiResponse<ResponseType>
) {
  const {
    session: { user },
  } = req;

  const onsale = await client.product.findMany({
    where: {
      userId: user?.id,
      onSale: true,
    },
    include: {
      _count: {
        select: {
          favs: true,
        },
      },
      address: {
        select: {
          sido: true,
          sigungu: true,
        },
      },
    },
  });
  res.json({
    ok: true,
    onsale,
  });
}

export default withApiSession(
  withHandler({
    methods: ["GET"],
    handler,
  })
);
