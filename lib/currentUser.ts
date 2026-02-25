import { Role } from "@prisma/client";
import { requireSession } from "@/lib/session";

export async function requireCoupleContext() {
  const session = await requireSession();
  if (!session.user.coupleId) throw new Error("Casal não vinculado");
  return { userId: session.user.id, coupleId: session.user.coupleId, role: session.user.role };
}

export async function requireAdminContext() {
  const session = await requireSession();
  if (session.user.role !== Role.ADMIN) throw new Error("Acesso negado");
  return { userId: session.user.id, role: session.user.role };
}

