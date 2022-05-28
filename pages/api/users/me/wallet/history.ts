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

  const history = await client.walletChargeHistory.findMany({
    select: {
      amounts: true,
      createdAt: true,
    },
    orderBy: {
      createdAt: "desc",
    },
    where: {
      wallet: {
        user: {
          id: user?.id,
        },
      },
    },
  });
  if (history) {
    res.json({ ok: true, history });
  } else {
    res.status(500).json({ ok: false });
  }
}

export default withApiSession(
  withHandler({
    methods: ["GET"],
    handler,
  })
);
