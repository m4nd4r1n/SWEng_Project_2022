export const categories = [
  {
    name: "생활/건강",
    id: 10000,
  },
  {
    name: "식품",
    id: 20000,
  },
  {
    name: "디지털/가전",
    id: 30000,
  },
  {
    name: "출산/육아",
    id: 40000,
  },
  {
    name: "스포츠/레저",
    id: 50000,
  },
  {
    name: "패션잡화",
    id: 60001,
  },
  {
    name: "패션의류",
    id: 60002,
  },
  {
    name: "가구/인테리어",
    id: 70000,
  },
  {
    name: "도서",
    id: 80000,
  },
  {
    name: "화장품/미용",
    id: 60003,
  },
  {
    name: "여가/생활편의",
    id: 90000,
  },
];

export const address = {
  id: 41135,
  sido: "경기",
  sigungu: "성남시 분당구",
};

export const products = categories
  .map((category) => {
    let products: {
      userId: number;
      image: string;
      name: string;
      price: number;
      description: string;
      categoryId: number;
      addressId: number;
    }[] = [];

    for (let i = 0; i < 10; i++) {
      products = [
        ...products,
        {
          userId: 1,
          image: "",
          name: `${category.name}상품${i}`,
          price: +((Math.random() + 0.1) * 10).toFixed(0) * 10000,
          description: `${i}번째 ${category.name} 상품`,
          categoryId: category.id,
          addressId: 41137,
        },
      ];
    }

    return products;
  })
  .reduce((prev, curr) => [...prev, ...curr]);
