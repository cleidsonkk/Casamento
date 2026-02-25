import { NextResponse } from "next/server";
import { db } from "@/lib/db";
import { requireAdminContext } from "@/lib/currentUser";
import { logAudit } from "@/lib/audit";

export async function GET() {
  try {
    await requireAdminContext();
    const items = await db.giftCatalogItem.findMany({ orderBy: { createdAt: "desc" }, take: 200 });
    return NextResponse.json({ items });
  } catch {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }
}

export async function POST(req: Request) {
  try {
    const { userId } = await requireAdminContext();
    const body = await req.json();
    const item = await db.giftCatalogItem.create({
      data: {
        title: body.title,
        category: body.category,
        description: body.description,
        imageStyle: body.imageStyle ?? "3d_clean_2026",
        imagePrompt: body.imagePrompt,
        imageUrl: body.imageUrl ?? null,
        tags: body.tags ?? [],
      },
    });
    await logAudit({ action: "ADMIN_CATALOG_CREATED", entity: "GiftCatalogItem", entityId: item.id, userId });
    return NextResponse.json(item);
  } catch {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }
}

