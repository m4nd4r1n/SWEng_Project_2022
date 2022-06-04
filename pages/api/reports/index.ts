import { NextApiRequest, NextApiResponse } from "next";
import withHandler, { ResponseType } from "@libs/server/withHandler";
import client from "@libs/server/client";
import { withApiSession } from "@libs/server/withSession";

async function handler(
req: NextApiRequest,
res: NextApiResponse<ResponseType>
) {
  
  console.log("Got Request");
  if (req.method === "POST") {
    const {
    body: {
      title,
      description,
      userId,
    },
    } = req;

    const report = await client.report.create({
      data: {
        title: title,
        description: description,
        user: {
          connect: {
            id: userId,
          },
        },
      },
    });
    res.json({
      ok: true,
      report,
    });
  }
  if (req.method === "GET") {
  }
}
  
export default withApiSession(
  withHandler({ methods: ["GET", "POST"], handler })
);
  