import { NextResponse } from "next/server";
import { db } from "@/lib/db";
import { requireAdminContext } from "@/lib/currentUser";

export async function GET() {
  try {
    await requireAdminContext();
    const logs = await db.auditLog.findMany({ orderBy: { createdAt: "desc" }, take: 300 });
    return NextResponse.json({ logs });
  } catch {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }
}

