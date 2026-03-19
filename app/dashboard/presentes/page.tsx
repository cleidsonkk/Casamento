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
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);

  useEffect(() => {
    fetch("/api/dashboard/gifts")
      .then((r) => r.json() as Promise<GiftsResponse & { error?: string }>)
      .then((data) => {
        if (data.error) {
          toast.error(data.error);
          return;
        }
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
      })
      .finally(() => setLoading(false));
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
    if (saving) return;
    const invalidActiveRow = rows.find(
      (row) => row.active && parseCurrencyInputToCents(row.priceInput) < 100,
    );
    if (invalidActiveRow) {
      toast.error(`Defina ao menos R$ 1,00 para "${invalidActiveRow.title}".`);
      return;
    }

    setSaving(true);
    try {
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
      const data = (await res.json().catch(() => ({}))) as { error?: string };
      if (!res.ok) {
        toast.error(data.error ?? "Falha ao salvar presentes");
        return;
      }
      setRows((old) =>
        old.map((row) => {
          const cents = parseCurrencyInputToCents(row.priceInput);
          const normalizedCents = row.active ? Math.max(100, cents) : cents;
          return {
            ...row,
            priceCents: normalizedCents,
            priceInput: normalizedCents > 0 ? formatCentsToInput(normalizedCents) : "",
          };
        }),
      );
      toast.success("Presentes atualizados");
    } catch {
      toast.error("Falha ao salvar presentes");
    } finally {
      setSaving(false);
    }
  }

  return (
    <Card className="border-white/80 bg-white/80 p-4 shadow-[0_24px_55px_-40px_rgba(0,0,0,.45)] backdrop-blur md:p-5">
      <div className="mb-4 flex flex-col gap-3 lg:flex-row lg:items-start lg:justify-between">
        <div className="min-w-0">
          <h1 className="text-3xl">Presentes</h1>
          <p className="text-sm text-[var(--color-muted)]">Catalogo completo com paginacao</p>
        </div>
        <Button className="w-full sm:w-auto" onClick={save} disabled={saving}>
          {saving ? "Salvando..." : "Salvar"}
        </Button>
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

      {loading ? (
        <div className="rounded-xl border bg-white/90 p-6 text-center text-sm text-[var(--color-muted)]">Carregando catalogo de presentes...</div>
      ) : (
      <div className="space-y-2">
        {pagedRows.map((row) => {
          const idx = rows.findIndex((item) => item.catalogItemId === row.catalogItemId);
          const priceInvalid = row.active && parseCurrencyInputToCents(row.priceInput) < 100;
          return (
            <div
              key={row.catalogItemId}
              className="grid grid-cols-1 gap-3 rounded-xl border bg-white/90 p-3 text-sm xl:grid-cols-12 xl:items-center"
            >
              <label className="flex items-center xl:col-span-1">
                <input
                  type="checkbox"
                  checked={row.active}
                  onChange={(e) =>
                    setRows((old) => old.map((r, i) => (i === idx ? { ...r, active: e.target.checked } : r)))
                  }
                />
                <span className="ml-2 xl:hidden">Ativar</span>
              </label>

              <div className="flex min-w-0 items-center gap-3 xl:col-span-5">
                <SmartImage
                  src={getGiftImageUrl(row.imageUrl, row.title, row.category)}
                  alt={row.title}
                  className="h-12 w-12 shrink-0 rounded-lg border object-cover"
                />
                <div className="min-w-0">
                  <span className="block break-words font-medium">{row.title}</span>
                  <p className="text-xs text-[var(--color-muted)]">{row.category}</p>
                </div>
              </div>

              <div className="space-y-1 xl:col-span-3">
                <div
                  className={`flex items-center rounded-lg border bg-white px-2 ${
                    priceInvalid ? "border-red-300 ring-1 ring-red-200" : ""
                  }`}
                >
                  <span className="mr-1 text-[var(--color-muted)]">R$</span>
                  <input
                    className="w-full py-2 outline-none"
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
                {priceInvalid ? (
                  <p className="text-xs text-red-600">Presentes ativos precisam ter pelo menos R$ 1,00.</p>
                ) : null}
              </div>

              <select
                className="rounded-lg border px-3 py-2 xl:col-span-3"
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
      )}

      <div className="mt-4 flex flex-col gap-2 sm:flex-row sm:items-center sm:justify-between">
        <p className="text-sm text-[var(--color-muted)]">
          Exibindo {(currentPage - 1) * PAGE_SIZE + 1} - {Math.min(currentPage * PAGE_SIZE, filtered.length)} de {filtered.length}
        </p>
        <div className="flex flex-wrap items-center gap-2">
          <Button type="button" variant="outline" onClick={() => setPage((p) => Math.max(1, p - 1))} disabled={loading || currentPage === 1}>
            Anterior
          </Button>
          <span className="text-sm">{currentPage}/{totalPages}</span>
          <Button type="button" variant="outline" onClick={() => setPage((p) => Math.min(totalPages, p + 1))} disabled={loading || currentPage === totalPages}>
            Proxima
          </Button>
        </div>
      </div>
    </Card>
  );
}
