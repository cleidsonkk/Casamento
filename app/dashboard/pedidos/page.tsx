"use client";

import { useEffect, useState } from "react";
import { toast } from "sonner";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { formatBRLFromCents } from "@/lib/currency";

type Order = {
  id: string;
  status: string;
  giverName: string;
  amountCents: number;
  weddingGift: { catalogItem: { title: string } };
};

export default function OrdersDashboardPage() {
  const [orders, setOrders] = useState<Order[]>([]);
  const load = () => fetch("/api/dashboard/orders").then((r) => r.json()).then((d) => setOrders(d.orders ?? []));
  useEffect(() => void load(), []);

  async function confirm(id: string, status: "PAID" | "CANCELED") {
    const res = await fetch(`/api/dashboard/orders/${id}/confirm`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ status }),
    });
    if (!res.ok) return toast.error("Falha ao atualizar pedido");
    toast.success(`Pedido marcado como ${status}`);
    load();
  }

  return (
    <Card className="border-white/80 bg-white/80 p-4 shadow-[0_24px_55px_-40px_rgba(0,0,0,.45)] backdrop-blur md:p-5">
      <h1 className="mb-4 text-3xl">Pedidos</h1>

      <div className="space-y-3 lg:hidden">
        {orders.map((o) => (
          <div key={o.id} className="rounded-xl border bg-white/90 p-3">
            <p className="text-xs text-[var(--color-muted)]">Convidado</p>
            <p className="font-medium">{o.giverName}</p>
            <p className="mt-2 text-xs text-[var(--color-muted)]">Presente</p>
            <p>{o.weddingGift.catalogItem.title}</p>
            <div className="mt-2 flex items-center justify-between text-sm">
              <span>{o.status}</span>
              <strong>{formatBRLFromCents(o.amountCents)}</strong>
            </div>
            <div className="mt-3 flex gap-2">
              <Button variant="outline" className="flex-1" onClick={() => confirm(o.id, "CANCELED")}>Cancelar</Button>
              <Button className="flex-1" onClick={() => confirm(o.id, "PAID")}>Pago</Button>
            </div>
          </div>
        ))}
      </div>

      <div className="hidden space-y-2 lg:block">
        {orders.map((o) => (
          <div key={o.id} className="grid grid-cols-12 items-center gap-2 rounded-xl border bg-white/90 p-3 text-sm">
            <span className="col-span-3">{o.giverName}</span>
            <span className="col-span-3">{o.weddingGift.catalogItem.title}</span>
            <span className="col-span-2">{o.status}</span>
            <span className="col-span-2">{formatBRLFromCents(o.amountCents)}</span>
            <div className="col-span-2 flex gap-2">
              <Button variant="outline" onClick={() => confirm(o.id, "CANCELED")}>Cancelar</Button>
              <Button onClick={() => confirm(o.id, "PAID")}>Pago</Button>
            </div>
          </div>
        ))}
      </div>
    </Card>
  );
}
