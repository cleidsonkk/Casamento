"use client";

import { useState } from "react";
import { toast } from "sonner";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";

export function RsvpForm({ slug }: { slug: string }) {
  const [loading, setLoading] = useState(false);

  async function handleSubmit(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault();
    const fd = new FormData(e.currentTarget);
    const payload = {
      name: fd.get("name"),
      status: fd.get("status"),
      companions: Number(fd.get("companions") || 0),
      message: fd.get("message"),
      passcode: fd.get("passcode"),
      hp: fd.get("website"),
    };
    setLoading(true);
    const res = await fetch(`/api/public/${slug}/rsvp`, {
      method: "POST",
      body: JSON.stringify(payload),
      headers: { "Content-Type": "application/json" },
    });
    setLoading(false);
    if (!res.ok) {
      const data = await res.json();
      toast.error(data.error ?? "Falha no RSVP");
      return;
    }
    toast.success("RSVP confirmado com sucesso");
    e.currentTarget.reset();
  }

  return (
    <form className="space-y-3" onSubmit={handleSubmit}>
      <input type="text" name="website" className="hidden" tabIndex={-1} autoComplete="off" />
      <Input name="name" placeholder="Nome completo" required />
      <div className="grid grid-cols-2 gap-3">
        <select name="status" className="h-11 rounded-[var(--radius-input)] border bg-white px-3 text-sm">
          <option value="YES">Vou</option>
          <option value="NO">Não vou</option>
        </select>
        <Input name="companions" type="number" min={0} max={10} defaultValue={0} placeholder="Acompanhantes" />
      </div>
      <Input name="passcode" placeholder="Código (se necessário)" />
      <Textarea name="message" placeholder="Mensagem opcional" />
      <Button disabled={loading} className="w-full">
        {loading ? "Enviando..." : "Confirmar presença"}
      </Button>
    </form>
  );
}

