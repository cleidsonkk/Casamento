"use client";

import { useEffect, useState } from "react";
import { toast } from "sonner";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";

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
    <Card className="p-5">
      <h1 className="mb-4 text-3xl">Pedidos</h1>
      <div className="space-y-2">
        {orders.map((o) => (
          <div key={o.id} className="grid grid-cols-12 items-center gap-2 rounded-xl border p-3 text-sm">
            <span className="col-span-3">{o.giverName}</span>
            <span className="col-span-3">{o.weddingGift.catalogItem.title}</span>
            <span className="col-span-2">{o.status}</span>
            <span className="col-span-2">R$ {(o.amountCents / 100).toFixed(2)}</span>
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

