"use client";

import { useEffect, useMemo, useRef, useState } from "react";
import { createPortal } from "react-dom";
import { AnimatePresence, motion } from "framer-motion";
import { toast } from "sonner";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Badge } from "@/components/ui/badge";
import { Textarea } from "@/components/ui/textarea";
import { formatBRLFromCents } from "@/lib/currency";
import { getGiftImageUrl } from "@/lib/gift-image";
import { SmartImage } from "@/components/public/smart-image";

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
  const PAGE_SIZE = 12;
  const [query, setQuery] = useState("");
  const [category, setCategory] = useState("all");
  const [sort, setSort] = useState<"asc" | "desc" | "alpha">("desc");
  const [selected, setSelected] = useState<Gift | null>(null);
  const [page, setPage] = useState(1);
  const nameInputRef = useRef<HTMLInputElement | null>(null);

  useEffect(() => {
    if (!selected) return;
    const previousOverflow = document.body.style.overflow;
    document.body.style.overflow = "hidden";
    const timeout = window.setTimeout(() => nameInputRef.current?.focus(), 40);

    const onKeyDown = (event: KeyboardEvent) => {
      if (event.key === "Escape") setSelected(null);
    };

    window.addEventListener("keydown", onKeyDown);
    return () => {
      window.clearTimeout(timeout);
      window.removeEventListener("keydown", onKeyDown);
      document.body.style.overflow = previousOverflow;
    };
  }, [selected]);

  const categories = useMemo(() => ["all", ...new Set(items.map((item) => item.category))], [items]);
  const filtered = useMemo(
    () =>
      items
        .filter((item) => (category === "all" ? true : item.category === category))
        .filter((item) => `${item.title} ${item.description}`.toLowerCase().includes(query.toLowerCase()))
        .sort((a, b) => {
          if (sort === "alpha") return a.title.localeCompare(b.title, "pt-BR");
          return sort === "asc" ? a.priceCents - b.priceCents : b.priceCents - a.priceCents;
        }),
    [category, items, query, sort],
  );
  const visibleItems = filtered.slice(0, page * PAGE_SIZE);

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
      <div className="sticky top-4 z-10 rounded-2xl border border-white/70 bg-white/75 p-3 shadow-[0_20px_40px_-30px_rgba(0,0,0,.45)] backdrop-blur">
        <div className="grid gap-3 lg:grid-cols-12">
          <div className="lg:col-span-5">
            <Input
              placeholder="Buscar presente por nome, categoria ou descrição"
              value={query}
              onChange={(e) => {
                setQuery(e.target.value);
                setPage(1);
              }}
              className="h-12 rounded-2xl bg-white/85"
            />
          </div>
          <div className="lg:col-span-4">
            <select
              className="h-12 w-full rounded-2xl border bg-white/85 px-4 text-sm"
              value={category}
              onChange={(e) => {
                setCategory(e.target.value);
                setPage(1);
              }}
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
              onChange={(e) => {
                setSort(e.target.value as "asc" | "desc" | "alpha");
                setPage(1);
              }}
            >
              <option value="desc">Maior valor</option>
              <option value="asc">Menor valor</option>
              <option value="alpha">A-Z</option>
            </select>
          </div>
        </div>

        <div className="mt-3 flex flex-wrap gap-2">
          {categories.map((cat) => (
            <button
              key={cat}
              type="button"
              onClick={() => {
                setCategory(cat);
                setPage(1);
              }}
              className={`rounded-full border px-4 py-2 text-sm transition ${
                category === cat ? "border-black bg-black text-white" : "border-[var(--color-border)] bg-white/85"
              }`}
            >
              {cat === "all" ? "Todas" : cat}
            </button>
          ))}
        </div>
      </div>

      <div className="grid gap-5 md:grid-cols-2 xl:grid-cols-3">
        {visibleItems.map((gift) => (
          <Card key={gift.id} className="group overflow-hidden border-white/80 bg-white/85 p-0 shadow-[0_25px_50px_-35px_rgba(0,0,0,0.5)] transition duration-300 hover:-translate-y-1">
            <div className="relative overflow-hidden">
              <SmartImage
                src={getGiftImageUrl(gift.imageUrl, gift.title, gift.category)}
                alt={gift.title}
                className="h-48 w-full object-cover transition duration-500 group-hover:scale-[1.04]"
                loading="lazy"
              />
              <div className="absolute inset-x-0 bottom-0 bg-gradient-to-t from-black/65 to-transparent px-4 pb-3 pt-8">
                <p className="text-xs text-white/90">{gift.category}</p>
                <p className="text-lg text-white">{gift.title}</p>
              </div>
            </div>

            <div className="space-y-3 p-4">
              <p className="line-clamp-2 text-sm text-[var(--color-muted)]">{gift.description}</p>
              <div className="flex items-center justify-between">
                <strong className="text-2xl tracking-tight">{formatBRLFromCents(gift.priceCents)}</strong>
                <Badge>
                  {gift.state === "disponível"
                    ? "Disponível"
                    : gift.state === "reservado"
                      ? `Reservado (${gift.reservations})`
                      : "Indisponível"}
                </Badge>
              </div>
              <Button
                disabled={gift.state !== "disponível"}
                className="h-11 w-full rounded-xl"
                onClick={() => setSelected(gift)}
              >
                Presentear
              </Button>
            </div>
          </Card>
        ))}
      </div>

      {!filtered.length ? (
        <Card className="rounded-2xl border border-white/80 bg-white/80 p-8 text-center text-[var(--color-muted)]">
          Nenhum presente encontrado com esses filtros.
        </Card>
      ) : null}
      {filtered.length > visibleItems.length ? (
        <div className="flex justify-center">
          <Button
            type="button"
            variant="outline"
            className="rounded-full px-8"
            onClick={() => setPage((old) => old + 1)}
          >
            Carregar mais presentes
          </Button>
        </div>
      ) : null}

      {typeof document !== "undefined"
        ? createPortal(
            <AnimatePresence>
              {selected && (
                <motion.div
                  className="fixed inset-0 z-[120] flex items-center justify-center bg-black/45 p-4"
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  exit={{ opacity: 0 }}
                  onClick={() => setSelected(null)}
                >
                  <motion.div
                    className="max-h-[90vh] w-full max-w-md overflow-y-auto rounded-3xl border border-white/70 bg-white p-5 shadow-[0_40px_90px_-45px_rgba(0,0,0,.65)] md:p-6"
                    initial={{ y: 22, scale: 0.98 }}
                    animate={{ y: 0, scale: 1 }}
                    exit={{ y: 22, scale: 0.98 }}
                    transition={{ duration: 0.2 }}
                    onClick={(event) => event.stopPropagation()}
                  >
                    <h3 className="mb-1 text-2xl">Finalizar presente</h3>
                    <p className="mb-4 text-sm text-[var(--color-muted)]">
                      {selected.title} {" - "} {formatBRLFromCents(selected.priceCents)}
                    </p>
                    <form className="space-y-3" onSubmit={checkout}>
                      <input type="text" name="website" className="hidden" tabIndex={-1} autoComplete="off" />
                      <input
                        ref={nameInputRef}
                        name="name"
                        placeholder="Seu nome"
                        required
                        className="h-11 w-full rounded-[var(--radius-input)] border border-[var(--color-border)] bg-white px-3 text-sm outline-none transition focus:ring-2 focus:ring-[var(--color-primary)]/20"
                      />
                      <Textarea name="message" placeholder="Mensagem para os noivos" className="rounded-2xl" />
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
            </AnimatePresence>,
            document.body,
          )
        : null}
    </div>
  );
}
