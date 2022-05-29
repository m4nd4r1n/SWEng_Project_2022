import { PrismaClient } from "@prisma/client";
import { categories, products, address } from "./data";

const prisma = new PrismaClient();

async function main() {
  await prisma.address.deleteMany();
  console.log("Deleted records in address table");

  await prisma.category.deleteMany();
  console.log("Deleted records in category table");

  await prisma.product.deleteMany();
  console.log("Deleted records in product table");

  await prisma.$queryRaw`ALTER TABLE Product AUTO_INCREMENT = 1`;
  console.log("reset product auto increment to 1");

  await prisma.address.create({ data: address });
  console.log("Added address data");

  await prisma.category.createMany({
    data: categories,
  });
  console.log("Added category data");

  await prisma.product.createMany({
    data: products,
  });
  console.log("Added product data");
}

main()
  .catch((e) => console.log(e))
  .finally(() => prisma.$disconnect());
