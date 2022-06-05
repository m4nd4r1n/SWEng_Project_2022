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
          addressId: 41135,
        },
      ];
    }

    return products;
  })
  .reduce((prev, curr) => [...prev, ...curr]);

export const users = [
  { phone: "010-1111-2222", name: "김당근" },
  { phone: "010-2222-3333", name: "박서울" },
  { phone: "010-3333-4444", name: "서부산" },
  { phone: "010-4444-5555", name: "최하늘" },
  { phone: "010-5555-6666", name: "김치" },
  { phone: "010-6666-7777", name: "이파리" },
];

export const login = [
  {
    email: "test1@naver.com",
    password: "password",
    userId: 3,
  },
  {
    email: "test2@naver.com",
    password: "password",
    userId: 4,
  },
  {
    email: "test3@naver.com",
    password: "password",
    userId: 5,
  },
  {
    email: "test4@naver.com",
    password: "password",
    userId: 6,
  },
  {
    email: "test5@naver.com",
    password: "password",
    userId: 7,
  },
  {
    email: "test6@naver.com",
    password: "password",
    userId: 8,
  },
];

export const reviews = [
  {
    review: "친절하고 좋습니다.",
    createdById: 1,
    createdForId: 2,
    score: 5,
  },
  {
    review: "약속장소에서 기다린지 30분 뒤에 오네요",
    createdById: 3,
    createdForId: 2,
    score: 1,
  },
  {
    review: "중고품 치고 상태가 매우 좋아요",
    createdById: 4,
    createdForId: 2,
    score: 5,
  },
  {
    review: "좋아요.",
    createdById: 5,
    createdForId: 2,
    score: 4,
  },
  {
    review: "고작 천원 할인해달라했는데 무시하네요",
    createdById: 6,
    createdForId: 2,
    score: 2,
  },
];

export const reports = [
  {
    userId: 2,
    productId: 13,
    title: "카테고리 오류",
    description: "상품 카테고리 잘못 올라와있어요",
  },
  {
    userId: 2,
    title: "욕설 신고",
  },
];
