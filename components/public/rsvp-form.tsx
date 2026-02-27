"use client";

import { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { toast } from "sonner";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";

type ConfirmationState = {
  name: string;
  companions: number;
  status: "YES" | "NO";
};

export function RsvpForm({ slug }: { slug: string }) {
  const [loading, setLoading] = useState(false);
  const [confirmed, setConfirmed] = useState<ConfirmationState | null>(null);

  async function handleSubmit(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault();
    const fd = new FormData(e.currentTarget);
    const status = (String(fd.get("status") || "YES") as "YES" | "NO");
    const companions = Number(String(fd.get("companions") || "0"));
    const name = String(fd.get("name") || "").trim();

    const payload = {
      name,
      status,
      companions,
      message: String(fd.get("message") || "").trim(),
      passcode: String(fd.get("passcode") || "").trim(),
      hp: String(fd.get("website") || "").trim(),
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

    setConfirmed({ name, companions, status });
    toast.success("Presenca registrada com sucesso");
    e.currentTarget.reset();
  }

  async function share() {
    const url = `${window.location.origin}/${slug}/rsvp`;
    const message = "Confirme sua presenca no casamento";
    if (navigator.share) {
      try {
        await navigator.share({ title: "RSVP", text: message, url });
        return;
      } catch {
        // fallback to clipboard
      }
    }
    await navigator.clipboard.writeText(url);
    toast.success("Link copiado para compartilhar");
  }

  return (
    <div className="space-y-4">
      <form className="space-y-3" onSubmit={handleSubmit}>
        <input type="text" name="website" className="hidden" tabIndex={-1} autoComplete="off" />
        <Input name="name" placeholder="Nome completo" required />

        <div className="grid grid-cols-1 gap-3 sm:grid-cols-2">
          <select name="status" className="h-11 rounded-[var(--radius-input)] border bg-white px-3 text-sm">
            <option value="YES">Vou ao casamento</option>
            <option value="NO">Nao poderei ir</option>
          </select>
          <Input name="companions" type="number" min={0} max={10} defaultValue={0} placeholder="Acompanhantes" />
        </div>

        <Input name="passcode" placeholder="Codigo (se solicitado)" />
        <Textarea name="message" placeholder="Mensagem para os noivos" />

        <Button disabled={loading} className="w-full">
          {loading ? "Enviando..." : "Confirmar presenca"}
        </Button>
      </form>

      <AnimatePresence>
        {confirmed ? (
          <motion.div
            initial={{ opacity: 0, y: 12 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: 12 }}
            className="rounded-2xl border border-[#e7dcc7] bg-[linear-gradient(145deg,#fffefb,#f6efe3)] p-4"
          >
            <p className="text-xs tracking-[0.14em] text-[var(--color-muted)]">CONFIRMACAO ENVIADA</p>
            <h3 className="mt-1 text-xl">Resumo do RSVP</h3>
            <div className="mt-3 grid gap-2 text-sm sm:grid-cols-3">
              <div className="rounded-xl border bg-white/75 p-3">
                <p className="text-xs text-[var(--color-muted)]">Nome</p>
                <p>{confirmed.name}</p>
              </div>
              <div className="rounded-xl border bg-white/75 p-3">
                <p className="text-xs text-[var(--color-muted)]">Status</p>
                <p>{confirmed.status === "YES" ? "Presenca confirmada" : "Nao podera comparecer"}</p>
              </div>
              <div className="rounded-xl border bg-white/75 p-3">
                <p className="text-xs text-[var(--color-muted)]">Acompanhantes</p>
                <p>{confirmed.companions}</p>
              </div>
            </div>
            <Button type="button" variant="outline" className="mt-3 w-full sm:w-auto" onClick={share}>
              Compartilhar link RSVP
            </Button>
          </motion.div>
        ) : null}
      </AnimatePresence>
    </div>
  );
}
