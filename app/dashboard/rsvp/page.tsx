"use client";

import { useEffect, useState } from "react";
import { toast } from "sonner";
import { Card } from "@/components/ui/card";

type RSVP = { id: string; guestName: string; status: string; companions: number; createdAt: string };
type ApiError = { error?: string };

export default function RsvpDashboardPage() {
  const [items, setItems] = useState<RSVP[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    let active = true;
    (async () => {
      setLoading(true);
      try {
        const response = await fetch("/api/dashboard/rsvp");
        const data = (await response.json().catch(() => ({}))) as { rsvps?: RSVP[] } & ApiError;
        if (!response.ok) {
          toast.error(data.error ?? "Falha ao carregar RSVPs");
          return;
        }
        if (active) {
          setItems(data.rsvps ?? []);
        }
      } finally {
        if (active) setLoading(false);
      }
    })();
    return () => {
      active = false;
    };
  }, []);

  return (
    <Card className="border-white/80 bg-white/80 p-4 shadow-[0_24px_55px_-40px_rgba(0,0,0,.45)] backdrop-blur md:p-5">
      <h1 className="mb-4 text-3xl">RSVPs</h1>

      {loading ? (
        <div className="rounded-xl border bg-white/90 p-6 text-center text-sm text-[var(--color-muted)]">Carregando respostas...</div>
      ) : items.length === 0 ? (
        <div className="rounded-xl border bg-white/90 p-6 text-center text-sm text-[var(--color-muted)]">Nenhum RSVP recebido ainda.</div>
      ) : (
        <>
          <div className="space-y-3 lg:hidden">
            {items.map((item) => (
              <div key={item.id} className="rounded-xl border bg-white/90 p-3">
                <p className="font-medium">{item.guestName}</p>
                <div className="mt-2 grid grid-cols-2 gap-2 text-sm">
                  <div>
                    <p className="text-xs text-[var(--color-muted)]">Status</p>
                    <p>{item.status}</p>
                  </div>
                  <div>
                    <p className="text-xs text-[var(--color-muted)]">Acompanhantes</p>
                    <p>{item.companions}</p>
                  </div>
                  <div className="col-span-2">
                    <p className="text-xs text-[var(--color-muted)]">Data</p>
                    <p>{new Date(item.createdAt).toLocaleDateString("pt-BR")}</p>
                  </div>
                </div>
              </div>
            ))}
          </div>

          <div className="hidden space-y-2 lg:block">
            {items.map((item) => (
              <div key={item.id} className="grid grid-cols-4 rounded-xl border bg-white/90 px-3 py-3 text-sm">
                <span className="truncate font-medium">{item.guestName}</span>
                <span>{item.status}</span>
                <span>{item.companions}</span>
                <span>{new Date(item.createdAt).toLocaleDateString("pt-BR")}</span>
              </div>
            ))}
          </div>
        </>
      )}
    </Card>
  );
}
