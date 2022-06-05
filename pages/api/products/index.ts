import { NextApiRequest, NextApiResponse } from "next";
import withHandler, { ResponseType } from "@libs/server/withHandler";
import client from "@libs/server/client";
import { withApiSession } from "@libs/server/withSession";
import { categories } from "../../../prisma/data";
import { Product } from "@prisma/client";

async function handler(
  req: NextApiRequest,
  res: NextApiResponse<ResponseType>
) {
  if (req.method === "GET") {
    const {
      session: { user },
    } = req;
    const views = await client.view.findMany({
      where: {
        userId: user?.id,
      },
    });
    const products = await client.product.findMany({
      include: {
        _count: {
          select: {
            favs: true,
          },
        },
        address: {
          select: {
            sido: true,
            sigungu: true,
          },
        },
      },
      orderBy: {
        createdAt: "desc",
      },
    });
    if (views.length === 0) {
      return res.json({
        ok: true,
        products,
      });
    }

    // 카테고리별 id, 조회수
    const counts = views.map((view) => ({
      count: view.viewCount,
      id: view.categoryId,
    }));
    // 확률 계산을 위한 분모값
    const sum = counts
      .map((count) => count.count)
      .reduce((prev, curr) => prev + curr);

    // 카테고리별 방문비율
    const probability = categories
      .map((category) => {
        const count = counts.find((count) => count.id === category.id);
        const prob = {
          id: category.id,
          prob: count ? +((count.count / sum) * 10).toFixed(0) + 1 : 1,
        };
        return prob;
      })
      .sort((a, b) => b.prob - a.prob);
    // 카테고리별 상품
    const productsOfCategory = probability.map((p) =>
      products.filter((product) => product.categoryId === p.id)
    );

    let newProducts: (Product & {
      _count: {
        favs: number;
      };
    })[] = [];

    // 카테고리별 상품 수가 0이 될때까지
    while (!productsOfCategory.every((products) => products.length === 0)) {
      // 각 카테고리별로 상품 조회비율로 splice해서 products list 생성
      let subProducts: (Product & {
        _count: {
          favs: number;
        };
      })[] = [];
      for (let j = 0; j < productsOfCategory.length; j++) {
        subProducts = [
          ...subProducts,
          ...productsOfCategory[j].splice(
            0,
            // 비율이 아예 0이면 상품 1개 추가
            probability[j].prob === 0 ? 1 : probability[j].prob
          ),
        ];
      }
      newProducts = [...newProducts, ...subProducts];
    }

    res.json({
      ok: true,
      products: newProducts,
    });
  }
  if (req.method === "POST") {
    const {
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
        category: {
          connect: {
            id: +categoryId,
          },
        },
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
