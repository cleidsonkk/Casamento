import { NextResponse } from "next/server";
import { GiftMode, OrderStatus } from "@prisma/client";
import { db } from "@/lib/db";
import { expireOrders } from "@/lib/reservation";

export async function GET(req: Request, { params }: { params: Promise<{ slug: string }> }) {
  const { slug } = await params;
  const url = new URL(req.url);
  const q = url.searchParams.get("q")?.toLowerCase() ?? "";
  const category = url.searchParams.get("category");
  const sort = url.searchParams.get("sort") ?? "asc";

  const couple = await db.couple.findUnique({
    where: { slug },
    include: { gifts: { include: { catalogItem: true, orders: true } } },
  });
  if (!couple) return NextResponse.json({ error: "Not found" }, { status: 404 });
  await expireOrders(couple.id);

  const data = couple.gifts
    .filter((g) => g.active)
    .map((gift) => {
      const activeReservations = gift.orders.filter(
        (o) =>
          o.status === OrderStatus.AWAITING_CONFIRMATION ||
          o.status === OrderStatus.PAID ||
          (o.status === OrderStatus.PENDING_PAYMENT && !!o.reservedUntil && o.reservedUntil > new Date()),
      );
      const paidUnique = gift.giftMode === GiftMode.UNIQUE && gift.orders.some((o) => o.status === OrderStatus.PAID);
      const state = paidUnique ? "indisponivel" : activeReservations.length > 0 ? "reservado" : "disponivel";
      return {
        id: gift.id,
        title: gift.catalogItem.title,
        category: gift.catalogItem.category,
        description: gift.catalogItem.description,
        imageUrl: gift.catalogItem.imageUrl,
        imageStyle: gift.catalogItem.imageStyle,
        priceCents: gift.priceCents,
        giftMode: gift.giftMode,
        state,
        reservations: activeReservations.length,
      };
    })
    .filter((g) => (!q ? true : `${g.title} ${g.description}`.toLowerCase().includes(q)))
    .filter((g) => (!category ? true : g.category === category))
    .sort((a, b) => (sort === "desc" ? b.priceCents - a.priceCents : a.priceCents - b.priceCents));

  return NextResponse.json({ items: data });
}

