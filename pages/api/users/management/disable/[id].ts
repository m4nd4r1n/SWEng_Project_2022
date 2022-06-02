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
    const exists = Boolean(
      await client.user.findUnique({
        where: {
          id: +id,
        },
      })
    );
    if (exists) {
      await client.user.update({
        where: {
          id: +id,
        },
        data: {
          disabled: true,
        },
      });
      res.json({ ok: true });
    } else {
      res.json({ ok: false });
    }
  } else {
    res.json({ ok: false });
  }
}

export default withApiSession(
  withHandler({
    methods: ["POST"],
    handler,
  })
);
