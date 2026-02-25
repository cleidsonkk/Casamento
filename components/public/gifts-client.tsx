"use client";

import { useMemo, useState } from "react";
import { AnimatePresence, motion } from "framer-motion";
import { toast } from "sonner";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Badge } from "@/components/ui/badge";
import { Textarea } from "@/components/ui/textarea";

type Gift = {
  id: string;
  title: string;
  category: string;
  description: string;
  priceCents: number;
  state: string;
  imageUrl?: string | null;
  reservations: number;
};

export function GiftsClient({ slug, items }: { slug: string; items: Gift[] }) {
  const [query, setQuery] = useState("");
  const [category, setCategory] = useState("all");
  const [sort, setSort] = useState<"asc" | "desc">("asc");
  const [selected, setSelected] = useState<Gift | null>(null);

  const categories = useMemo(() => ["all", ...new Set(items.map((i) => i.category))], [items]);
  const filtered = useMemo(
    () =>
      items
        .filter((i) => (category === "all" ? true : i.category === category))
        .filter((i) => `${i.title} ${i.description}`.toLowerCase().includes(query.toLowerCase()))
        .sort((a, b) => (sort === "asc" ? a.priceCents - b.priceCents : b.priceCents - a.priceCents)),
    [category, items, query, sort],
  );

  async function checkout(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault();
    if (!selected) return;
    const fd = new FormData(e.currentTarget);
    const body = {
      weddingGiftId: selected.id,
      giverName: fd.get("name"),
      message: fd.get("message"),
      hp: fd.get("website"),
    };
    const res = await fetch(`/api/public/${slug}/orders`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(body),
    });
    const data = await res.json();
    if (!res.ok) {
      toast.error(data.error ?? "Erro ao criar pedido");
      return;
    }
    window.location.href = `/${slug}/pix/${data.orderId}`;
  }

  return (
    <div className="space-y-6">
      <div className="grid gap-3 md:grid-cols-4">
        <Input placeholder="Buscar presente..." value={query} onChange={(e) => setQuery(e.target.value)} />
        <select className="h-11 rounded-[var(--radius-input)] border bg-white px-3 text-sm" value={category} onChange={(e) => setCategory(e.target.value)}>
          {categories.map((cat) => (
            <option key={cat} value={cat}>
              {cat === "all" ? "Todas categorias" : cat}
            </option>
          ))}
        </select>
        <select className="h-11 rounded-[var(--radius-input)] border bg-white px-3 text-sm" value={sort} onChange={(e) => setSort(e.target.value as "asc" | "desc")}>
          <option value="asc">Menor valor</option>
          <option value="desc">Maior valor</option>
        </select>
      </div>
      <div className="grid gap-4 md:grid-cols-3">
        {filtered.map((gift) => (
          <Card key={gift.id} className="p-4 transition hover:-translate-y-0.5">
            <div className="mb-3 h-36 rounded-xl bg-gradient-to-br from-neutral-100 to-neutral-50" />
            <p className="text-xs text-[var(--color-muted)]">{gift.category}</p>
            <h3 className="text-xl">{gift.title}</h3>
            <p className="mb-3 mt-1 text-sm text-[var(--color-muted)]">{gift.description}</p>
            <div className="mb-3 flex items-center justify-between">
              <strong>R$ {(gift.priceCents / 100).toFixed(2)}</strong>
              <Badge>
                {gift.state === "disponivel" ? "Disponível" : gift.state === "reservado" ? `Reservado (${gift.reservations})` : "Indisponível"}
              </Badge>
            </div>
            <Button disabled={gift.state !== "disponivel"} className="w-full" onClick={() => setSelected(gift)}>
              Presentear
            </Button>
          </Card>
        ))}
      </div>

      <AnimatePresence>
        {selected && (
          <motion.div className="fixed inset-0 z-50 grid place-items-center bg-black/30 p-4" initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}>
            <motion.div className="w-full max-w-md rounded-2xl bg-white p-5" initial={{ y: 16 }} animate={{ y: 0 }} exit={{ y: 16 }}>
              <h3 className="mb-1 text-2xl">Checkout Pix</h3>
              <p className="mb-4 text-sm text-[var(--color-muted)]">{selected.title}</p>
              <form className="space-y-3" onSubmit={checkout}>
                <input type="text" name="website" className="hidden" tabIndex={-1} autoComplete="off" />
                <Input name="name" placeholder="Seu nome" required />
                <Textarea name="message" placeholder="Mensagem para os noivos" />
                <div className="flex gap-2">
                  <Button type="button" variant="outline" className="w-full" onClick={() => setSelected(null)}>
                    Cancelar
                  </Button>
                  <Button className="w-full">Ir para Pix</Button>
                </div>
              </form>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}

