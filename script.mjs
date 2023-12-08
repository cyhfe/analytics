import { PrismaClient } from "@prisma/client";

const prisma = new PrismaClient();

async function main() {
  const website = await prisma.website.create({
    data: {
      domain: "www.icyh.me",
    },
  });

  console.log(website);
}

main()
  .then(async () => {
    await prisma.$disconnect();
  })
  .catch(async (e) => {
    console.error(e);
    await prisma.$disconnect();
    process.exit(1);
  });
