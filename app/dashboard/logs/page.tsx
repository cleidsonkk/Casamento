import { Card } from "@/components/ui/card";
import { db } from "@/lib/db";
import { requireCoupleContext } from "@/lib/currentUser";

const criticalActions = new Set([
  "SITE_UPDATED",
  "GIFTS_UPDATED",
  "PIX_UPDATED",
  "ORDER_CONFIRMED",
  "ORDER_STATUS_UPDATED",
  "ORDER_MARKED_PAID",
  "ORDER_MARKED_CANCELED",
]);

export default async function DashboardLogsPage() {
  const { coupleId } = await requireCoupleContext();
  const logs = await db.auditLog.findMany({
    where: { coupleId },
    orderBy: { createdAt: "desc" },
    take: 100,
    include: { user: { select: { name: true, email: true } } },
  });

  return (
    <Card className="border-white/80 bg-white/80 p-4 shadow-[0_24px_55px_-40px_rgba(0,0,0,.45)] backdrop-blur md:p-5">
      <h1 className="mb-1 text-3xl">Logs de auditoria</h1>
      <p className="mb-4 text-sm text-[var(--color-muted)]">Acoes criticas realizadas no seu painel.</p>

      <div className="space-y-3">
        {logs.map((log) => (
          <div key={log.id} className="rounded-xl border bg-white/90 p-3">
            <div className="flex flex-wrap items-center justify-between gap-2">
              <p className="text-sm font-medium">{log.action}</p>
              <span
                className={`rounded-full px-2 py-1 text-xs ${
                  criticalActions.has(log.action) ? "bg-red-50 text-red-700" : "bg-neutral-100 text-neutral-700"
                }`}
              >
                {criticalActions.has(log.action) ? "Critico" : "Info"}
              </span>
            </div>
            <p className="mt-1 text-sm text-[var(--color-muted)]">
              {log.entity} {log.entityId ? `(${log.entityId.slice(0, 8)})` : ""}
            </p>
            <p className="mt-1 text-xs text-[var(--color-muted)]">
              {new Date(log.createdAt).toLocaleString("pt-BR")} - {log.user?.name || log.user?.email || "Sistema"}
            </p>
          </div>
        ))}
      </div>
    </Card>
  );
}
