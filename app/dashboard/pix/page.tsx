"use client";

import { useEffect, useState } from "react";
import { toast } from "sonner";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { Input } from "@/components/ui/input";

export default function PixDashboardPage() {
  const [form, setForm] = useState({
    pixKey: "",
    receiverName: "",
    city: "",
    txidPrefix: "WED",
    enabled: true,
  });

  useEffect(() => {
    fetch("/api/dashboard/pix").then((r) => r.json()).then((d) => d && setForm({ ...form, ...d }));
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  async function save() {
    const res = await fetch("/api/dashboard/pix", {
      method: "PUT",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(form),
    });
    if (!res.ok) return toast.error("Falha ao salvar Pix");
    toast.success("Pix atualizado");
  }

  return (
    <Card className="max-w-2xl border-white/80 bg-white/80 p-6 shadow-[0_24px_55px_-40px_rgba(0,0,0,.45)] backdrop-blur">
      <h1 className="mb-1 text-3xl">Configuracao Pix</h1>
      <p className="mb-4 text-sm text-[var(--color-muted)]">A chave cadastrada aqui sera usada para gerar o QR Code oficial do checkout.</p>

      <div className="space-y-3">
        <Input className="h-11 rounded-xl bg-white/90" placeholder="Chave Pix" value={form.pixKey} onChange={(e) => setForm((f) => ({ ...f, pixKey: e.target.value }))} />
        <Input className="h-11 rounded-xl bg-white/90" placeholder="Nome recebedor" value={form.receiverName} onChange={(e) => setForm((f) => ({ ...f, receiverName: e.target.value }))} />
        <Input className="h-11 rounded-xl bg-white/90" placeholder="Cidade" value={form.city} onChange={(e) => setForm((f) => ({ ...f, city: e.target.value }))} />
        <Input className="h-11 rounded-xl bg-white/90" placeholder="Prefixo TXID" value={form.txidPrefix} onChange={(e) => setForm((f) => ({ ...f, txidPrefix: e.target.value }))} />

        <label className="inline-flex items-center gap-2 rounded-xl border bg-white/90 px-3 py-2 text-sm">
          <input type="checkbox" checked={form.enabled} onChange={(e) => setForm((f) => ({ ...f, enabled: e.target.checked }))} />
          Pix habilitado
        </label>

        <Button className="rounded-xl" onClick={save}>Salvar</Button>
      </div>
    </Card>
  );
}
