"use client";

import { useEffect, useState } from "react";
import { toast } from "sonner";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { Input } from "@/components/ui/input";

type PixForm = {
  pixKey: string;
  receiverName: string;
  city: string;
  txidPrefix: string;
  enabled: boolean;
};
type ApiError = { error?: string };

export default function PixDashboardPage() {
  const [form, setForm] = useState<PixForm>({
    pixKey: "",
    receiverName: "",
    city: "",
    txidPrefix: "WED",
    enabled: true,
  });
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);

  useEffect(() => {
    let active = true;
    (async () => {
      setLoading(true);
      try {
        const response = await fetch("/api/dashboard/pix");
        const data = (await response.json().catch(() => ({}))) as Partial<PixForm> & ApiError;
        if (!response.ok) {
          toast.error(data.error ?? "Falha ao carregar Pix");
          return;
        }
        if (active && data) {
          setForm((old) => ({ ...old, ...data }));
        }
      } finally {
        if (active) setLoading(false);
      }
    })();
    return () => {
      active = false;
    };
  }, []);

  async function save() {
    if (saving) return;
    setSaving(true);
    try {
      const res = await fetch("/api/dashboard/pix", {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(form),
      });
      const data = (await res.json().catch(() => ({}))) as ApiError;
      if (!res.ok) {
        toast.error(data.error ?? "Falha ao salvar Pix");
        return;
      }
      toast.success("Pix atualizado");
    } finally {
      setSaving(false);
    }
  }

  return (
    <Card className="max-w-2xl border-white/80 bg-white/80 p-4 shadow-[0_24px_55px_-40px_rgba(0,0,0,.45)] backdrop-blur md:p-6">
      <h1 className="mb-1 text-3xl">Configuracao Pix</h1>
      <p className="mb-4 text-sm text-[var(--color-muted)]">A chave cadastrada aqui sera usada para gerar o QR Code oficial do checkout.</p>

      {loading ? (
        <div className="rounded-xl border bg-white/90 p-6 text-center text-sm text-[var(--color-muted)]">Carregando configuracao Pix...</div>
      ) : (
        <div className="space-y-3">
          <Input className="h-11 rounded-xl bg-white/90" placeholder="Chave Pix" value={form.pixKey} onChange={(e) => setForm((f) => ({ ...f, pixKey: e.target.value }))} />
          <Input className="h-11 rounded-xl bg-white/90" placeholder="Nome recebedor" value={form.receiverName} onChange={(e) => setForm((f) => ({ ...f, receiverName: e.target.value }))} />
          <Input className="h-11 rounded-xl bg-white/90" placeholder="Cidade" value={form.city} onChange={(e) => setForm((f) => ({ ...f, city: e.target.value }))} />
          <Input className="h-11 rounded-xl bg-white/90" placeholder="Prefixo TXID" value={form.txidPrefix} onChange={(e) => setForm((f) => ({ ...f, txidPrefix: e.target.value.toUpperCase() }))} />

          <label className="inline-flex items-center gap-2 rounded-xl border bg-white/90 px-3 py-3 text-sm">
            <input type="checkbox" checked={form.enabled} onChange={(e) => setForm((f) => ({ ...f, enabled: e.target.checked }))} />
            Pix habilitado
          </label>

          <Button className="w-full rounded-xl sm:w-auto" onClick={save} disabled={saving}>
            {saving ? "Salvando..." : "Salvar"}
          </Button>
        </div>
      )}
    </Card>
  );
}
