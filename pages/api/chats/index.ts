import client from "@libs/server/client";
import { NextApiRequest, NextApiResponse } from "next";
import withHandler, { ResponseType } from "@libs/server/withHandler";
import { withApiSession } from "@libs/server/withSession";
import Ably from "ably/promises";

async function handler(
  req: NextApiRequest,
  res: NextApiResponse<ResponseType>
) {
  if (req.method === "POST") {
    const {
      session: { user },
      body: { userId, productId },
    } = req;

    if (!userId || !productId) return res.status(400).json({ ok: false });

    const room = await client.room.findMany({
      select: {
        id: true,
      },
      where: {
        join: {
          some: {
            userId,
          },
        },
        product: {
          id: productId,
        },
      },
    });
    const myRoom = await client.room.findMany({
      select: {
        id: true,
      },
      where: {
        join: {
          some: {
            userId: user?.id,
          },
        },
        product: {
          id: productId,
        },
      },
    });
    const id = myRoom?.find((data) => room?.find((id) => data.id === id.id));

    if (!id) {
      const createRoom = await client.room.create({
        data: {
          join: {
            createMany: {
              data: [{ userId }, { userId: user?.id }],
            },
          },
          product: {
            connect: {
              id: productId,
            },
          },
        },
        select: {
          id: true,
        },
      });
      if (createRoom) res.json({ ok: true, ...createRoom });
      else res.status(500).json({ ok: false });
    } else {
      res.json({ ok: true, ...id });
    }
  }
  if (req.method === "GET") {
    const {
      session: { user },
    } = req;
    const ably = new Ably.Realtime(process.env.CHAT_API!);

    const roomList = await client.room.findMany({
      select: {
        id: true,
        join: {
          select: {
            user: {
              select: {
                id: true,
                name: true,
                avatar: true,
              },
            },
          },
          where: {
            NOT: { userId: user?.id },
          },
        },
      },
      where: {
        join: {
          some: {
            userId: user?.id,
          },
        },
      },
    });
    if (roomList) {
      const last = await Promise.all(
        roomList.map(async (list) => {
          const channel = ably.channels.get("persisted:" + list.id);
          const data = (await channel.history({ limit: 1 })).items?.[0]?.data;
          channel.unsubscribe();
          return data;
        })
      );
      ably.close();
      roomList.forEach((data: any, i) => {
        data.lastMessage = last[i];
      });
      res.json({ ok: true, roomList });
    } else {
      ably.close();
      res.status(500).json({ ok: false });
    }
  }
}

export default withApiSession(
  withHandler({
    methods: ["GET", "POST"],
    handler,
  })
);
