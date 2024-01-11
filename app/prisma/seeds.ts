import { PrismaClient } from '@prisma/client';
const prisma = new PrismaClient();
async function main() {
  await Promise.all([
    prisma.cropModel.upsert({
      where: { name: 'Soja' },
      update: {},
      create: {
        name: 'Soja',
      },
    }),
    prisma.cropModel.upsert({
      where: { name: 'Milho' },
      update: {},
      create: {
        name: 'Milho',
      },
    }),
    prisma.cropModel.upsert({
      where: { name: 'Algodão' },
      update: {},
      create: {
        name: 'Algodão',
      },
    }),
    prisma.cropModel.upsert({
      where: { name: 'Cana de Açucar' },
      update: {},
      create: {
        name: 'Cana de Açucar',
      },
    }),
    prisma.cropModel.upsert({
      where: { name: 'Café' },
      update: {},
      create: {
        name: 'Café',
      },
    }),
  ]);
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
