import { db } from "@/lib/db";
import { requireCoupleContext } from "@/lib/currentUser";
import { logAudit } from "@/lib/audit";
import { apiError, apiSuccess, createRequestId, logApiError } from "@/lib/api";
import { dashboardPixSchema } from "@/lib/validators";

export async function GET() {
  const requestId = createRequestId();
  try {
    const { coupleId } = await requireCoupleContext();
    const pix = await db.pixSetting.findUnique({ where: { coupleId } });
    return apiSuccess(pix);
  } catch (error) {
    logApiError("dashboard-pix:get", error, requestId);
    return apiError("Unauthorized", { status: 401, code: "UNAUTHORIZED", requestId });
  }
}

export async function PUT(req: Request) {
  const requestId = createRequestId();
  try {
    const { coupleId, userId } = await requireCoupleContext();
    const body = await req.json();
    const parsed = dashboardPixSchema.safeParse(body);
    if (!parsed.success) {
      return apiError("Dados Pix invalidos.", {
        status: 400,
        code: "INVALID_PIX",
        requestId,
        details: parsed.error.flatten(),
      });
    }

    const pix = await db.pixSetting.upsert({
      where: { coupleId },
      update: {
        pixKey: parsed.data.pixKey,
        receiverName: parsed.data.receiverName,
        city: parsed.data.city,
        txidPrefix: parsed.data.txidPrefix.toUpperCase(),
        enabled: parsed.data.enabled,
      },
      create: {
        coupleId,
        pixKey: parsed.data.pixKey,
        receiverName: parsed.data.receiverName,
        city: parsed.data.city,
        txidPrefix: parsed.data.txidPrefix.toUpperCase(),
        enabled: parsed.data.enabled,
      },
    });
    await logAudit({ action: "PIX_UPDATED", entity: "PixSetting", entityId: pix.id, userId, coupleId });
    return apiSuccess(pix);
  } catch (error) {
    logApiError("dashboard-pix:put", error, requestId);
    return apiError("Nao foi possivel salvar a configuracao Pix.", { status: 500, code: "PIX_SAVE_FAILED", requestId });
  }
}
