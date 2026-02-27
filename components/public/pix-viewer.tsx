"use client";

import { useState } from "react";
import { toast } from "sonner";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";

export function PixViewer({
  qrPayloadDataUrl,
  qrKeyDataUrl,
  payload,
  pixKey,
  status,
  onPaid,
}: {
  qrPayloadDataUrl: string;
  qrKeyDataUrl: string;
  payload: string;
  pixKey: string;
  status: string;
  onPaid: () => Promise<void>;
}) {
  const [mode, setMode] = useState<"key" | "payload">("key");
  const currentQr = mode === "key" ? qrKeyDataUrl : qrPayloadDataUrl;

  const copy = async (text: string, label: string) => {
    await navigator.clipboard.writeText(text);
    toast.success(`${label} copiado`);
  };

  return (
    <div className="space-y-6">
      <div className="rounded-3xl border bg-white p-6">
        <div className="mb-3 flex items-center justify-between">
          <h2 className="text-2xl">Pague com Pix</h2>
          <Badge>{status}</Badge>
        </div>

        <div className="mb-3 flex flex-wrap gap-2">
          <Button type="button" variant={mode === "key" ? "default" : "outline"} onClick={() => setMode("key")}>
            QR da chave Pix
          </Button>
          <Button
            type="button"
            variant={mode === "payload" ? "default" : "outline"}
            onClick={() => setMode("payload")}
          >
            QR Copia e Cola
          </Button>
        </div>

        <p className="mb-3 text-sm text-[var(--color-muted)]">
          {mode === "key"
            ? "QR gerado com a chave Pix cadastrada pelos noivos."
            : "QR gerado com o payload Pix Copia e Cola (valor e identificador do pedido)."}
        </p>

        <img src={currentQr} alt="QR Code Pix" className="mx-auto h-72 w-72 rounded-2xl border bg-white p-3" />

        <div className="mt-4 grid gap-2">
          <Button variant="outline" onClick={() => copy(payload, "Pix Copia e Cola")}>
            Copiar Pix Copia e Cola
          </Button>
          <Button variant="outline" onClick={() => copy(pixKey, "Chave Pix")}>
            Copiar chave Pix
          </Button>
          <Button onClick={onPaid}>Ja paguei</Button>
        </div>
      </div>

      <div className="rounded-2xl border bg-white p-4 text-sm text-[var(--color-muted)]">
        1. Abra seu banco e escolha Pix QR Code ou Copia e Cola.
        <br />
        2. Faca o pagamento no valor exato do presente.
        <br />
        3. Clique em "Ja paguei" para notificar os noivos.
      </div>
    </div>
  );
}
