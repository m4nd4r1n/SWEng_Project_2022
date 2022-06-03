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

  // manager 권한 있어야 접근 허용
  if (user?.manager) {
    const users = await client.user.findMany({
      include: {
        manager: true,
      },
    });
    res.json({
      ok: true,
      users,
    });
  } else {
    res.json({
      ok: false,
    });
  }
}

export default withApiSession(withHandler({ methods: ["GET"], handler }));
