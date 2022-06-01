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
    body: { opponentId },
  } = req;

  if (!id || !opponentId) return res.status(400).json({ ok: false });

  const price = await client.product.findUnique({
    select: {
      price: true,
      userId: true,
      onSale: true,
    },
    where: {
      id: +id,
    },
  });

  if (!price?.onSale) return res.status(400).json({ ok: false });

  const prevMyBalance = await client.wallet.findUnique({
    where: {
      userId: user?.id,
    },
    select: {
      currency: true,
    },
  });
  const prevOpponentBalance = await client.wallet.findUnique({
    where: {
      userId: opponentId,
    },
    select: {
      currency: true,
    },
  });
  if (prevOpponentBalance?.currency! < price?.price!) {
    return res
      .status(400)
      .json({ ok: false, message: "상대방의 잔고가 부족합니다." });
  }
  await client.wallet.update({
    data: {
      currency: prevMyBalance?.currency! + price?.price!,
    },
    where: {
      userId: user?.id,
    },
  });
  await client.wallet.update({
    data: {
      currency: prevMyBalance?.currency! - price?.price!,
    },
    where: {
      userId: opponentId,
    },
  });
  await client.product.update({
    data: {
      onSale: false,
    },
    where: {
      id: +id,
    },
  });

  res.json({ ok: true });
}

export default withApiSession(withHandler({ methods: ["POST"], handler }));
