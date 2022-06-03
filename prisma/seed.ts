import { PrismaClient } from "@prisma/client";
import {
  categories,
  products,
  address,
  reviews,
  reports,
  users,
  login,
} from "./data";

const prisma = new PrismaClient();

async function main() {
  await prisma.address.deleteMany();
  console.log("Deleted records in address table");

  await prisma.category.deleteMany();
  console.log("Deleted records in category table");

  await prisma.product.deleteMany();
  console.log("Deleted records in product table");

  await prisma.review.deleteMany();
  console.log("Deleted records in review table");

  await prisma.report.deleteMany();
  console.log("Deleted records in report table");

  await prisma.$queryRaw`ALTER TABLE Product AUTO_INCREMENT = 1`;
  console.log("reset product auto increment to 1");

  await prisma.$queryRaw`ALTER TABLE Review AUTO_INCREMENT = 1`;
  console.log("reset review auto increment to 1");

  await prisma.$queryRaw`ALTER TABLE Report AUTO_INCREMENT = 1`;
  console.log("reset report auto increment to 1");

  await prisma.address.create({ data: address });
  console.log("Added address data");

  // await prisma.user.createMany({
  //   data: users,
  // });
  // console.log("Added user data");

  // await prisma.login.createMany({
  //   data: login,
  // });
  // console.log("Added login data");

  await prisma.category.createMany({
    data: categories,
  });
  console.log("Added category data");

  await prisma.product.createMany({
    data: products,
  });
  console.log("Added product data");

  await prisma.review.createMany({
    data: reviews,
  });
  console.log("Added review data");

  await prisma.report.createMany({
    data: reports,
  });
  console.log("Added report data");
}

main()
  .catch((e) => console.log(e))
  .finally(() => prisma.$disconnect());
