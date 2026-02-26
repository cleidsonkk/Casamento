import { PrismaClient, Role } from "@prisma/client";
import bcrypt from "bcryptjs";

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

function keywordFromGift(title: string, category: string) {
  const t = normalize(title);
  const c = normalize(category);
  if (t.includes("talher")) return "cutlery";
  if (t.includes("panela")) return "cooking-pot";
  if (t.includes("jantar") || t.includes("prato")) return "dinner-table";
  if (t.includes("taca") || t.includes("copo")) return "wine-glass";
  if (t.includes("cafeteira") || t.includes("cafe")) return "coffee-maker";
  if (t.includes("air fryer")) return "air-fryer";
  if (t.includes("liquidificador")) return "blender";
  if (t.includes("micro-ondas")) return "microwave";
  if (t.includes("cama") || t.includes("edredom")) return "bedroom";
  if (t.includes("toalha") || t.includes("banho")) return "bathroom";
  if (t.includes("almofada") || t.includes("tapete")) return "home-decor";
  if (t.includes("poltrona")) return "armchair";
  if (t.includes("luminaria")) return "lamp";
  if (t.includes("organizador") || t.includes("caixa") || t.includes("cabide")) return "closet-organization";
  if (t.includes("mala")) return "luggage";
  if (t.includes("passagem") || t.includes("aviao")) return "airplane-travel";
  if (t.includes("hotel")) return "hotel-room";
  if (t.includes("jantar romantico")) return "romantic-dinner";
  if (t.includes("barco")) return "boat-trip";
  if (t.includes("spa")) return "spa";
  if (t.includes("carro") || c.includes("transporte")) return "car";
  if (c.includes("cozinha")) return "kitchen";
  if (c.includes("quarto")) return "bedroom";
  if (c.includes("decoracao")) return "interior-design";
  if (c.includes("organizacao")) return "organization";
  if (c.includes("viagem")) return "travel";
  if (c.includes("experiencias")) return "experience";
  return "gift";
}

function giftPhotoUrl(title: string, category: string) {
  const keyword = keywordFromGift(title, category);
  const lock = hashCode(`${title}-${category}`);
  return `https://loremflickr.com/1200/900/${keyword}?lock=${lock}`;
}

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
          primary: key === "black-gold" ? "#b68b2f" : "#111111",
          border: "#e8e8e8",
          radiusCard: "1.25rem",
          radiusButton: "999px",
          radiusInput: "0.85rem",
          fontHeading: key === "destination-beach" ? "var(--font-cormorant)" : "var(--font-playfair)",
          fontBody: "var(--font-inter)",
          heroOverlay: key === "black-gold" ? 0.45 : 0.2,
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
      imageUrl: giftPhotoUrl(title, category),
      tags: [category.toLowerCase(), "casamento", "premium"],
    });
  }

  await prisma.giftCatalogItem.createMany({ data: catalog, skipDuplicates: true });
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

  await prisma.auditLog.create({
    data: {
      action: "SEED_COMPLETED",
      entity: "SYSTEM",
      userId: admin.id,
      coupleId: couple.id,
      metadata: { templates: 6, catalogItems: 120 },
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

