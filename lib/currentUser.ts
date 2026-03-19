import { Role } from "@prisma/client";
import { requireSession } from "@/lib/session";
import { db } from "@/lib/db";

export async function requireCoupleContext() {
  const session = await requireSession();
  const memberships = await db.coupleMember.findMany({
    where: { userId: session.user.id },
    orderBy: { createdAt: "desc" },
    select: { coupleId: true },
  });
  const coupleIds = memberships.map((membership) => membership.coupleId);
  let coupleId = session.user.coupleId;

  if (!coupleId || !coupleIds.includes(coupleId)) {
    coupleId = coupleIds[0];
  }

  if (!coupleId) throw new Error("Casal nao vinculado");
  return { userId: session.user.id, coupleId, role: session.user.role };
}

export async function requireAdminContext() {
  const session = await requireSession();
  if (session.user.role !== Role.ADMIN) throw new Error("Acesso negado");
  return { userId: session.user.id, role: session.user.role };
}
