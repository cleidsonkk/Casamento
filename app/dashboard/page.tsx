import { db } from "@/lib/db";
import { requireCoupleContext } from "@/lib/currentUser";
import { Card } from "@/components/ui/card";
import { OrdersChart } from "@/components/dashboard/orders-chart";

export default async function DashboardPage() {
  const { coupleId } = await requireCoupleContext();
  const [rsvps, orders, gifts] = await Promise.all([
    db.rsvp.findMany({ where: { coupleId } }),
    db.giftOrder.findMany({ where: { coupleId } }),
    db.weddingGift.findMany({ where: { coupleId, active: true } }),
  ]);
  const byStatus = Object.entries(
    orders.reduce<Record<string, number>>((acc, o) => {
      acc[o.status] = (acc[o.status] ?? 0) + 1;
      return acc;
    }, {}),
  ).map(([status, total]) => ({ status, total }));

  return (
    <section className="space-y-6">
      <div className="grid gap-4 md:grid-cols-3">
        <Card className="p-5">
          <p className="text-sm text-[var(--color-muted)]">RSVPs</p>
          <p className="text-4xl">{rsvps.length}</p>
        </Card>
        <Card className="p-5">
          <p className="text-sm text-[var(--color-muted)]">Pedidos</p>
          <p className="text-4xl">{orders.length}</p>
        </Card>
        <Card className="p-5">
          <p className="text-sm text-[var(--color-muted)]">Presentes ativos</p>
          <p className="text-4xl">{gifts.length}</p>
        </Card>
      </div>
      <Card className="p-5">
        <h2 className="mb-2 text-2xl">Pedidos por status</h2>
        <OrdersChart data={byStatus} />
      </Card>
    </section>
  );
}
