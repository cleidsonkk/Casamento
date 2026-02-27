import { NextResponse } from "next/server";
import type { Prisma } from "@prisma/client";
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
    const heroVideoUrl = data?.wedding?.sections.find((section) => section.type === "HERO_VIDEO")?.content ?? "";
    const eventSchedule = data?.wedding?.sections.find((section) => section.type === "EVENT_SCHEDULE")?.content ?? "";
    const dressCode = data?.wedding?.sections.find((section) => section.type === "DRESS_CODE")?.content ?? "";
    const mapLink = data?.wedding?.sections.find((section) => section.type === "MAP_LINK")?.content ?? "";
    const weddingParty = data?.wedding?.sections.find((section) => section.type === "WEDDING_PARTY")?.content ?? "";

    return NextResponse.json({
      ...data,
      templates,
      heroImageUrl,
      heroVideoUrl,
      eventSchedule,
      dressCode,
      mapLink,
      weddingParty,
      gallery: data?.wedding?.gallery ?? [],
    });
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
    const currentWeddingId = currentWedding.id;

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
    const heroVideoUrl = typeof body.heroVideoUrl === "string" ? body.heroVideoUrl.trim() : "";
    const eventSchedule = typeof body.eventSchedule === "string" ? body.eventSchedule.trim() : "";
    const dressCode = typeof body.dressCode === "string" ? body.dressCode.trim() : "";
    const mapLink = typeof body.mapLink === "string" ? body.mapLink.trim() : "";
    const weddingParty = typeof body.weddingParty === "string" ? body.weddingParty.trim() : "";

    const galleryUrls = Array.isArray(body.galleryUrls)
      ? body.galleryUrls.filter((item: unknown) => typeof item === "string" && item.trim().length > 0)
      : null;

    async function upsertSection(tx: Prisma.TransactionClient, type: string, title: string, content: string, order: number) {
      const existing = await tx.weddingSection.findFirst({
        where: { weddingId: currentWeddingId, type },
        select: { id: true },
      });

      if (existing) {
        await tx.weddingSection.update({
          where: { id: existing.id },
          data: { content, title, order, enabled: true },
        });
      } else if (content) {
        await tx.weddingSection.create({
          data: { weddingId: currentWeddingId, type, title, content, order, enabled: true },
        });
      }
    }

    const wedding = await db.$transaction(async (tx) => {
      const updated = await tx.wedding.update({
        where: { coupleId },
        data: updateData,
      });

      if (heroImageUrl) await upsertSection(tx, "HERO_IMAGE", "Foto principal", heroImageUrl, 0);
      if (heroVideoUrl) await upsertSection(tx, "HERO_VIDEO", "Video principal", heroVideoUrl, 1);
      await upsertSection(tx, "EVENT_SCHEDULE", "Cronograma", eventSchedule, 2);
      await upsertSection(tx, "DRESS_CODE", "Dress code", dressCode, 3);
      await upsertSection(tx, "MAP_LINK", "Mapa", mapLink, 4);
      await upsertSection(tx, "WEDDING_PARTY", "Padrinhos", weddingParty, 5);

      if (galleryUrls) {
        await tx.galleryPhoto.deleteMany({ where: { weddingId: currentWeddingId } });
        if (galleryUrls.length > 0) {
          await tx.galleryPhoto.createMany({
            data: galleryUrls.map((url: string, index: number) => ({
              weddingId: currentWeddingId,
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
        heroVideoUpdated: Boolean(heroVideoUrl),
        galleryUpdated: Array.isArray(galleryUrls),
        galleryCount: galleryUrls?.length,
      },
    });

    return NextResponse.json(wedding);
  } catch {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }
}
