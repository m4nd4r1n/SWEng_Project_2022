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
    include: {
      user: {
        include: {
          manager: true,
        },
      },
    },
  });

  if (!foundLoginInfo) {
    return res
      .status(401)
      .json({ ok: false, error: "E-mail or password is invalid" });
  } else if (foundLoginInfo.user.disabled) {
    return res
      .status(401)
      .json({ ok: false, error: "Your account has been suspended" });
  } else {
    req.session.user = {
      id: foundLoginInfo.userId,
      manager: Boolean(foundLoginInfo?.user?.manager),
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
