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
    body: { answer },
  } = req;
  if (req.method === "POST") {
    const newAnswer = await client.answer.create({
      data: {
        user: {
          connect: {
            id: user?.id,
          },
        },
        post: {
          connect: {
            id: +id.toString(),
          },
        },
        answer,
      },
    });
    console.log(newAnswer);

    res.json({
      ok: true,
      answer: newAnswer,
    });
  }
  if (req.method === "DELETE") {
    const deleteAnswer = await client.answer.delete({
      where: {
        id: +id,
      },
    });
    if (deleteAnswer) {
      res.json({ ok: true });
    } else {
      res.status(500).json({ ok: false });
    }
  }
}

export default withApiSession(
  withHandler({
    methods: ["POST", "DELETE"],
    handler,
  })
);
