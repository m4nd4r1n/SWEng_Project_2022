import { NextApiRequest, NextApiResponse } from "next";
import client from "@libs/server/client";
import withHandler, { ResponseType } from "@libs/server/withHandler";
import { withApiSession } from "@libs/server/withSession";

async function handler(
  req: NextApiRequest,
  res: NextApiResponse<ResponseType>
) {
  const { email, password, name, phone } = req.body;
  console.log(req.body);
  if ([email, password, name, phone].includes("")) {
    return res.status(400).json({ ok: false });
  }

  const foundEmail = await client.login.findUnique({
    where: {
      email,
    },
  });
  if (foundEmail)
    return res.status(409).json({ ok: false, error: "Same Email exists" });

  const foundPhone = await client.user.findUnique({
    select: {
      phone: true,
    },
    where: {
      phone,
    },
  });
  if (foundPhone)
    return res
      .status(409)
      .json({ ok: false, error: "Same phone number exists" });

  const register = await client.user.create({
    data: {
      name,
      phone,
      login: {
        create: {
          email,
          password,
        },
      },
    },
  });
  console.log(register);
  if (register) {
    req.session.user = {
      id: register.id,
    };
    await req.session.save();
    return res.json({ ok: true });
  } else {
    return res.status(500).json({
      ok: false,
    });
  }
}

export default withApiSession(
  withHandler({ methods: ["POST"], handler, isPrivate: false })
);
