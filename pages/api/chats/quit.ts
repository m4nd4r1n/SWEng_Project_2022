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
    query: { roomId },
  } = req;

  if (!roomId) return res.status(400).json({ ok: false });

  await client.room.delete({
    where: {
      id: +roomId,
    },
  });

  res.json({ ok: true });
}

export default withApiSession(withHandler({ methods: ["DELETE"], handler }));
