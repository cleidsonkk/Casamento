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
    <Card className="max-w-2xl p-6">
      <h1 className="mb-4 text-3xl">Configuração Pix</h1>
      <div className="space-y-3">
        <Input placeholder="Chave Pix" value={form.pixKey} onChange={(e) => setForm((f) => ({ ...f, pixKey: e.target.value }))} />
        <Input placeholder="Nome recebedor" value={form.receiverName} onChange={(e) => setForm((f) => ({ ...f, receiverName: e.target.value }))} />
        <Input placeholder="Cidade" value={form.city} onChange={(e) => setForm((f) => ({ ...f, city: e.target.value }))} />
        <Input placeholder="Prefixo TXID" value={form.txidPrefix} onChange={(e) => setForm((f) => ({ ...f, txidPrefix: e.target.value }))} />
        <label className="text-sm"><input type="checkbox" checked={form.enabled} onChange={(e) => setForm((f) => ({ ...f, enabled: e.target.checked }))} /> Pix habilitado</label>
        <Button onClick={save}>Salvar</Button>
      </div>
    </Card>
  );
}

