import { PrismaClient, Role } from "@prisma/client";
import bcrypt from "bcryptjs";
import { getStableGiftImageUrl } from "../lib/gift-image";

const prisma = new PrismaClient();

const categories = [
  "Casa & Cozinha",
  "Quarto & Banho",
  "Sala & Decoracao",
  "Organizacao",
  "Lua de Mel & Viagem",
  "Experiencias",
  "Transporte",
  "Cotas",
];

const objects = [
  "jogo de talheres", "conjunto de panelas", "aparelho de jantar", "tacas de cristal", "cafeteira",
  "air fryer", "liquidificador", "micro-ondas", "roupa de cama", "toalhas macias",
  "edredom premium", "almofadas decorativas", "tapete clean", "poltrona elegante", "luminaria moderna",
  "organizador de closet", "caixas empilhaveis", "cabides premium", "malas de viagem", "passagens aereas",
  "diaria de hotel", "jantar romantico", "passeio de barco", "spa para casal", "transfer aeroporto",
  "aluguel de carro", "combustivel viagem", "cota de lua de mel", "cota de fotografia", "cota de musica",
];

const promptFor = (obj: string) =>
  `Ilustracao 3D clean, estilo app premium 2026, objeto ${obj} centralizado, fundo off-white com leve degrade, iluminacao de estudio suave, sombra macia, ultra nitido, sem texto, sem logo, sem marca, composicao minimalista, alta qualidade.`;

