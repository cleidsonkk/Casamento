import { NextResponse } from "next/server";
import { db } from "@/lib/db";
import { requireCoupleContext } from "@/lib/currentUser";
import { expireOrders } from "@/lib/reservation";

export async function GET() {
  try {
    const { coupleId } = await requireCoupleContext();
    await expireOrders(coupleId);
    const orders = await db.giftOrder.findMany({
      where: { coupleId },
      include: { weddingGift: { include: { catalogItem: true } } },
      orderBy: { createdAt: "desc" },
    });
    return NextResponse.json({ orders });
  } catch {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }
}

