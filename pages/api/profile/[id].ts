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
  const profile = await client.user.findUnique({
    where: { id: Number(id) },
    include: {
      login: {
        select: {
          email: true,
        },
      },
      products: {
        select: {
          categoryId: true,
          addressId: true,
          onSale: true,
          address: {
            select: {
              id: true,
              sido: true,
              sigungu: true,
            },
          },
        },
        orderBy: {
          categoryId: "asc",
        },
      },
    },
  });
  res.json({
    ok: true,
    profile,
  });
}

export default withApiSession(withHandler({ methods: ["GET"], handler }));
