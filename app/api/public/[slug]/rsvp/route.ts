import { createHash } from "crypto";
import { NextRequest, NextResponse } from "next/server";
import { RSVPStatus } from "@prisma/client";
import { db } from "@/lib/db";
import { enforceRateLimit } from "@/lib/rateLimit";
import { normalizeName } from "@/lib/slug";
import { rsvpSchema } from "@/lib/validators";

export async function POST(req: NextRequest, { params }: { params: Promise<{ slug: string }> }) {
  const ip = req.headers.get("x-forwarded-for") ?? "unknown";
  const { slug } = await params;
  const payload = await req.json();
  const parsed = rsvpSchema.safeParse(payload);
  if (!parsed.success) return NextResponse.json({ error: "Dados inválidos" }, { status: 400 });
  if (parsed.data.hp) return NextResponse.json({ ok: true });

  const rl = await enforceRateLimit(`rsvp:${slug}:${ip}`, 8, 60_000);
  if (!rl.success) return NextResponse.json({ error: "Muitas tentativas" }, { status: 429 });

  const couple = await db.couple.findUnique({
    where: { slug },
    include: { wedding: true, guests: true },
  });
  if (!couple?.wedding?.isRsvpOpen) return NextResponse.json({ error: "RSVP fechado" }, { status: 400 });

  const normalizedName = normalizeName(parsed.data.name);
  const guest = couple.guests.find((g) => g.normalizedName === normalizedName);
  if (couple.wedding.rsvpRestricted) {
    const passcodeOk = parsed.data.passcode && couple.wedding.rsvpPasscode === parsed.data.passcode;
    if (!guest && !passcodeOk) return NextResponse.json({ error: "Convidado não encontrado" }, { status: 403 });
  }
  if (guest && parsed.data.companions > guest.maxCompanions) {
    return NextResponse.json({ error: "Limite de acompanhantes excedido" }, { status: 400 });
  }

  const ipHash = createHash("sha256").update(ip).digest("hex").slice(0, 18);
  const rsvp = await db.rsvp.create({
    data: {
      coupleId: couple.id,
      guestName: parsed.data.name,
      normalizedName,
      status: parsed.data.status === "YES" ? RSVPStatus.YES : RSVPStatus.NO,
      companions: parsed.data.companions,
      message: parsed.data.message,
      source: "public",
      meta: { ipHash },
    },
  });

  return NextResponse.json({ ok: true, rsvpId: rsvp.id });
}

