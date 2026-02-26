import Link from "next/link";
import { db } from "@/lib/db";
import { requireCoupleContext } from "@/lib/currentUser";
import { Card } from "@/components/ui/card";
import { OrdersChart } from "@/components/dashboard/orders-chart";
import { formatBRLFromCents } from "@/lib/currency";

export default async function DashboardPage() {
  const { coupleId } = await requireCoupleContext();
  const [rsvps, orders, gifts, paidSummary] = await Promise.all([
    db.rsvp.findMany({ where: { coupleId } }),
    db.giftOrder.findMany({ where: { coupleId } }),
    db.weddingGift.findMany({ where: { coupleId, active: true } }),
    db.giftOrder.aggregate({
      where: { coupleId, status: "PAID" },
      _sum: { amountCents: true },
    }),
  ]);

  const confirmedRsvps = rsvps.filter((item) => item.status === "YES").length;
  const paidOrders = orders.filter((item) => item.status === "PAID").length;
  const paidAmount = paidSummary._sum.amountCents ?? 0;

  const byStatus = Object.entries(
    orders.reduce<Record<string, number>>((acc, o) => {
      acc[o.status] = (acc[o.status] ?? 0) + 1;
      return acc;
    }, {}),
  ).map(([status, total]) => ({ status, total }));

  return (
    <section className="space-y-6">
      <div className="flex items-end justify-between gap-4">
        <div>
          <p className="text-xs tracking-[0.2em] text-[var(--color-muted)]">VISAO GERAL</p>
          <h1 className="mt-1 text-3xl">Painel dos noivos</h1>
        </div>
        <Link
          href="/dashboard/site"
          className="rounded-full border border-[var(--color-border)] bg-white/75 px-4 py-2 text-sm hover:bg-white"
        >
          Editar site
        </Link>
      </div>

      <div className="grid gap-4 md:grid-cols-3">
        <Card className="relative overflow-hidden border-white/70 bg-[linear-gradient(155deg,rgba(255,255,255,.95),rgba(246,239,227,.8))] p-5 backdrop-blur">
          <div className="pointer-events-none absolute -right-8 -top-8 h-24 w-24 rounded-full bg-[#e8cd9e]/45 blur-2xl" />
          <p className="text-xs tracking-[0.14em] text-[var(--color-muted)]">RSVP</p>
          <p className="mt-2 text-4xl">{rsvps.length}</p>
          <p className="mt-1 text-sm text-[var(--color-muted)]">{confirmedRsvps} confirmados</p>
        </Card>

        <Card className="relative overflow-hidden border-white/70 bg-[linear-gradient(155deg,rgba(255,255,255,.95),rgba(242,247,250,.75))] p-5 backdrop-blur">
          <div className="pointer-events-none absolute -right-8 -top-8 h-24 w-24 rounded-full bg-[#c9dced]/40 blur-2xl" />
          <p className="text-xs tracking-[0.14em] text-[var(--color-muted)]">PEDIDOS</p>
          <p className="mt-2 text-4xl">{orders.length}</p>
          <p className="mt-1 text-sm text-[var(--color-muted)]">{paidOrders} pagos</p>
        </Card>

        <Card className="relative overflow-hidden border-white/70 bg-[linear-gradient(155deg,rgba(255,255,255,.95),rgba(239,247,239,.78))] p-5 backdrop-blur">
          <div className="pointer-events-none absolute -right-8 -top-8 h-24 w-24 rounded-full bg-[#cde7cf]/45 blur-2xl" />
          <p className="text-xs tracking-[0.14em] text-[var(--color-muted)]">PRESENTES</p>
          <p className="mt-2 text-4xl">{gifts.length}</p>
          <p className="mt-1 text-sm text-[var(--color-muted)]">{formatBRLFromCents(paidAmount)} recebidos</p>
        </Card>
      </div>

      <Card className="border-white/70 bg-white/75 p-5 backdrop-blur">
        <h2 className="mb-2 text-2xl">Pedidos por status</h2>
        <OrdersChart data={byStatus} />
      </Card>
    </section>
  );
}
