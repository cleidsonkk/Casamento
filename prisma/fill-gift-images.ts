import { PrismaClient } from "@prisma/client";
import { getStableGiftImageUrl, hasWeakGiftImage } from "../lib/gift-image";

const prisma = new PrismaClient();

async function main() {
  const items = await prisma.giftCatalogItem.findMany();
  let updated = 0;

  for (const item of items) {
    if (!hasWeakGiftImage(item.imageUrl)) continue;
    const next = getStableGiftImageUrl(item.title, item.category);
    if (item.imageUrl === next) continue;

    await prisma.giftCatalogItem.update({
      where: { id: item.id },
      data: { imageUrl: next },
    });
    updated += 1;
  }

  console.log(`gift images updated: ${updated}/${items.length}`);
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
