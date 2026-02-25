import { NextResponse } from "next/server";
import { db } from "@/lib/db";
import { requireCoupleContext } from "@/lib/currentUser";
import { logAudit } from "@/lib/audit";

export async function GET() {
  try {
    const { coupleId } = await requireCoupleContext();
    const gifts = await db.weddingGift.findMany({
      where: { coupleId },
      include: { catalogItem: true },
      orderBy: { createdAt: "desc" },
    });
    const catalog = await db.giftCatalogItem.findMany({ orderBy: { createdAt: "asc" } });
    return NextResponse.json({ gifts, catalog });
  } catch {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }
}

export async function PUT(req: Request) {
  try {
    const { coupleId, userId } = await requireCoupleContext();
    const body = await req.json();
    const updates = body.items as Array<{ id?: string; catalogItemId: string; active: boolean; priceCents: number; giftMode: "UNIQUE" | "REPEATABLE" }>;
    for (const item of updates) {
      await db.weddingGift.upsert({
        where: { coupleId_catalogItemId: { coupleId, catalogItemId: item.catalogItemId } },
        update: { active: item.active, priceCents: item.priceCents, giftMode: item.giftMode },
        create: {
          coupleId,
          catalogItemId: item.catalogItemId,
          active: item.active,
          priceCents: item.priceCents,
          giftMode: item.giftMode,
        },
      });
    }
    await logAudit({
      action: "GIFTS_UPDATED",
      entity: "WeddingGift",
      userId,
      coupleId,
      metadata: { count: updates.length },
    });
    return NextResponse.json({ ok: true });
  } catch {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }
}

