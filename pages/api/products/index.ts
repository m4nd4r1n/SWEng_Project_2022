import { NextApiRequest, NextApiResponse } from "next";
import withHandler, { ResponseType } from "@libs/server/withHandler";
import client from "@libs/server/client";
import { withApiSession } from "@libs/server/withSession";
import { find_category_name } from "components/category";


async function handler(
  req: NextApiRequest,
  res: NextApiResponse<ResponseType>
) {
  if (req.method === "GET") {
    const products = await client.product.findMany({
      include: {
        _count: {
          select: {
            favs: true,
          },
        },
      },
    });
    res.json({
      ok: true,
      products,
    });
  }
  if (req.method === "POST") {
    const {
      body: { category, name, price, description, photoId },
      session: { user },
    } = req;

    // convert category to number type
    let cat = parseInt(category);

    const product = await client.product.create({
      data: {
        name,
        price: +price,
        description,
        image: photoId || "",
        user: {
          connect: {
            id: user?.id,
          },
        },
        category: {
          create:
            {id: cat, name: find_category_name(cat)}
        },
        categoryId: cat,
      },
    });
    res.json({
      ok: true,
      product,
    });
  }
}

export default withApiSession(
  withHandler({ methods: ["GET", "POST"], handler })
);
