import { NextResponse } from "next/server";
import { db } from "@/lib/db";
import { requireCoupleContext } from "@/lib/currentUser";

export async function GET() {
  try {
    const { coupleId } = await requireCoupleContext();
    const rsvps = await db.rsvp.findMany({ where: { coupleId }, orderBy: { createdAt: "desc" } });
    return NextResponse.json({ rsvps });
  } catch {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }
}
