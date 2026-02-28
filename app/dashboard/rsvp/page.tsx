"use client";

import { useEffect, useState } from "react";
import { Card } from "@/components/ui/card";

type RSVP = { id: string; guestName: string; status: string; companions: number; createdAt: string };

export default function RsvpDashboardPage() {
  const [items, setItems] = useState<RSVP[]>([]);
  useEffect(() => {
    fetch("/api/dashboard/rsvp").then((r) => r.json()).then((d) => setItems(d.rsvps ?? []));
  }, []);

  return (
    <Card className="border-white/80 bg-white/80 p-4 shadow-[0_24px_55px_-40px_rgba(0,0,0,.45)] backdrop-blur md:p-5">
      <h1 className="mb-4 text-3xl">RSVPs</h1>

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
          <div key={item.id} className="grid grid-cols-4 rounded-xl border bg-white/90 px-3 py-2 text-sm">
            <span>{item.guestName}</span>
            <span>{item.status}</span>
            <span>{item.companions}</span>
            <span>{new Date(item.createdAt).toLocaleDateString("pt-BR")}</span>
          </div>
        ))}
      </div>
    </Card>
  );
}
