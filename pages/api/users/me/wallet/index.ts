import { NextApiRequest, NextApiResponse } from "next";
import withHandler, { ResponseType } from "@libs/server/withHandler";
import client from "@libs/server/client";
import { withApiSession } from "@libs/server/withSession";

const createCurrency = async (userId: number) => {
  const create = await client.wallet.create({
    data: {
      currency: 0,
      user: {
        connect: {
          id: userId,
        },
      },
    },
    select: {
      id: true,
      currency: true,
    },
  });
  return create;
};

async function handler(
  req: NextApiRequest,
  res: NextApiResponse<ResponseType>
) {
  const {
    session: { user },
  } = req;

  const currency = await client.wallet.findFirst({
    select: {
      id: true,
      currency: true,
    },
    where: {
      userId: user?.id,
    },
  });
  if (req.method === "GET") {
    if (currency) {
      res.json({
        ok: true,
        ...currency,
      });
    } else {
      const create = await createCurrency(user?.id!);
      res.json({ ok: true, ...create });
    }
  }
  if (req.method === "POST") {
    const {
      body: { amounts },
    } = req;

    if (!currency) {
      const create = await createCurrency(user?.id!);
      const addCurrency = await client.wallet.update({
        data: {
          currency: create.currency + +amounts,
          WalletChargeHistory: {
            create: {
              amounts: +amounts,
            },
          },
        },
        where: {
          id: create.id,
        },
        select: {
          id: true,
          currency: true,
        },
      });
      if (addCurrency) {
        res.json({
          ok: true,
        });
      } else {
        res.status(500).json({ ok: false });
      }
    } else {
      const addCurrency = await client.wallet.update({
        data: {
          currency: currency.currency + +amounts,
          WalletChargeHistory: {
            create: {
              amounts: +amounts,
            },
          },
        },
        where: {
          id: currency.id,
        },
        select: {
          id: true,
          currency: true,
        },
      });
      if (addCurrency) {
        res.json({
          ok: true,
        });
      } else {
        res.status(500).json({ ok: false });
      }
    }
  }
}

export default withApiSession(
  withHandler({
    methods: ["GET", "POST"],
    handler,
  })
);
