import { NextResponse } from "next/server";
import { db } from "@/lib/db";
import { requireCoupleContext } from "@/lib/currentUser";
import { logAudit } from "@/lib/audit";
import { normalizeName } from "@/lib/slug";

export async function GET() {
  try {
    const { coupleId } = await requireCoupleContext();
    const guests = await db.guest.findMany({ where: { coupleId }, orderBy: { createdAt: "desc" } });
    return NextResponse.json({ guests });
  } catch {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }
}

export async function POST(req: Request) {
  try {
    const { coupleId, userId } = await requireCoupleContext();
    const body = await req.json();
    const fullName = String(body.fullName ?? "");
    const guest = await db.guest.create({
      data: {
        coupleId,
        fullName,
        normalizedName: normalizeName(fullName),
        maxCompanions: Number(body.maxCompanions ?? 0),
        passcode: body.passcode ?? null,
      },
    });
    await logAudit({ action: "GUEST_CREATED", entity: "Guest", entityId: guest.id, userId, coupleId });
    return NextResponse.json(guest);
  } catch {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }
}

export async function DELETE(req: Request) {
  try {
    const { coupleId, userId } = await requireCoupleContext();
    const url = new URL(req.url);
    const id = url.searchParams.get("id");
    if (!id) return NextResponse.json({ error: "id obrigatório" }, { status: 400 });
    await db.guest.deleteMany({ where: { id, coupleId } });
    await logAudit({ action: "GUEST_DELETED", entity: "Guest", entityId: id, userId, coupleId });
    return NextResponse.json({ ok: true });
  } catch {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }
}
