"use client";

import { useMemo, useState } from "react";
import { AnimatePresence, motion } from "framer-motion";
import { toast } from "sonner";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Badge } from "@/components/ui/badge";
import { Textarea } from "@/components/ui/textarea";
import { formatBRLFromCents } from "@/lib/currency";
import { getGiftImageUrl } from "@/lib/gift-image";

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

  const categories = useMemo(() => ["all", ...new Set(items.map((item) => item.category))], [items]);
  const filtered = useMemo(
    () =>
      items
        .filter((item) => (category === "all" ? true : item.category === category))
        .filter((item) => `${item.title} ${item.description}`.toLowerCase().includes(query.toLowerCase()))
        .sort((a, b) => (sort === "asc" ? a.priceCents - b.priceCents : b.priceCents - a.priceCents)),
    [category, items, query, sort],
  );

  async function checkout(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault();
    if (!selected) return;
    const formData = new FormData(e.currentTarget);
    const body = {
      weddingGiftId: selected.id,
      giverName: formData.get("name"),
      message: formData.get("message"),
      hp: formData.get("website"),
    };
    const res = await fetch(`/api/public/${slug}/orders`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(body),
    });
    const data = await res.json();
    if (!res.ok) return toast.error(data.error ?? "Falha ao iniciar checkout");
    window.location.href = `/${slug}/pix/${data.orderId}`;
  }

  return (
    <div className="space-y-6">
      <div className="grid gap-3 lg:grid-cols-12">
        <div className="lg:col-span-5">
          <Input
            placeholder="Buscar presente por nome, categoria ou descricao"
            value={query}
            onChange={(e) => setQuery(e.target.value)}
            className="h-12 rounded-2xl bg-white/85"
          />
        </div>
        <div className="lg:col-span-4">
          <select
            className="h-12 w-full rounded-2xl border bg-white/85 px-4 text-sm"
            value={category}
            onChange={(e) => setCategory(e.target.value)}
          >
            {categories.map((cat) => (
              <option key={cat} value={cat}>
                {cat === "all" ? "Todas as categorias" : cat}
              </option>
            ))}
          </select>
        </div>
        <div className="lg:col-span-3">
          <select
            className="h-12 w-full rounded-2xl border bg-white/85 px-4 text-sm"
            value={sort}
            onChange={(e) => setSort(e.target.value as "asc" | "desc")}
          >
            <option value="asc">Menor valor</option>
            <option value="desc">Maior valor</option>
          </select>
        </div>
      </div>

      <div className="flex flex-wrap gap-2">
        {categories.map((cat) => (
          <button
            key={cat}
            type="button"
            onClick={() => setCategory(cat)}
            className={`rounded-full border px-4 py-2 text-sm transition ${
              category === cat ? "border-black bg-black text-white" : "border-[var(--color-border)] bg-white/85"
            }`}
          >
            {cat === "all" ? "Todas" : cat}
          </button>
        ))}
      </div>

      <div className="grid gap-5 md:grid-cols-2 xl:grid-cols-3">
        {filtered.map((gift) => (
          <Card key={gift.id} className="overflow-hidden border-white/80 bg-white/85 p-0 shadow-[0_25px_50px_-35px_rgba(0,0,0,0.5)]">
            <div className="relative">
              <img
                src={getGiftImageUrl(gift.imageUrl, gift.title, gift.category)}
                alt={gift.title}
                className="h-48 w-full object-cover transition duration-500 hover:scale-[1.03]"
                loading="lazy"
              />
              <div className="absolute inset-x-0 bottom-0 bg-gradient-to-t from-black/55 to-transparent px-4 pb-3 pt-8">
                <p className="text-xs text-white/90">{gift.category}</p>
                <p className="text-lg text-white">{gift.title}</p>
              </div>
            </div>

            <div className="space-y-3 p-4">
              <p className="line-clamp-2 text-sm text-[var(--color-muted)]">{gift.description}</p>
              <div className="flex items-center justify-between">
                <strong className="text-2xl tracking-tight">{formatBRLFromCents(gift.priceCents)}</strong>
                <Badge>
                  {gift.state === "disponivel"
                    ? "Disponivel"
                    : gift.state === "reservado"
                      ? `Reservado (${gift.reservations})`
                      : "Indisponivel"}
                </Badge>
              </div>
              <Button
                disabled={gift.state !== "disponivel"}
                className="h-11 w-full rounded-xl"
                onClick={() => setSelected(gift)}
              >
                Presentear
              </Button>
            </div>
          </Card>
        ))}
      </div>

      <AnimatePresence>
        {selected && (
          <motion.div
            className="fixed inset-0 z-50 grid place-items-center bg-black/35 p-4"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
          >
            <motion.div
              className="w-full max-w-md rounded-3xl border bg-white p-6 shadow-2xl"
              initial={{ y: 20, scale: 0.98 }}
              animate={{ y: 0, scale: 1 }}
              exit={{ y: 20, scale: 0.98 }}
            >
              <h3 className="mb-1 text-2xl">Finalizar presente</h3>
              <p className="mb-4 text-sm text-[var(--color-muted)]">
                {selected.title} • {formatBRLFromCents(selected.priceCents)}
              </p>
              <form className="space-y-3" onSubmit={checkout}>
                <input type="text" name="website" className="hidden" tabIndex={-1} autoComplete="off" />
                <Input name="name" placeholder="Seu nome" required />
                <Textarea name="message" placeholder="Mensagem para os noivos" />
                <div className="grid grid-cols-2 gap-2">
                  <Button type="button" variant="outline" className="h-11 rounded-xl" onClick={() => setSelected(null)}>
                    Cancelar
                  </Button>
                  <Button className="h-11 rounded-xl">Ir para Pix</Button>
                </div>
              </form>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}

