import { OrderStatus } from "@prisma/client";
import { db } from "@/lib/db";

export const RESERVATION_MINUTES = 15;

export async function expireOrders(coupleId: string) {
  await db.giftOrder.updateMany({
    where: {
      coupleId,
      status: OrderStatus.PENDING_PAYMENT,
      reservedUntil: { lt: new Date() },
    },
    data: { status: OrderStatus.EXPIRED },
  });
}

export async function hasActiveUniqueReservation(weddingGiftId: string) {
  const now = new Date();
  const existing = await db.giftOrder.findFirst({
    where: {
      weddingGiftId,
      OR: [
        { status: OrderStatus.PAID },
        { status: OrderStatus.AWAITING_CONFIRMATION },
        {
          status: OrderStatus.PENDING_PAYMENT,
          reservedUntil: { gt: now },
        },
      ],
    },
  });
  return Boolean(existing);
}

