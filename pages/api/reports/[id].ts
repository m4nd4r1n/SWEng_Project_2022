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
  if (user?.manager) {
    if (req.method === "GET") {
      const reports = await client.report.findMany({
        where: {
          userId: +id,
        },
      });
      res.json({ ok: true, reports });
    }
    if (req.method === "DELETE") {
      await client.report.delete({
        where: {
          id: +id,
        },
      });
      res.json({ ok: true });
    }
  } else {
    return res
      .status(403)
      .json({ ok: false, error: "Only managers can access" });
  }
}

export default withApiSession(
  withHandler({
    methods: ["GET", "DELETE"],
    handler,
  })
);
