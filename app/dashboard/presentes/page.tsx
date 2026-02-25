"use client";

import { useEffect, useState } from "react";
import { toast } from "sonner";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";

type GiftItem = { catalogItemId: string; title: string; active: boolean; priceCents: number; giftMode: "UNIQUE" | "REPEATABLE" };

export default function GiftsDashboardPage() {
  const [rows, setRows] = useState<GiftItem[]>([]);

  useEffect(() => {
    fetch("/api/dashboard/gifts")
      .then((r) => r.json())
      .then((data) => {
        const map = new Map<string, any>((data.gifts ?? []).map((g: any) => [g.catalogItemId, g]));
        const merged = (data.catalog ?? []).slice(0, 50).map((item: any) => ({
          catalogItemId: item.id,
          title: item.title,
          active: map.get(item.id)?.active ?? false,
          priceCents: map.get(item.id)?.priceCents ?? 10000,
          giftMode: map.get(item.id)?.giftMode ?? "UNIQUE",
        }));
        setRows(merged);
      });
  }, []);

  async function save() {
    const res = await fetch("/api/dashboard/gifts", {
      method: "PUT",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ items: rows }),
    });
    if (!res.ok) return toast.error("Falha ao salvar presentes");
    toast.success("Presentes atualizados");
  }

  return (
    <Card className="p-5">
      <div className="mb-3 flex items-center justify-between">
        <h1 className="text-3xl">Presentes</h1>
        <Button onClick={save}>Salvar</Button>
      </div>
      <div className="space-y-2">
        {rows.map((row, idx) => (
          <div key={row.catalogItemId} className="grid grid-cols-12 items-center gap-2 rounded-xl border p-2 text-sm">
            <label className="col-span-1"><input type="checkbox" checked={row.active} onChange={(e) => setRows((old) => old.map((r, i) => (i === idx ? { ...r, active: e.target.checked } : r)))} /></label>
            <span className="col-span-6">{row.title}</span>
            <input className="col-span-2 rounded-lg border px-2 py-1" type="number" value={row.priceCents} onChange={(e) => setRows((old) => old.map((r, i) => (i === idx ? { ...r, priceCents: Number(e.target.value) } : r)))} />
            <select className="col-span-3 rounded-lg border px-2 py-1" value={row.giftMode} onChange={(e) => setRows((old) => old.map((r, i) => (i === idx ? { ...r, giftMode: e.target.value as "UNIQUE" | "REPEATABLE" } : r)))}>
              <option value="UNIQUE">UNIQUE</option>
              <option value="REPEATABLE">REPEATABLE</option>
            </select>
          </div>
        ))}
      </div>
    </Card>
  );
}

