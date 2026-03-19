"use client";

import { useEffect, useState } from "react";
import { toast } from "sonner";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";

type Guest = { id: string; fullName: string; maxCompanions: number };
type ApiError = { error?: string };

export default function GuestsPage() {
  const [guests, setGuests] = useState<Guest[]>([]);
  const [csv, setCsv] = useState("");
  const [loading, setLoading] = useState(true);
  const [savingGuest, setSavingGuest] = useState(false);
  const [importing, setImporting] = useState(false);
  const [deletingId, setDeletingId] = useState<string | null>(null);

  async function load() {
    setLoading(true);
    try {
      const response = await fetch("/api/dashboard/guests");
      const data = (await response.json().catch(() => ({}))) as { guests?: Guest[] } & ApiError;
      if (!response.ok) {
        toast.error(data.error ?? "Falha ao carregar convidados");
        return;
      }
      setGuests(data.guests ?? []);
    } finally {
      setLoading(false);
    }
  }

  useEffect(() => {
    void load();
  }, []);

  async function create(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault();
    if (savingGuest) return;
    setSavingGuest(true);
    const fd = new FormData(e.currentTarget);
    try {
      const res = await fetch("/api/dashboard/guests", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ fullName: fd.get("fullName"), maxCompanions: Number(fd.get("maxCompanions") || 0) }),
      });
      const data = (await res.json().catch(() => ({}))) as ApiError;
      if (!res.ok) {
        toast.error(data.error ?? "Falha ao criar convidado");
        return;
      }
      toast.success("Convidado criado");
      e.currentTarget.reset();
      await load();
    } finally {
      setSavingGuest(false);
    }
  }

  async function importCsv() {
    if (!csv.trim() || importing) return;
    setImporting(true);
    try {
      const res = await fetch("/api/dashboard/guests/import", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ csv }),
      });
      const data = (await res.json().catch(() => ({}))) as { imported?: number } & ApiError;
      if (!res.ok) {
        toast.error(data.error ?? "Falha no import");
        return;
      }
      toast.success(`${data.imported ?? 0} convidados importados`);
      setCsv("");
      await load();
    } finally {
      setImporting(false);
    }
  }

  async function removeGuest(id: string) {
    if (deletingId) return;
    setDeletingId(id);
    try {
      const res = await fetch(`/api/dashboard/guests?id=${id}`, { method: "DELETE" });
      const data = (await res.json().catch(() => ({}))) as ApiError;
      if (!res.ok) {
        toast.error(data.error ?? "Falha ao remover convidado");
        return;
      }
      toast.success("Convidado removido");
      await load();
    } finally {
      setDeletingId(null);
    }
  }

  return (
    <div className="space-y-4">
      <Card className="border-white/80 bg-white/80 p-5 shadow-[0_24px_55px_-40px_rgba(0,0,0,.45)] backdrop-blur">
        <h1 className="mb-1 text-3xl">Convidados</h1>
        <p className="mb-3 text-sm text-[var(--color-muted)]">Cadastre convidados individuais ou importe por CSV.</p>
        <form className="grid gap-3 lg:grid-cols-[minmax(0,1fr)_180px_180px]" onSubmit={create}>
          <Input name="fullName" placeholder="Nome completo" required className="h-11 rounded-xl bg-white/90" />
          <Input name="maxCompanions" type="number" min={0} max={10} placeholder="Acompanhantes" className="h-11 rounded-xl bg-white/90" />
          <Button className="h-11 rounded-xl" disabled={savingGuest}>
            {savingGuest ? "Cadastrando..." : "Cadastrar"}
          </Button>
        </form>
      </Card>

      <Card className="border-white/80 bg-white/80 p-5 shadow-[0_24px_55px_-40px_rgba(0,0,0,.45)] backdrop-blur">
        <h2 className="mb-2 text-xl">Importar CSV</h2>
        <Textarea value={csv} onChange={(e) => setCsv(e.target.value)} className="mb-2 min-h-32 rounded-xl bg-white/90" placeholder="fullName,maxCompanions" />
        <Button onClick={importCsv} className="rounded-xl" disabled={importing || !csv.trim()}>
          {importing ? "Importando..." : "Importar"}
        </Button>
      </Card>

      <Card className="border-white/80 bg-white/80 p-5 shadow-[0_24px_55px_-40px_rgba(0,0,0,.45)] backdrop-blur">
        <p className="mb-3 text-sm text-[var(--color-muted)]">Total: {guests.length}</p>
        {loading ? (
          <div className="rounded-xl border bg-white/85 px-3 py-6 text-center text-sm text-[var(--color-muted)]">Carregando convidados...</div>
        ) : guests.length === 0 ? (
          <div className="rounded-xl border bg-white/85 px-3 py-6 text-center text-sm text-[var(--color-muted)]">Nenhum convidado cadastrado ainda.</div>
        ) : (
          <div className="space-y-2">
            {guests.map((g) => (
              <div key={g.id} className="flex flex-col gap-3 rounded-xl border bg-white/85 px-3 py-3 sm:flex-row sm:items-center sm:justify-between">
                <div className="min-w-0">
                  <p className="break-words font-medium">{g.fullName}</p>
                  <p className="text-sm text-[var(--color-muted)]">Acompanhantes: {g.maxCompanions}</p>
                </div>
                <Button type="button" variant="outline" className="w-full sm:w-auto" disabled={deletingId === g.id} onClick={() => removeGuest(g.id)}>
                  {deletingId === g.id ? "Removendo..." : "Remover"}
                </Button>
              </div>
            ))}
          </div>
        )}
      </Card>
    </div>
  );
}
