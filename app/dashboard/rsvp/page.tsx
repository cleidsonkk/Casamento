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
    <Card className="p-5">
      <h1 className="mb-4 text-3xl">RSVPs</h1>
      <div className="space-y-2">
        {items.map((item) => (
          <div key={item.id} className="grid grid-cols-4 rounded-xl border px-3 py-2 text-sm">
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

