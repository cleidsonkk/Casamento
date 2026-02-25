import { PrismaClient, Role } from "@prisma/client";
import bcrypt from "bcryptjs";

const prisma = new PrismaClient();

const categories = [
  "Casa & Cozinha",
  "Quarto & Banho",
  "Sala & Decoração",
  "Organização",
  "Lua de Mel & Viagem",
  "Experiências",
  "Transporte",
  "Cotas",
];

const objects = [
  "jogo de talheres", "conjunto de panelas", "aparelho de jantar", "taças de cristal", "cafeteira",
  "air fryer", "liquidificador", "micro-ondas", "roupa de cama", "toalhas macias",
  "edredom premium", "almofadas decorativas", "tapete clean", "poltrona elegante", "luminária moderna",
  "organizador de closet", "caixas empilháveis", "cabides premium", "malas de viagem", "passagens aéreas",
  "diária de hotel", "jantar romântico", "passeio de barco", "spa para casal", "transfer aeroporto",
  "aluguel de carro", "combustível viagem", "cota de lua de mel", "cota de fotografia", "cota de música",
];

const promptFor = (obj: string) =>
  `Ilustração 3D clean, estilo app premium 2026, objeto ${obj} centralizado, fundo off-white com leve degradê, iluminação de estúdio suave, sombra macia, ultra nítido, sem texto, sem logo, sem marca, composição minimalista, alta qualidade.`;

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
          subtitle: "Estamos prontos para celebrar com você",
          story: "Nossa história começou com um café e agora celebramos uma vida inteira.",
          location: "São Paulo, SP",
          published: true,
          isRsvpOpen: true,
          rsvpRestricted: true,
          templateId: defaultTemplate.id,
          sections: {
            create: [
              { type: "story", title: "Nossa História", content: "Um amor com leveza e presença.", order: 1 },
              { type: "details", title: "Detalhes", content: "Cerimônia às 16h e festa às 18h.", order: 2 },
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
    catalog.push({
      title: `${obj[0].toUpperCase()}${obj.slice(1)} ${i + 1}`,
      category,
      description: `Item premium para ${category.toLowerCase()}.`,
      imageStyle: "3d_clean_2026",
      imagePrompt: promptFor(obj),
      imageUrl: null,
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
