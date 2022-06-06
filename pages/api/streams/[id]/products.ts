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
  } = req;
  const streamUser = await client.stream.findUnique({
    where: {
      id: +id.toString(),
    },
    select: {
      user: {
        select: {
          id: true,
        },
      },
    },
  });

  const productList = await client.product.findMany({
    where: {
      userId: streamUser?.user.id,
    },
  });

  return res.json({ ok: true, productList });
}

export default withApiSession(
  withHandler({
    methods: ["GET"],
    handler,
  })
);
