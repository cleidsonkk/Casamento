"use client";

import { useEffect, useMemo, useState } from "react";
import { toast } from "sonner";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { formatCentsToInput, parseCurrencyInputToCents } from "@/lib/currency";
import { getGiftImageUrl } from "@/lib/gift-image";
import { SmartImage } from "@/components/public/smart-image";

type GiftItem = {
  catalogItemId: string;
  title: string;
  category: string;
  imageUrl?: string | null;
  active: boolean;
  priceCents: number;
  priceInput: string;
  giftMode: "UNIQUE" | "REPEATABLE";
};

type DashboardGift = {
  catalogItemId: string;
  active: boolean;
  priceCents: number;
  giftMode: "UNIQUE" | "REPEATABLE";
};

type CatalogItem = {
  id: string;
  title: string;
  category: string;
  imageUrl?: string | null;
};

type GiftsResponse = {
  gifts?: DashboardGift[];
  catalog?: CatalogItem[];
};

const PAGE_SIZE = 24;

export default function GiftsDashboardPage() {
  const [rows, setRows] = useState<GiftItem[]>([]);
  const [query, setQuery] = useState("");
  const [page, setPage] = useState(1);

  useEffect(() => {
    fetch("/api/dashboard/gifts")
      .then((r) => r.json() as Promise<GiftsResponse>)
      .then((data) => {
        const map = new Map<string, DashboardGift>((data.gifts ?? []).map((g) => [g.catalogItemId, g]));
        const merged = (data.catalog ?? []).map((item) => {
          const mappedGift = map.get(item.id);
          const cents = mappedGift?.priceCents ?? 10000;
          return {
            catalogItemId: item.id,
            title: item.title,
            category: item.category,
            imageUrl: item.imageUrl ?? null,
            active: mappedGift?.active ?? false,
            priceCents: cents,
            priceInput: formatCentsToInput(cents),
            giftMode: mappedGift?.giftMode ?? "UNIQUE",
          };
        });
        setRows(merged);
      });
  }, []);

  const filtered = useMemo(() => {
    const q = query.toLowerCase().trim();
    if (!q) return rows;
    return rows.filter((row) => `${row.title} ${row.category}`.toLowerCase().includes(q));
  }, [rows, query]);

  const totalPages = Math.max(1, Math.ceil(filtered.length / PAGE_SIZE));
  const currentPage = Math.min(page, totalPages);
  const pagedRows = filtered.slice((currentPage - 1) * PAGE_SIZE, currentPage * PAGE_SIZE);

  async function save() {
    const items = rows.map((row) => ({
      catalogItemId: row.catalogItemId,
      active: row.active,
      priceCents: parseCurrencyInputToCents(row.priceInput),
      giftMode: row.giftMode,
    }));
    const res = await fetch("/api/dashboard/gifts", {
      method: "PUT",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ items }),
    });
    if (!res.ok) return toast.error("Falha ao salvar presentes");
    setRows((old) =>
      old.map((row) => {
        const cents = parseCurrencyInputToCents(row.priceInput);
        return { ...row, priceCents: cents, priceInput: formatCentsToInput(cents) };
      }),
    );
    toast.success("Presentes atualizados");
  }

  return (
    <Card className="border-white/80 bg-white/80 p-4 shadow-[0_24px_55px_-40px_rgba(0,0,0,.45)] backdrop-blur md:p-5">
      <div className="mb-3 flex flex-col gap-3 md:flex-row md:items-center md:justify-between">
        <div>
          <h1 className="text-3xl">Presentes</h1>
          <p className="text-sm text-[var(--color-muted)]">Catalogo completo com paginacao</p>
        </div>
        <Button onClick={save}>Salvar</Button>
      </div>

      <input
        value={query}
        onChange={(e) => {
          setQuery(e.target.value);
          setPage(1);
        }}
        placeholder="Buscar presente"
        className="mb-3 h-11 w-full rounded-xl border bg-white/90 px-3 text-sm outline-none"
      />

      <p className="mb-3 text-sm text-[var(--color-muted)]">
        Valores em Real brasileiro. Aceita virgula ou ponto (ex: 120,50 ou 120.50).
      </p>

      <div className="space-y-2">
        {pagedRows.map((row) => {
          const idx = rows.findIndex((item) => item.catalogItemId === row.catalogItemId);
          return (
            <div key={row.catalogItemId} className="grid grid-cols-1 items-center gap-2 rounded-xl border bg-white/90 p-3 text-sm lg:grid-cols-12">
              <label className="md:col-span-1">
                <input
                  type="checkbox"
                  checked={row.active}
                  onChange={(e) =>
                    setRows((old) => old.map((r, i) => (i === idx ? { ...r, active: e.target.checked } : r)))
                  }
                />
                <span className="ml-2 lg:hidden">Ativar</span>
              </label>

              <div className="flex items-center gap-2 lg:col-span-5">
                <SmartImage
                  src={getGiftImageUrl(row.imageUrl, row.title, row.category)}
                  alt={row.title}
                  className="h-10 w-10 rounded-lg border object-cover"
                />
                <div>
                  <span>{row.title}</span>
                  <p className="text-xs text-[var(--color-muted)]">{row.category}</p>
                </div>
              </div>

              <div className="flex items-center rounded-lg border bg-white px-2 lg:col-span-3">
                <span className="mr-1 text-[var(--color-muted)]">R$</span>
                <input
                  className="w-full py-1 outline-none"
                  type="text"
                  inputMode="decimal"
                  value={row.priceInput}
                  onChange={(e) =>
                    setRows((old) =>
                      old.map((r, i) =>
                        i === idx ? { ...r, priceInput: e.target.value.replace(/[^\d.,]/g, "") } : r,
                      ),
                    )
                  }
                />
              </div>

              <select
                className="rounded-lg border px-2 py-2 lg:col-span-3"
                value={row.giftMode}
                onChange={(e) =>
                  setRows((old) =>
                    old.map((r, i) =>
                      i === idx ? { ...r, giftMode: e.target.value as "UNIQUE" | "REPEATABLE" } : r,
                    ),
                  )
                }
              >
                <option value="UNIQUE">UNIQUE</option>
                <option value="REPEATABLE">REPEATABLE</option>
              </select>
            </div>
          );
        })}
      </div>

      <div className="mt-4 flex flex-col gap-2 sm:flex-row sm:items-center sm:justify-between">
        <p className="text-sm text-[var(--color-muted)]">
          Exibindo {(currentPage - 1) * PAGE_SIZE + 1} - {Math.min(currentPage * PAGE_SIZE, filtered.length)} de {filtered.length}
        </p>
        <div className="flex items-center gap-2">
          <Button type="button" variant="outline" onClick={() => setPage((p) => Math.max(1, p - 1))}>
            Anterior
          </Button>
          <span className="text-sm">{currentPage}/{totalPages}</span>
          <Button type="button" variant="outline" onClick={() => setPage((p) => Math.min(totalPages, p + 1))}>
            Proxima
          </Button>
        </div>
      </div>
    </Card>
  );
}
