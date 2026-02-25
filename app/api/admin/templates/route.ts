import { NextResponse } from "next/server";
import { db } from "@/lib/db";
import { requireAdminContext } from "@/lib/currentUser";
import { logAudit } from "@/lib/audit";

export async function GET() {
  try {
    await requireAdminContext();
    const templates = await db.template.findMany({ orderBy: { createdAt: "asc" } });
    return NextResponse.json({ templates });
  } catch {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }
}

export async function POST(req: Request) {
  try {
    const { userId } = await requireAdminContext();
    const body = await req.json();
    const template = await db.template.create({
      data: {
        key: body.key,
        name: body.name,
        description: body.description,
        tokensJson: body.tokensJson ?? {},
        layoutJson: body.layoutJson ?? {},
      },
    });
    await logAudit({ action: "ADMIN_TEMPLATE_CREATED", entity: "Template", entityId: template.id, userId });
    return NextResponse.json(template);
  } catch {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }
}

