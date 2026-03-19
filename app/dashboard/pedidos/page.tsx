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
type ApiError = { error?: string };

export default function OrdersDashboardPage() {
  const [orders, setOrders] = useState<Order[]>([]);
  const [loading, setLoading] = useState(true);
  const [updatingId, setUpdatingId] = useState<string | null>(null);

  async function load() {
    setLoading(true);
    try {
      const response = await fetch("/api/dashboard/orders");
      const data = (await response.json().catch(() => ({}))) as { orders?: Order[] } & ApiError;
      if (!response.ok) {
        toast.error(data.error ?? "Falha ao carregar pedidos");
        return;
      }
      setOrders(data.orders ?? []);
    } finally {
      setLoading(false);
    }
  }

  useEffect(() => {
    void load();
  }, []);

  async function confirm(id: string, status: "PAID" | "CANCELED") {
    if (updatingId) return;
    setUpdatingId(id);
    try {
      const res = await fetch(`/api/dashboard/orders/${id}/confirm`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ status }),
      });
      const data = (await res.json().catch(() => ({}))) as ApiError;
      if (!res.ok) {
        toast.error(data.error ?? "Falha ao atualizar pedido");
        return;
      }
      toast.success(`Pedido marcado como ${status}`);
      await load();
    } finally {
      setUpdatingId(null);
    }
  }

  return (
    <Card className="border-white/80 bg-white/80 p-4 shadow-[0_24px_55px_-40px_rgba(0,0,0,.45)] backdrop-blur md:p-5">
      <h1 className="mb-4 text-3xl">Pedidos</h1>

      {loading ? (
        <div className="rounded-xl border bg-white/90 p-6 text-center text-sm text-[var(--color-muted)]">Carregando pedidos...</div>
      ) : orders.length === 0 ? (
        <div className="rounded-xl border bg-white/90 p-6 text-center text-sm text-[var(--color-muted)]">Nenhum pedido recebido ainda.</div>
      ) : (
        <>
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
                <div className="mt-3 flex flex-col gap-2 sm:flex-row">
                  <Button variant="outline" className="flex-1" disabled={updatingId === o.id} onClick={() => confirm(o.id, "CANCELED")}>
                    {updatingId === o.id ? "Atualizando..." : "Cancelar"}
                  </Button>
                  <Button className="flex-1" disabled={updatingId === o.id} onClick={() => confirm(o.id, "PAID")}>
                    {updatingId === o.id ? "Atualizando..." : "Pago"}
                  </Button>
                </div>
              </div>
            ))}
          </div>

          <div className="hidden space-y-2 lg:block">
            {orders.map((o) => (
              <div key={o.id} className="grid grid-cols-12 items-center gap-3 rounded-xl border bg-white/90 p-3 text-sm">
                <span className="col-span-3 truncate font-medium">{o.giverName}</span>
                <span className="col-span-3 truncate">{o.weddingGift.catalogItem.title}</span>
                <span className="col-span-2">{o.status}</span>
                <span className="col-span-2">{formatBRLFromCents(o.amountCents)}</span>
                <div className="col-span-2 flex gap-2">
                  <Button variant="outline" disabled={updatingId === o.id} onClick={() => confirm(o.id, "CANCELED")}>Cancelar</Button>
                  <Button disabled={updatingId === o.id} onClick={() => confirm(o.id, "PAID")}>Pago</Button>
                </div>
              </div>
            ))}
          </div>
        </>
      )}
    </Card>
  );
}
