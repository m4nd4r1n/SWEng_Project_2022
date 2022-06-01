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
  const reviews = await client.review.findMany({
    where: { createdForId: +id },
    include: {
      createdBy: {
        select: {
          avatar: true,
          name: true,
        },
      },
    },
  });
  res.json({
    ok: true,
    reviews,
  });
}

export default withApiSession(withHandler({ methods: ["GET"], handler }));
