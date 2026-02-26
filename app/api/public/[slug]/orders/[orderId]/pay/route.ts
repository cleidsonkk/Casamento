import { NextResponse } from "next/server";
import { OrderStatus } from "@prisma/client";
import { db } from "@/lib/db";
import { logAudit } from "@/lib/audit";
import { paySchema } from "@/lib/validators";

export async function POST(req: Request, { params }: { params: Promise<{ slug: string; orderId: string }> }) {
  const { slug, orderId } = await params;

  let body: unknown = {};
  try {
    body = await req.json();
  } catch {
    body = {};
  }
  const parsed = paySchema.safeParse(body);
  if (!parsed.success) return NextResponse.json({ error: "Dados invalidos" }, { status: 400 });

  const order = await db.giftOrder.findFirst({
    where: { id: orderId, couple: { slug } },
    include: { couple: true },
  });
  if (!order) return NextResponse.json({ error: "Pedido nao encontrado" }, { status: 404 });

  if (order.status === OrderStatus.AWAITING_CONFIRMATION || order.status === OrderStatus.PAID) {
    return NextResponse.json({ ok: true, status: order.status });
  }
  if (order.status !== OrderStatus.PENDING_PAYMENT) {
    return NextResponse.json({ error: "Status invalido para confirmacao", status: order.status }, { status: 400 });
  }

  const updated = await db.giftOrder.update({
    where: { id: order.id },
    data: { status: OrderStatus.AWAITING_CONFIRMATION },
  });
  await logAudit({
    action: "ORDER_AWAITING_CONFIRMATION",
    entity: "GiftOrder",
    entityId: order.id,
    coupleId: order.coupleId,
    metadata: { note: parsed.data.note },
  });

  return NextResponse.json({ ok: true, status: updated.status });
}

