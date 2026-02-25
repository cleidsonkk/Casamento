import { NextResponse } from "next/server";
import { db } from "@/lib/db";
import { requireCoupleContext } from "@/lib/currentUser";
import { logAudit } from "@/lib/audit";

export async function GET() {
  try {
    const { coupleId } = await requireCoupleContext();
    const pix = await db.pixSetting.findUnique({ where: { coupleId } });
    return NextResponse.json(pix);
  } catch {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }
}

export async function PUT(req: Request) {
  try {
    const { coupleId, userId } = await requireCoupleContext();
    const body = await req.json();
    const pix = await db.pixSetting.upsert({
      where: { coupleId },
      update: {
        pixKey: body.pixKey,
        receiverName: body.receiverName,
        city: body.city,
        txidPrefix: body.txidPrefix,
        enabled: Boolean(body.enabled),
      },
      create: {
        coupleId,
        pixKey: body.pixKey,
        receiverName: body.receiverName,
        city: body.city,
        txidPrefix: body.txidPrefix ?? "WED",
        enabled: Boolean(body.enabled),
      },
    });
    await logAudit({ action: "PIX_UPDATED", entity: "PixSetting", entityId: pix.id, userId, coupleId });
    return NextResponse.json(pix);
  } catch {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }
}

