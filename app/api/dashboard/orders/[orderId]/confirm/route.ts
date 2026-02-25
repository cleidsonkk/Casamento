import { NextResponse } from "next/server";
import { OrderStatus } from "@prisma/client";
import { db } from "@/lib/db";
import { requireCoupleContext } from "@/lib/currentUser";
import { logAudit } from "@/lib/audit";

export async function POST(req: Request, { params }: { params: Promise<{ orderId: string }> }) {
  try {
    const { orderId } = await params;
    const { coupleId, userId } = await requireCoupleContext();
    const body = await req.json();
    const status = body.status as "PAID" | "CANCELED";
    if (!["PAID", "CANCELED"].includes(status)) {
      return NextResponse.json({ error: "status inválido" }, { status: 400 });
    }
    const existing = await db.giftOrder.findFirst({ where: { id: orderId, coupleId } });
    if (!existing) return NextResponse.json({ error: "Pedido não encontrado" }, { status: 404 });
    const order = await db.giftOrder.update({
      where: { id: orderId },
      data: {
        status: status === "PAID" ? OrderStatus.PAID : OrderStatus.CANCELED,
        markedPaidAt: status === "PAID" ? new Date() : null,
        markedPaidByUserId: status === "PAID" ? userId : null,
      },
    });
    await logAudit({
      action: `ORDER_${status}`,
      entity: "GiftOrder",
      entityId: order.id,
      userId,
      coupleId,
    });
    return NextResponse.json(order);
  } catch {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }
}
