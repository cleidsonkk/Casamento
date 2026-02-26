import { PrismaClient } from "@prisma/client";

const prisma = new PrismaClient();

function normalize(value: string) {
  return (value || "")
    .normalize("NFD")
    .replace(/[\u0300-\u036f]/g, "")
    .toLowerCase();
}

function hashCode(value: string) {
  let hash = 0;
  for (let i = 0; i < value.length; i += 1) {
    hash = (hash << 5) - hash + value.charCodeAt(i);
    hash |= 0;
  }
  return Math.abs(hash);
}

function queryFromGift(title: string, category: string) {
  const t = normalize(title);
  const c = normalize(category);
  if (t.includes("talher")) return "cutlery set";
  if (t.includes("panela")) return "stainless steel cookware set";
  if (t.includes("jantar") || t.includes("prato")) return "ceramic dinnerware set";
  if (t.includes("taca")) return "wine glasses set";
  if (t.includes("copo")) return "glass cups set";
  if (t.includes("cafeteira")) return "coffee machine kitchen";
  if (t.includes("air fryer")) return "air fryer kitchen appliance";
  if (t.includes("liquidificador")) return "blender appliance";
  if (t.includes("micro-ondas")) return "microwave appliance";
  if (t.includes("roupa de cama") || t.includes("edredom")) return "bed linen set";
  if (t.includes("toalha") || t.includes("banho")) return "bath towels set";
  if (t.includes("almofada")) return "decorative pillows";
  if (t.includes("tapete")) return "living room rug";
  if (t.includes("poltrona")) return "modern armchair";
  if (t.includes("luminaria")) return "table lamp decor";
  if (t.includes("organizador")) return "closet organizer";
  if (t.includes("caixa")) return "storage boxes home";
  if (t.includes("cabide")) return "clothes hangers";
  if (t.includes("mala")) return "travel suitcase";
  if (t.includes("passagem") || t.includes("aviao")) return "airplane travel";
  if (t.includes("hotel")) return "hotel room";
  if (t.includes("jantar romantico")) return "romantic dinner table";
  if (t.includes("barco")) return "boat trip";
  if (t.includes("spa")) return "spa";
  if (t.includes("carro") || c.includes("transporte")) return "car rental";
  if (c.includes("cozinha")) return "kitchen utensils";
  if (c.includes("quarto")) return "bedroom decor";
  if (c.includes("decoracao")) return "home decor";
  if (c.includes("organizacao")) return "home organization";
  if (c.includes("viagem")) return "travel accessories";
  if (c.includes("experiencias")) return "romantic experience";
  return "gift box";
}

function giftPhotoUrl(title: string, category: string) {
  const keyword = encodeURIComponent(queryFromGift(title, category));
  const lock = hashCode(`${title}-${category}`);
  return `https://source.unsplash.com/1200x900/?${keyword}&sig=${lock}`;
}

async function main() {
  const items = await prisma.giftCatalogItem.findMany();
  let updated = 0;
  for (const item of items) {
    const next = giftPhotoUrl(item.title, item.category);
    if (item.imageUrl !== next) {
      await prisma.giftCatalogItem.update({
        where: { id: item.id },
        data: { imageUrl: next },
      });
      updated += 1;
    }
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
