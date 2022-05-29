const categories = [
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

const address = {
  id: 41135,
  sido: "경기",
  sigungu: "성남시 분당구",
};

const products = [
  {
    userId: 1,
    image: "",
    name: "상품1",
    price: 10000,
    description: "생활상품",
    categoryId: 10000,
    addressId: 41135,
  },
  {
    userId: 1,
    image: "",
    name: "상품2",
    price: 10000,
    description: "식품상품",
    categoryId: 20000,
    addressId: 41135,
  },
  {
    userId: 1,
    image: "",
    name: "상품3",
    price: 10000,
    description: "디지털상품",
    categoryId: 30000,
    addressId: 41135,
  },
  {
    userId: 1,
    image: "",
    name: "상품4",
    price: 10000,
    description: "육아상품",
    categoryId: 40000,
    addressId: 41135,
  },
  {
    userId: 1,
    image: "",
    name: "상품5",
    price: 10000,
    description: "스포츠상품",
    categoryId: 50000,
    addressId: 41135,
  },
  {
    userId: 1,
    image: "",
    name: "상품6",
    price: 10000,
    description: "패션잡화상품",
    categoryId: 60001,
    addressId: 41135,
  },
  {
    userId: 1,
    image: "",
    name: "상품7",
    price: 10000,
    description: "패션의류상품",
    categoryId: 60002,
    addressId: 41135,
  },
  {
    userId: 1,
    image: "",
    name: "상품8",
    price: 10000,
    description: "가구상품",
    categoryId: 70000,
    addressId: 41135,
  },
  {
    userId: 1,
    image: "",
    name: "상품9",
    price: 10000,
    description: "도서상품",
    categoryId: 80000,
    addressId: 41135,
  },
  {
    userId: 1,
    image: "",
    name: "상품10",
    price: 10000,
    description: "화장품상품",
    categoryId: 60003,
    addressId: 41135,
  },
  {
    userId: 1,
    image: "",
    name: "상품11",
    price: 10000,
    description: "생활편의상품",
    categoryId: 90000,
    addressId: 41135,
  },
];

module.exports = { categories, products, address };
