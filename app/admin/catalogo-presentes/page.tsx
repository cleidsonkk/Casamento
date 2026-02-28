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
          <div key={i.id} className="rounded-xl border p-3 text-sm md:grid md:grid-cols-3 md:gap-2 md:p-2">
            <p className="break-words">{i.title}</p>
            <p className="break-words text-[var(--color-muted)] md:text-inherit">{i.category}</p>
            <p className="break-words text-[var(--color-muted)] md:text-inherit">{i.imageStyle}</p>
          </div>
        ))}
      </div>
    </Card>
  );
}
