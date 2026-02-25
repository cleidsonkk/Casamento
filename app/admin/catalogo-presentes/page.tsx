"use client";

import { useEffect, useState } from "react";
import { Card } from "@/components/ui/card";

type Item = { id: string; title: string; category: string; imageStyle: string };

export default function AdminCatalogPage() {
  const [items, setItems] = useState<Item[]>([]);
  useEffect(() => {
    fetch("/api/admin/catalog").then((r) => r.json()).then((d) => setItems(d.items ?? []));
  }, []);
  return (
    <Card className="p-5">
      <h1 className="mb-3 text-3xl">Catálogo global</h1>
      <p className="mb-3 text-sm text-[var(--color-muted)]">{items.length} itens</p>
      <div className="space-y-2">
        {items.map((i) => (
          <div key={i.id} className="grid grid-cols-3 rounded-xl border p-2 text-sm">
            <span>{i.title}</span>
            <span>{i.category}</span>
            <span>{i.imageStyle}</span>
          </div>
        ))}
      </div>
    </Card>
  );
}

