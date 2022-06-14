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
  if (req.method === "GET") {
    const streamInfo = await client.stream.findUnique({
      where: {
        id: +id.toString(),
      },
      include: {
        messages: {
          select: {
            id: true,
            message: true,
            user: {
              select: {
                avatar: true,
                id: true,
              },
            },
          },
        },
      },
    });
    const { videoUID, live } = await (
      await fetch(
        `https://videodelivery.net/${streamInfo?.cloudflareId}/lifecycle`
      )
    ).json();

    if (!live) {
      const { result } = await (
        await fetch(
          `https://api.cloudflare.com/client/v4/accounts/${process.env.CF_ID}/stream/live_inputs/${streamInfo?.cloudflareId}/videos`,
          {
            headers: {
              Authorization: `Bearer ${process.env.CF_STREAM_TOKEN}`,
            },
          }
        )
      ).json();
      if (result.length !== 0) {
        const { thumbnail, preview } = result[0];
        const stream = { ...streamInfo, videoUID, live, thumbnail, preview };
        const isOwner = stream?.userId === user?.id;
        if (stream && !isOwner) {
          stream.cloudflareKey = "";
          stream.cloudflareUrl = "";
        }
        return res.json({ ok: true, stream });
      }
    }
    const stream = { ...streamInfo, videoUID, live };
    const isOwner = stream?.userId === user?.id;
    if (stream && !isOwner) {
      stream.cloudflareKey = "";
      stream.cloudflareUrl = "";
    }
    return res.json({ ok: true, stream });
  }
  if (req.method === "DELETE") {
    const deleteStream = await client.stream.delete({
      where: {
        id: +id,
      },
    });
    if (deleteStream) {
      res.json({ ok: true });
    } else {
      res.status(500).json({ ok: false });
    }
  }
}

export default withApiSession(
  withHandler({
    methods: ["GET", "DELETE"],
    handler,
  })
);
