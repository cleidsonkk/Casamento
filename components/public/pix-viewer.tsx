"use client";

import { toast } from "sonner";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";

const statusLabel: Record<string, string> = {
  PENDING_PAYMENT: "Aguardando pagamento",
  AWAITING_CONFIRMATION: "Aguardando confirmacao",
  PAID: "Pagamento confirmado",
  CANCELED: "Cancelado",
  EXPIRED: "Expirado",
};

export function PixViewer({
  qrPayloadDataUrl,
  payload,
  pixKey,
  status,
  onPaid,
}: {
  qrPayloadDataUrl: string;
  payload: string;
  pixKey: string;
  status: string;
  onPaid: () => Promise<void>;
}) {
  const copy = async (text: string, label: string) => {
    await navigator.clipboard.writeText(text);
    toast.success(`${label} copiado`);
  };

  return (
    <div className="grid gap-4 lg:grid-cols-12">
      <div className="space-y-4 lg:col-span-8">
        <div className="rounded-3xl border border-white/80 bg-white/85 p-5 shadow-[0_30px_70px_-45px_rgba(0,0,0,.5)] backdrop-blur md:p-7">
          <div className="mb-3 flex flex-wrap items-center justify-between gap-2">
            <h2 className="text-2xl md:text-3xl">Pague com Pix</h2>
            <Badge>{statusLabel[status] ?? status}</Badge>
          </div>

          <p className="mb-4 text-sm text-[var(--color-muted)]">
            QR Pix oficial gerado com a chave cadastrada pelos noivos.
          </p>

          <img src={qrPayloadDataUrl} alt="QR Code Pix" className="mx-auto h-64 w-64 rounded-2xl border bg-white p-3 md:h-80 md:w-80" />

          <div className="mt-5 grid gap-2 sm:grid-cols-2">
            <Button variant="outline" className="h-11 rounded-xl" onClick={() => copy(payload, "Pix Copia e Cola")}>
              Copiar Pix Copia e Cola
            </Button>
            <Button variant="outline" className="h-11 rounded-xl" onClick={() => copy(pixKey, "Chave Pix")}>
              Copiar chave Pix
            </Button>
          </div>

          <Button className="mt-3 h-11 w-full rounded-xl" onClick={onPaid}>
            Ja paguei
          </Button>
        </div>
      </div>

      <div className="lg:col-span-4">
        <div className="rounded-3xl border border-white/80 bg-white/80 p-5 shadow-[0_25px_60px_-45px_rgba(0,0,0,.45)] backdrop-blur">
          <p className="text-xs tracking-[0.2em] text-[var(--color-muted)]">PASSO A PASSO</p>
          <h3 className="mt-2 text-2xl">Pagamento seguro</h3>
          <ol className="mt-4 space-y-3 text-sm text-[var(--color-muted)]">
            <li className="rounded-xl border bg-white/85 p-3">1. Abra seu banco e escolha Pix QR Code ou Copia e Cola.</li>
            <li className="rounded-xl border bg-white/85 p-3">2. Faca o pagamento no valor exato do presente.</li>
            <li className="rounded-xl border bg-white/85 p-3">3. Clique em "Ja paguei" para notificar os noivos.</li>
          </ol>
        </div>
      </div>
    </div>
  );
}
