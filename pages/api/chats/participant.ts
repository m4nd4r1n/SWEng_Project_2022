import client from "@libs/server/client";
import { NextApiRequest, NextApiResponse } from "next";
import withHandler, { ResponseType } from "@libs/server/withHandler";
import { withApiSession } from "@libs/server/withSession";

async function handler(
  req: NextApiRequest,
  res: NextApiResponse<ResponseType>
) {
  const {
    session: { user },
    query: { roomId },
  } = req;

  if (!parseInt(roomId as string) && parseInt(roomId as string) !== 0) {
    return res.json({ ok: false, error: "'roomId' is not a number." });
  }

  const isJoined = await client.join.findFirst({
    where: {
      roomId: +roomId,
      userId: user?.id,
    },
  });
  if (!isJoined) {
    return res
      .status(400)
      .json({ ok: false, error: "There is no room joined with that id." });
  }

  const participant = await client.join.findFirst({
    select: {
      user: {
        select: {
          name: true,
          id: true,
          avatar: true,
        },
      },
      room: {
        select: {
          product: {
            select: {
              id: true,
              name: true,
              price: true,
              description: true,
              userId: true,
              onSale: true,
              image: true,
            },
          },
        },
      },
    },
    where: {
      roomId: +roomId,
      NOT: {
        userId: user?.id,
      },
    },
  });

  if (participant) {
    res.json({ ok: true, ...participant });
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
