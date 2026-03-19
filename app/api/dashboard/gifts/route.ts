import { db } from "@/lib/db";
import { requireCoupleContext } from "@/lib/currentUser";
import { logAudit } from "@/lib/audit";
import { apiError, apiSuccess, createRequestId, logApiError } from "@/lib/api";
import { dashboardGiftsSchema } from "@/lib/validators";

export async function GET() {
  const requestId = createRequestId();
  try {
    const { coupleId } = await requireCoupleContext();
    const gifts = await db.weddingGift.findMany({
      where: { coupleId },
      include: { catalogItem: true },
      orderBy: { createdAt: "desc" },
    });
    const catalog = await db.giftCatalogItem.findMany({ orderBy: { createdAt: "asc" } });
    return apiSuccess({ gifts, catalog });
  } catch (error) {
    logApiError("dashboard-gifts:get", error, requestId);
    return apiError("Unauthorized", { status: 401, code: "UNAUTHORIZED", requestId });
  }
}

export async function PUT(req: Request) {
  const requestId = createRequestId();
  try {
    const { coupleId, userId } = await requireCoupleContext();
    const body = await req.json();
    const parsed = dashboardGiftsSchema.safeParse(body);
    if (!parsed.success) {
      return apiError("Dados invalidos para lista de presentes.", {
        status: 400,
        code: "INVALID_GIFTS",
        requestId,
        details: parsed.error.flatten(),
      });
    }

    for (const item of parsed.data.items) {
      await db.weddingGift.upsert({
        where: { coupleId_catalogItemId: { coupleId, catalogItemId: item.catalogItemId } },
        update: { active: item.active, priceCents: item.priceCents, giftMode: item.giftMode },
        create: {
          coupleId,
          catalogItemId: item.catalogItemId,
          active: item.active,
          priceCents: item.priceCents,
          giftMode: item.giftMode,
        },
      });
    }

    await logAudit({
      action: "GIFTS_UPDATED",
      entity: "WeddingGift",
      userId,
      coupleId,
      metadata: { count: parsed.data.items.length },
    });
    return apiSuccess({ ok: true });
  } catch (error) {
    logApiError("dashboard-gifts:put", error, requestId);
    return apiError("Nao foi possivel salvar os presentes.", { status: 500, code: "GIFTS_SAVE_FAILED", requestId });
  }
}
