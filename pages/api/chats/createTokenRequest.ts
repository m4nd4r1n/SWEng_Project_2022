import Ably from "ably/promises";
import { NextApiRequest, NextApiResponse } from "next";
import withHandler from "@libs/server/withHandler";
import { withApiSession } from "@libs/server/withSession";

async function handler(req: NextApiRequest, res: NextApiResponse) {
  const client = new Ably.Realtime(process.env.CHAT_API!);
  const tokenRequestData = await client.auth.createTokenRequest({
    clientId: "danggeun-nara",
  });

  res.status(200).json(tokenRequestData);
}

export default withApiSession(
  withHandler({
    methods: ["GET"],
    handler,
  })
);
