import { OrderStatus } from "@prisma/client";
import { db } from "@/lib/db";
import { requireCoupleContext } from "@/lib/currentUser";
import { logAudit } from "@/lib/audit";
import { apiError, apiSuccess, createRequestId, logApiError } from "@/lib/api";
import { dashboardOrderConfirmSchema } from "@/lib/validators";

export async function POST(req: Request, { params }: { params: Promise<{ orderId: string }> }) {
  const requestId = createRequestId();
  try {
    const { orderId } = await params;
    const { coupleId, userId } = await requireCoupleContext();
    const body = await req.json();
    const parsed = dashboardOrderConfirmSchema.safeParse(body);
    if (!parsed.success) {
      return apiError("status invalido", { status: 400, code: "INVALID_STATUS", requestId });
    }

    const existing = await db.giftOrder.findFirst({ where: { id: orderId, coupleId } });
    if (!existing) {
      return apiError("Pedido nao encontrado", { status: 404, code: "ORDER_NOT_FOUND", requestId });
    }

    const order = await db.giftOrder.update({
      where: { id: orderId },
      data: {
        status: parsed.data.status === "PAID" ? OrderStatus.PAID : OrderStatus.CANCELED,
        markedPaidAt: parsed.data.status === "PAID" ? new Date() : null,
        markedPaidByUserId: parsed.data.status === "PAID" ? userId : null,
      },
    });
    await logAudit({
      action: `ORDER_${parsed.data.status}`,
      entity: "GiftOrder",
      entityId: order.id,
      userId,
      coupleId,
    });
    return apiSuccess(order);
  } catch (error) {
    logApiError("dashboard-order-confirm:post", error, requestId);
    return apiError("Nao foi possivel atualizar o pedido.", { status: 500, code: "ORDER_CONFIRM_FAILED", requestId });
  }
}
