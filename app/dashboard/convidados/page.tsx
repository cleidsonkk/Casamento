"use client";

import { useEffect, useState } from "react";
import { toast } from "sonner";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { Input } from "@/components/ui/input";

type Guest = { id: string; fullName: string; maxCompanions: number };

export default function GuestsPage() {
  const [guests, setGuests] = useState<Guest[]>([]);
  const [csv, setCsv] = useState("");

  const load = () => fetch("/api/dashboard/guests").then((r) => r.json()).then((d) => setGuests(d.guests ?? []));
  useEffect(() => void load(), []);

  async function create(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault();
    const fd = new FormData(e.currentTarget);
    const res = await fetch("/api/dashboard/guests", {
      method: "POST",
      body: JSON.stringify({ fullName: fd.get("fullName"), maxCompanions: Number(fd.get("maxCompanions") || 0) }),
    });
    if (!res.ok) return toast.error("Falha ao criar convidado");
    toast.success("Convidado criado");
    e.currentTarget.reset();
    load();
  }

  async function importCsv() {
    const res = await fetch("/api/dashboard/guests/import", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ csv }),
    });
    const data = await res.json();
    if (!res.ok) return toast.error("Falha no import");
    toast.success(`${data.imported} convidados importados`);
    setCsv("");
    load();
  }

  return (
    <div className="space-y-4">
      <Card className="p-5">
        <h1 className="mb-3 text-2xl">Convidados</h1>
        <form className="grid gap-3 md:grid-cols-3" onSubmit={create}>
          <Input name="fullName" placeholder="Nome completo" required />
          <Input name="maxCompanions" type="number" min={0} max={10} placeholder="Acompanhantes" />
          <Button>Cadastrar</Button>
        </form>
      </Card>
      <Card className="p-5">
        <h2 className="mb-2 text-xl">Importar CSV</h2>
        <textarea value={csv} onChange={(e) => setCsv(e.target.value)} className="mb-2 min-h-32 w-full rounded-xl border p-3 text-sm" placeholder="fullName,maxCompanions" />
        <Button onClick={importCsv}>Importar</Button>
      </Card>
      <Card className="p-5">
        <p className="mb-3 text-sm text-[var(--color-muted)]">Total: {guests.length}</p>
        <div className="space-y-2">
          {guests.map((g) => (
            <div key={g.id} className="flex items-center justify-between rounded-xl border px-3 py-2">
              <span>{g.fullName}</span>
              <span className="text-sm text-[var(--color-muted)]">Acompanhantes: {g.maxCompanions}</span>
            </div>
          ))}
        </div>
      </Card>
    </div>
  );
}

