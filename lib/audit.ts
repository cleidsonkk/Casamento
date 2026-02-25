import { db } from "@/lib/db";
import { Prisma } from "@prisma/client";

type AuditInput = {
  action: string;
  entity: string;
  entityId?: string;
  userId?: string;
  coupleId?: string;
  metadata?: Record<string, unknown>;
};

export async function logAudit(input: AuditInput) {
  await db.auditLog.create({
    data: {
      action: input.action,
      entity: input.entity,
      entityId: input.entityId,
      userId: input.userId,
      coupleId: input.coupleId,
      metadata: (input.metadata ?? {}) as Prisma.InputJsonValue,
    },
  });
}
