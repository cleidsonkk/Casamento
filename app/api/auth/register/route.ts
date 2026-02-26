import bcrypt from "bcryptjs";
import { NextResponse } from "next/server";
import { Role } from "@prisma/client";
import { db } from "@/lib/db";
import { toSlug } from "@/lib/slug";
import { registerSchema } from "@/lib/validators";

async function createUniqueSlug(baseValue: string) {
  const base = toSlug(baseValue) || "casal";
  let slug = base;
  let count = 1;

  while (count < 50) {
    const exists = await db.couple.findUnique({ where: { slug }, select: { id: true } });
    if (!exists) return slug;
    count += 1;
    slug = `${base}-${count}`;
  }

  return `${base}-${Date.now()}`;
}

export async function POST(req: Request) {
  try {
    const body = await req.json();
    const parsed = registerSchema.safeParse(body);
    if (!parsed.success) {
      return NextResponse.json({ error: "Dados invalidos" }, { status: 400 });
    }

    const { yourName, partnerName, email, password } = parsed.data;
    const emailLower = email.toLowerCase().trim();
    const existing = await db.user.findUnique({ where: { email: emailLower }, select: { id: true } });
    if (existing) {
      return NextResponse.json({ error: "Este email ja esta cadastrado" }, { status: 409 });
    }

    const passwordHash = await bcrypt.hash(password, 10);
    const coupleName = `${yourName.trim()} + ${partnerName.trim()}`;
    const slug = await createUniqueSlug(coupleName.replace("+", " e "));

    await db.$transaction(async (tx) => {
      const user = await tx.user.create({
        data: {
          name: yourName.trim(),
          email: emailLower,
          passwordHash,
          role: Role.COUPLE_OWNER,
        },
      });

      const couple = await tx.couple.create({
        data: {
          name: coupleName,
          slug,
          members: {
            create: {
              userId: user.id,
              role: Role.COUPLE_OWNER,
            },
          },
        },
      });

      await tx.wedding.create({
        data: {
          coupleId: couple.id,
          title: coupleName,
          subtitle: "Estamos felizes em compartilhar esse momento com voce.",
          story: "Aqui voces podem contar a historia do casal e os detalhes do grande dia.",
          published: false,
          isRsvpOpen: false,
          rsvpRestricted: true,
          sections: {
            create: [
              { type: "HISTORY", title: "Nossa Historia", content: "Edite esta secao no dashboard.", order: 1, enabled: true },
              { type: "DETAILS", title: "Detalhes da Cerimonia", content: "Informe local, horario e orientacoes.", order: 2, enabled: true },
            ],
          },
        },
      });
    });

    return NextResponse.json({ ok: true });
  } catch {
    return NextResponse.json({ error: "Nao foi possivel criar cadastro" }, { status: 500 });
  }
}