async function main() {
  const adminPass = await bcrypt.hash("admin123", 10);
  const ownerPass = await bcrypt.hash("casal123", 10);

  const admin = await prisma.user.upsert({
    where: { email: "admin@weddingsaas.com" },
    update: {},
    create: { name: "Admin", email: "admin@weddingsaas.com", passwordHash: adminPass, role: Role.ADMIN },
  });

  const owner = await prisma.user.upsert({
    where: { email: "casal@weddingsaas.com" },
    update: {},
    create: { name: "Ana e Bruno", email: "casal@weddingsaas.com", passwordHash: ownerPass, role: Role.COUPLE_OWNER },
  });

  const templateSeed = [
    ["luxe-minimal", "Luxe Minimal"],
    ["romantic-contemporary", "Romantic Contemporary"],
    ["black-gold", "Black Gold"],
    ["destination-beach", "Destination Beach"],
    ["classic-elegance", "Classic Elegance"],
    ["modern-neutral", "Modern Neutral"],
    ["garden-luxe", "Garden Luxe"],
    ["sunset-terracotta", "Sunset Terracotta"],
    ["pearl-rose", "Pearl Rose"],
    ["opal-night", "Opal Night"],
  ];

  for (const [key, name] of templateSeed) {
    await prisma.template.upsert({
      where: { key },
      update: {},
      create: {
        key,
        name,
        description: `Template ${name}`,
        previewUrl: null,
        tokensJson: {
          background: "#f8f7f4",
          card: "#ffffff",
          text: "#111111",
          muted: "#6f6f6f",
          primary: key === "black-gold" ? "#b68b2f" : key === "opal-night" ? "#6b8db8" : "#111111",
          border: "#e8e8e8",
          radiusCard: "1.25rem",
          radiusButton: "999px",
          radiusInput: "0.85rem",
          fontHeading: ["destination-beach", "garden-luxe", "pearl-rose"].includes(key) ? "var(--font-cormorant)" : "var(--font-playfair)",
          fontBody: "var(--font-inter)",
          heroOverlay: key === "black-gold" || key === "opal-night" ? 0.5 : 0.22,
        },
        layoutJson: {
          heroStyle: key,
          sectionOrder: ["hero", "story", "details", "gallery", "rsvp", "gifts"],
          heroAlign: "center",
        },
      },
    });
  }

  const defaultTemplate = await prisma.template.findUnique({ where: { key: "luxe-minimal" } });
  if (!defaultTemplate) throw new Error("Default template not found");

  const couple = await prisma.couple.upsert({
    where: { slug: "ana-e-bruno" },
    update: {},
    create: {
      slug: "ana-e-bruno",
      name: "Ana e Bruno",
      members: { create: { userId: owner.id, role: Role.COUPLE_OWNER } },
      wedding: {
        create: {
          title: "Ana + Bruno",
          subtitle: "Estamos prontos para celebrar com voce",
          story: "Nossa historia comecou com um cafe e agora celebramos uma vida inteira.",
          location: "Sao Paulo, SP",
          published: true,
          isRsvpOpen: true,
          rsvpRestricted: true,
          templateId: defaultTemplate.id,
          sections: {
            create: [
              { type: "story", title: "Nossa Historia", content: "Um amor com leveza e presenca.", order: 1 },
              { type: "details", title: "Detalhes", content: "Cerimonia as 16h e festa as 18h.", order: 2 },
            ],
          },
        },
      },
      pixSetting: {
        create: {
          pixKey: "casal@weddingsaas.com",
          receiverName: "ANA E BRUNO",
          city: "SAO PAULO",
          txidPrefix: "ANBR",
          enabled: true,
        },
      },
      guests: {
        create: [
          { fullName: "Carlos Lima", normalizedName: "carlos lima", maxCompanions: 1 },
          { fullName: "Marina Souza", normalizedName: "marina souza", maxCompanions: 2 },
        ],
      },
    },
    include: { gifts: true },
  });

  const catalog = [];
  for (let i = 0; i < 120; i += 1) {
    const obj = objects[i % objects.length];
    const category = categories[i % categories.length];
    const title = `${obj[0].toUpperCase()}${obj.slice(1)} ${i + 1}`;
    catalog.push({
      title,
      category,
      description: `Item premium para ${category.toLowerCase()}.`,
      imageStyle: "3d_clean_2026",
      imagePrompt: promptFor(obj),
      imageUrl: getStableGiftImageUrl(title, category),
      tags: [category.toLowerCase(), "casamento", "premium"],
    });
  }

  await prisma.giftCatalogItem.createMany({ data: catalog, skipDuplicates: true });

  const beerTitle = "Ajuda na cerveja";
  const existingBeer = await prisma.giftCatalogItem.findFirst({ where: { title: beerTitle } });
  const beerData = {
    title: beerTitle,
    category: "Experiencias",
    description: "Ajude os noivos com o bar e cervejas da festa.",
    imageStyle: "3d_clean_2026",
    imagePrompt: promptFor("cervejas para festa"),
    imageUrl: getStableGiftImageUrl(beerTitle, "Experiencias"),
    tags: ["cerveja", "festa", "experiencia", "casamento"],
  };
  const beerHelpCatalog = existingBeer
    ? await prisma.giftCatalogItem.update({ where: { id: existingBeer.id }, data: beerData })
    : await prisma.giftCatalogItem.create({ data: beerData });

  const gasTitle = "Ajuda no botijao de gas";
  const existingGas = await prisma.giftCatalogItem.findFirst({ where: { title: gasTitle } });
  const gasData = {
    title: gasTitle,
    category: "Casa & Cozinha",
    description: "Contribua com a compra de botijao de gas para o novo lar.",
    imageStyle: "3d_clean_2026",
    imagePrompt: promptFor("botijao de gas"),
    imageUrl: getStableGiftImageUrl(gasTitle, "Casa & Cozinha"),
    tags: ["botijao", "gas", "casa", "casamento"],
  };
  const gasHelpCatalog = existingGas
    ? await prisma.giftCatalogItem.update({ where: { id: existingGas.id }, data: gasData })
    : await prisma.giftCatalogItem.create({ data: gasData });

  const firstItems = await prisma.giftCatalogItem.findMany({ take: 12, orderBy: { createdAt: "asc" } });
  for (const [idx, item] of firstItems.entries()) {
    await prisma.weddingGift.upsert({
      where: { coupleId_catalogItemId: { coupleId: couple.id, catalogItemId: item.id } },
      update: { active: true, priceCents: 25000 + idx * 10000, giftMode: idx % 3 === 0 ? "REPEATABLE" : "UNIQUE" },
      create: {
        coupleId: couple.id,
        catalogItemId: item.id,
        active: true,
        priceCents: 25000 + idx * 10000,
        giftMode: idx % 3 === 0 ? "REPEATABLE" : "UNIQUE",
      },
    });
  }

  await prisma.weddingGift.upsert({
    where: { coupleId_catalogItemId: { coupleId: couple.id, catalogItemId: beerHelpCatalog.id } },
    update: {
      active: true,
      priceCents: 2500,
      giftMode: "REPEATABLE",
    },
    create: {
      coupleId: couple.id,
      catalogItemId: beerHelpCatalog.id,
      active: true,
      priceCents: 2500,
      giftMode: "REPEATABLE",
    },
  });

  await prisma.weddingGift.upsert({
    where: { coupleId_catalogItemId: { coupleId: couple.id, catalogItemId: gasHelpCatalog.id } },
    update: {
      active: true,
      priceCents: 18000,
      giftMode: "REPEATABLE",
    },
    create: {
      coupleId: couple.id,
      catalogItemId: gasHelpCatalog.id,
      active: true,
      priceCents: 18000,
      giftMode: "REPEATABLE",
    },
  });

  await prisma.auditLog.create({
    data: {
      action: "SEED_COMPLETED",
      entity: "SYSTEM",
      userId: admin.id,
      coupleId: couple.id,
      metadata: { templates: 10, catalogItems: 122 },
    },
  });
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
