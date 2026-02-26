import { NextResponse } from "next/server";
import { db } from "@/lib/db";
import { requireCoupleContext } from "@/lib/currentUser";
import { logAudit } from "@/lib/audit";

export async function GET() {
  try {
    const { coupleId } = await requireCoupleContext();
    const [data, templates] = await Promise.all([
      db.couple.findUnique({
      where: { id: coupleId },
      include: { wedding: { include: { sections: true } } },
      }),
      db.template.findMany({ orderBy: { createdAt: "asc" } }),
    ]);
    return NextResponse.json({ ...data, templates });
  } catch {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }
}

export async function PUT(req: Request) {
  try {
    const { coupleId, userId } = await requireCoupleContext();
    const body = await req.json();
    const eventDateRaw = typeof body.eventDate === "string" ? body.eventDate.trim() : "";
    const eventDate = eventDateRaw ? new Date(`${eventDateRaw}T12:00:00`) : null;
    const wedding = await db.wedding.update({
      where: { coupleId },
      data: {
        title: body.title,
        subtitle: body.subtitle,
        story: body.story,
        location: body.location,
        eventDate: eventDate && !Number.isNaN(eventDate.getTime()) ? eventDate : null,
        published: Boolean(body.published),
        rsvpRestricted: Boolean(body.rsvpRestricted),
        isRsvpOpen: Boolean(body.isRsvpOpen),
        templateId: body.templateId ?? undefined,
      },
    });
    await logAudit({ action: "SITE_UPDATED", entity: "Wedding", entityId: wedding.id, userId, coupleId });
    return NextResponse.json(wedding);
  } catch {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }
}
