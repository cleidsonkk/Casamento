import Papa from "papaparse";
import { NextResponse } from "next/server";
import { db } from "@/lib/db";
import { requireCoupleContext } from "@/lib/currentUser";
import { csvGuestSchema } from "@/lib/validators";
import { normalizeName } from "@/lib/slug";
import { logAudit } from "@/lib/audit";

export async function POST(req: Request) {
  try {
    const { coupleId, userId } = await requireCoupleContext();
    const { csv } = await req.json();
    const parsed = Papa.parse(csv as string, { header: true });
    const rows = parsed.data as Record<string, string>[];
    const valid = rows
      .map((r) =>
        csvGuestSchema.safeParse({
          fullName: r.fullName ?? r.nome,
          maxCompanions: r.maxCompanions ?? r.acompanhantes ?? 0,
          passcode: r.passcode,
        }),
      )
      .filter((x) => x.success)
      .map((x) => x.data);

    if (!valid.length) return NextResponse.json({ imported: 0 });
    await db.guest.createMany({
      data: valid.map((g) => ({
        coupleId,
        fullName: g.fullName,
        normalizedName: normalizeName(g.fullName),
        maxCompanions: g.maxCompanions,
        passcode: g.passcode,
      })),
    });
    await logAudit({
      action: "GUEST_IMPORT_CSV",
      entity: "Guest",
      userId,
      coupleId,
      metadata: { count: valid.length },
    });
    return NextResponse.json({ imported: valid.length });
  } catch {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }
}

