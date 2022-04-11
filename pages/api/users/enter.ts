import { NextApiRequest, NextApiResponse } from "next";
import client from "@libs/server/client";
import withHandler, { ResponseType } from "@libs/server/withHandler";
import { withApiSession } from "@libs/server/withSession";

async function handler(
  req: NextApiRequest,
  res: NextApiResponse<ResponseType>
) {
  const { email, password } = req.body;

  if ([email, password].includes("")) {
    return res.status(400).json({ ok: false });
  }

  const foundLoginInfo = await client.login.findFirst({
    where: {
      email,
      password,
    },
  });

  if (!foundLoginInfo) {
    return res
      .status(401)
      .json({ ok: false, error: "E-mail or password is invalid" });
  } else {
    req.session.user = {
      id: foundLoginInfo.userId,
    };
    await req.session.save();
    return res.json({
      ok: true,
    });
  }
}

export default withApiSession(
  withHandler({ methods: ["POST"], handler, isPrivate: false })
);
