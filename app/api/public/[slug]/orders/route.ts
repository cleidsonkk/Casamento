import { NextRequest, NextResponse } from "next/server";
import { GiftMode, OrderStatus } from "@prisma/client";
import { db } from "@/lib/db";
import { enforceRateLimit } from "@/lib/rateLimit";
import { RESERVATION_MINUTES, hasActiveUniqueReservation } from "@/lib/reservation";
import { orderSchema } from "@/lib/validators";
import { logAudit } from "@/lib/audit";

function createTxid(prefix: string) {
  return `${prefix}${Date.now().toString(36).toUpperCase()}`.slice(0, 25);
}

export async function POST(req: NextRequest, { params }: { params: Promise<{ slug: string }> }) {
  try {
    const ip = req.headers.get("x-forwarded-for") ?? "unknown";
    const { slug } = await params;
    const body = await req.json();
    const parsed = orderSchema.safeParse(body);
    if (!parsed.success) return NextResponse.json({ error: "Dados invalidos" }, { status: 400 });
    if (parsed.data.hp) return NextResponse.json({ ok: true });

    const rl = await enforceRateLimit(`order:${slug}:${ip}`, 10, 60_000);
    if (!rl.success) return NextResponse.json({ error: "Muitas tentativas" }, { status: 429 });

    const couple = await db.couple.findUnique({
      where: { slug },
      include: { pixSetting: true, gifts: true },
    });
    if (!couple) return NextResponse.json({ error: "Not found" }, { status: 404 });
    if (!couple.pixSetting?.enabled) return NextResponse.json({ error: "Pix nao configurado" }, { status: 400 });

    const gift = await db.weddingGift.findFirst({
      where: { id: parsed.data.weddingGiftId, coupleId: couple.id, active: true },
    });
    if (!gift) return NextResponse.json({ error: "Presente nao encontrado" }, { status: 404 });

    if (gift.giftMode === GiftMode.UNIQUE) {
      const blocked = await hasActiveUniqueReservation(gift.id);
      if (blocked) return NextResponse.json({ error: "Presente reservado/indisponivel" }, { status: 409 });
    }

    const order = await db.giftOrder.create({
      data: {
        coupleId: couple.id,
        weddingGiftId: gift.id,
        giverName: parsed.data.giverName,
        message: parsed.data.message,
        amountCents: gift.priceCents,
        status: OrderStatus.PENDING_PAYMENT,
        pixTxid: createTxid(couple.pixSetting.txidPrefix),
        reservedUntil: gift.giftMode === GiftMode.UNIQUE ? new Date(Date.now() + RESERVATION_MINUTES * 60_000) : null,
      },
    });

    try {
      await logAudit({
        action: "ORDER_CREATED",
        entity: "GiftOrder",
        entityId: order.id,
        coupleId: couple.id,
        metadata: { ip, giftMode: gift.giftMode },
      });
    } catch (error) {
      console.error("[public-order] Failed to write audit log", error);
    }

    return NextResponse.json({ orderId: order.id, status: order.status });
  } catch (error) {
    console.error("[public-order] Failed to create order", error);
    return NextResponse.json({ error: "Nao foi possivel iniciar o checkout Pix." }, { status: 500 });
  }
}
