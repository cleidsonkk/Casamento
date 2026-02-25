import { NextResponse } from "next/server";
import { requireAdminContext } from "@/lib/currentUser";
import { db } from "@/lib/db";

export async function GET() {
  try {
    await requireAdminContext();
    const [couples, users, orders] = await Promise.all([
      db.couple.count(),
      db.user.count(),
      db.giftOrder.count(),
    ]);
    return NextResponse.json({ couples, users, orders });
  } catch {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }
}

