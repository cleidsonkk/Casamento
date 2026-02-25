import { NextResponse } from "next/server";
import { db } from "@/lib/db";
import { requireAdminContext } from "@/lib/currentUser";
import { toSlug } from "@/lib/slug";
import { logAudit } from "@/lib/audit";

export async function GET() {
  try {
    await requireAdminContext();
    const couples = await db.couple.findMany({ orderBy: { createdAt: "desc" } });
    return NextResponse.json({ couples });
  } catch {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }
}

export async function POST(req: Request) {
  try {
    const { userId } = await requireAdminContext();
    const body = await req.json();
    const couple = await db.couple.create({
      data: {
        name: body.name,
        slug: toSlug(body.slug ?? body.name),
        wedding: { create: { title: body.name, published: false } },
      },
    });
    await logAudit({ action: "ADMIN_COUPLE_CREATED", entity: "Couple", entityId: couple.id, userId });
    return NextResponse.json(couple);
  } catch {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }
}

