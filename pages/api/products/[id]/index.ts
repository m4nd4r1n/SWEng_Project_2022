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
  if (req?.method === "GET") {
    const product = await client.product.findUnique({
      where: {
        id: +id.toString(),
      },
      include: {
        user: {
          select: {
            id: true,
            name: true,
            avatar: true,
          },
        },
        address: {
          select: {
            sido: true,
            sigungu: true,
          },
        },
        category: {
          select: {
            name: true,
          },
        },
      },
    });
    const terms = product?.name.split(" ").map((word) => ({
      name: {
        contains: word,
      },
    }));
    const relatedProducts = await client.product.findMany({
      where: {
        OR: terms,
        AND: {
          id: {
            not: product?.id,
          },
        },
      },
    });
    const isLiked = Boolean(
      await client.fav.findFirst({
        where: {
          productId: product?.id,
          userId: user?.id,
        },
        select: {
          id: true,
        },
      })
    );

    if (user?.id && product?.categoryId) {
      if (
        await client.view.findFirst({
          where: { userId: user.id, categoryId: product.categoryId },
        })
      ) {
        // 해당 카테고리 조회정보가 존재하면 +! 증가
        await client.view.updateMany({
          where: { userId: user.id, categoryId: product.categoryId },
          data: {
            viewCount: {
              increment: 1,
            },
          },
        });
      } else {
        // 해당 카테고리 조회정보가 없으면 생성
        await client.view.create({
          data: {
            userId: user.id,
            categoryId: product.categoryId,
          },
        });
      }

      res.json({ ok: true, product, isLiked, relatedProducts });
    }
  }
  if (req.method === "POST") {
    const {
      query: { id },
      body: {
        name,
        price,
        description,
        photoId,
        addressId,
        sido,
        sigungu,
        categoryId,
      },
      session: { user },
    } = req;
    const currentProduct = await client.product.findUnique({
      where: { id: +id.toString() },
    });
    if (currentProduct?.userId !== user?.id && !user?.manager) {
      return res.status(403).json({ ok: false, error: "No permission" });
    }

    if (name) {
      await client.product.update({
        where: {
          id: +id.toString(),
        },
        data: { name },
      });
    }
    if (price) {
      await client.product.update({
        where: {
          id: +id.toString(),
        },
        data: { price },
      });
    }
    if (description) {
      await client.product.update({
        where: {
          id: +id.toString(),
        },
        data: { description },
      });
    }
    if (photoId) {
      await client.product.update({
        where: {
          id: +id.toString(),
        },
        data: { image: photoId },
      });
    }
    if (addressId) {
      await client.product.update({
        where: {
          id: +id.toString(),
        },
        data: {
          address: {
            connectOrCreate: {
              create: {
                id: addressId,
                sido,
                sigungu,
              },
              where: {
                id: addressId,
              },
            },
          },
        },
      });
    }
    if (categoryId) {
      await client.product.update({
        where: {
          id: +id.toString(),
        },
        data: { categoryId },
      });
    }
    res.json({
      ok: true,
    });
  }
  if (req?.method === "DELETE") {
    const product = await client.product.findUnique({
      where: {
        id: +id.toString(),
      },
    });

    // 관리자, 상품 등록자만 삭제 가능
    if (user?.manager || user?.id === product?.userId) {
      await client.product.delete({
        where: {
          id: +id.toString(),
        },
      });
      res.json({ ok: true });
    } else {
      return res.status(403).json({ ok: false, error: "No permission" });
    }
  }
}

export default withApiSession(
  withHandler({ methods: ["GET", "POST", "DELETE"], handler })
);
