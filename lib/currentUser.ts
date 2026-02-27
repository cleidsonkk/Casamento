import { Role } from "@prisma/client";
import { requireSession } from "@/lib/session";
import { db } from "@/lib/db";

export async function requireCoupleContext() {
  const session = await requireSession();
  let coupleId = session.user.coupleId;

  if (!coupleId) {
    const membership = await db.coupleMember.findFirst({
      where: { userId: session.user.id },
      orderBy: { createdAt: "desc" },
      select: { coupleId: true },
    });
    coupleId = membership?.coupleId;
  }

  if (!coupleId) throw new Error("Casal nao vinculado");
  return { userId: session.user.id, coupleId, role: session.user.role };
}

export async function requireAdminContext() {
  const session = await requireSession();
  if (session.user.role !== Role.ADMIN) throw new Error("Acesso negado");
  return { userId: session.user.id, role: session.user.role };
}
