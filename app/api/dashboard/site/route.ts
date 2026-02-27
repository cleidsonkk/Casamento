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
        include: {
          wedding: {
            include: {
              sections: true,
              gallery: { orderBy: { order: "asc" } },
            },
          },
        },
      }),
      db.template.findMany({ orderBy: { createdAt: "asc" } }),
    ]);

    const heroImageUrl = data?.wedding?.sections.find((section) => section.type === "HERO_IMAGE")?.content ?? "";

    return NextResponse.json({ ...data, templates, heroImageUrl, gallery: data?.wedding?.gallery ?? [] });
  } catch {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }
}

export async function PUT(req: Request) {
  try {
    const { coupleId, userId } = await requireCoupleContext();
    const body = await req.json();

    const currentWedding = await db.wedding.findUnique({
      where: { coupleId },
      select: { id: true },
    });
    if (!currentWedding) return NextResponse.json({ error: "Wedding not found" }, { status: 404 });

    const eventDateRaw = typeof body.eventDate === "string" ? body.eventDate.trim() : "";
    const eventDate = eventDateRaw ? new Date(`${eventDateRaw}T12:00:00`) : null;

    const updateData: Record<string, unknown> = {};
    if ("title" in body) updateData.title = body.title;
    if ("subtitle" in body) updateData.subtitle = body.subtitle;
    if ("story" in body) updateData.story = body.story;
    if ("location" in body) updateData.location = body.location;
    if ("eventDate" in body) updateData.eventDate = eventDate && !Number.isNaN(eventDate.getTime()) ? eventDate : null;
    if ("published" in body) updateData.published = Boolean(body.published);
    if ("rsvpRestricted" in body) updateData.rsvpRestricted = Boolean(body.rsvpRestricted);
    if ("isRsvpOpen" in body) updateData.isRsvpOpen = Boolean(body.isRsvpOpen);
    if ("templateId" in body) updateData.templateId = body.templateId || null;

    const heroImageUrl = typeof body.heroImageUrl === "string" ? body.heroImageUrl.trim() : "";
    const galleryUrls = Array.isArray(body.galleryUrls)
      ? body.galleryUrls.filter((item: unknown) => typeof item === "string" && item.trim().length > 0)
      : null;

    const wedding = await db.$transaction(async (tx) => {
      const updated = await tx.wedding.update({
        where: { coupleId },
        data: updateData,
      });

      if (heroImageUrl) {
        const existingHero = await tx.weddingSection.findFirst({
          where: { weddingId: currentWedding.id, type: "HERO_IMAGE" },
          select: { id: true },
        });

        if (existingHero) {
          await tx.weddingSection.update({
            where: { id: existingHero.id },
            data: { content: heroImageUrl, enabled: true },
          });
        } else {
          await tx.weddingSection.create({
            data: {
              weddingId: currentWedding.id,
              type: "HERO_IMAGE",
              title: "Foto principal",
              content: heroImageUrl,
              order: 0,
              enabled: true,
            },
          });
        }
      }

      if (galleryUrls) {
        await tx.galleryPhoto.deleteMany({ where: { weddingId: currentWedding.id } });
        if (galleryUrls.length > 0) {
          await tx.galleryPhoto.createMany({
            data: galleryUrls.map((url: string, index: number) => ({
              weddingId: currentWedding.id,
              imageUrl: url,
              order: index,
            })),
          });
        }
      }

      return updated;
    });

    await logAudit({
      action: "SITE_UPDATED",
      entity: "Wedding",
      entityId: wedding.id,
      userId,
      coupleId,
      metadata: {
        heroImageUpdated: Boolean(heroImageUrl),
        galleryUpdated: Array.isArray(galleryUrls),
        galleryCount: galleryUrls?.length,
      },
    });

    return NextResponse.json(wedding);
  } catch {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }
}
