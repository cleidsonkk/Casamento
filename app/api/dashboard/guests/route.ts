import { db } from "@/lib/db";
import { requireCoupleContext } from "@/lib/currentUser";
import { logAudit } from "@/lib/audit";
import { normalizeName } from "@/lib/slug";
import { apiError, apiSuccess, createRequestId, logApiError } from "@/lib/api";
import { dashboardGuestSchema } from "@/lib/validators";

export async function GET() {
  const requestId = createRequestId();
  try {
    const { coupleId } = await requireCoupleContext();
    const guests = await db.guest.findMany({ where: { coupleId }, orderBy: { createdAt: "desc" } });
    return apiSuccess({ guests });
  } catch (error) {
    logApiError("dashboard-guests:get", error, requestId);
    return apiError("Unauthorized", { status: 401, code: "UNAUTHORIZED", requestId });
  }
}

export async function POST(req: Request) {
  const requestId = createRequestId();
  try {
    const { coupleId, userId } = await requireCoupleContext();
    const body = await req.json();
    const parsed = dashboardGuestSchema.safeParse(body);
    if (!parsed.success) {
      return apiError("Dados invalidos para convidado.", {
        status: 400,
        code: "INVALID_GUEST",
        requestId,
        details: parsed.error.flatten(),
      });
    }

    const guest = await db.guest.create({
      data: {
        coupleId,
        fullName: parsed.data.fullName,
        normalizedName: normalizeName(parsed.data.fullName),
        maxCompanions: parsed.data.maxCompanions,
        passcode: parsed.data.passcode || null,
      },
    });
    await logAudit({ action: "GUEST_CREATED", entity: "Guest", entityId: guest.id, userId, coupleId });
    return apiSuccess(guest);
  } catch (error) {
    logApiError("dashboard-guests:post", error, requestId);
    return apiError("Nao foi possivel cadastrar o convidado.", { status: 500, code: "GUEST_CREATE_FAILED", requestId });
  }
}

export async function DELETE(req: Request) {
  const requestId = createRequestId();
  try {
    const { coupleId, userId } = await requireCoupleContext();
    const url = new URL(req.url);
    const id = url.searchParams.get("id");
    if (!id) {
      return apiError("id obrigatorio", { status: 400, code: "MISSING_ID", requestId });
    }
    await db.guest.deleteMany({ where: { id, coupleId } });
    await logAudit({ action: "GUEST_DELETED", entity: "Guest", entityId: id, userId, coupleId });
    return apiSuccess({ ok: true });
  } catch (error) {
    logApiError("dashboard-guests:delete", error, requestId);
    return apiError("Nao foi possivel remover o convidado.", { status: 500, code: "GUEST_DELETE_FAILED", requestId });
  }
}
