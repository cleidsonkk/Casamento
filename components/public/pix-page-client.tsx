"use client";

import { useState } from "react";
import { toast } from "sonner";
import { PixViewer } from "@/components/public/pix-viewer";

export function PixPageClient({
  slug,
  orderId,
  qrPayloadDataUrl,
  payload,
  pixKey,
  status,
}: {
  slug: string;
  orderId: string;
  qrPayloadDataUrl: string;
  payload: string;
  pixKey: string;
  status: string;
}) {
  const [currentStatus, setCurrentStatus] = useState(status);

  return (
    <PixViewer
      qrPayloadDataUrl={qrPayloadDataUrl}
      payload={payload}
      pixKey={pixKey}
      status={currentStatus}
      onPaid={async () => {
        try {
          const res = await fetch(`/api/public/${slug}/orders/${orderId}/pay`, {
            method: "POST",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify({}),
          });
          const data = await res.json().catch(() => ({}));
          if (!res.ok) {
            toast.error((data as { error?: string }).error ?? "Falha ao atualizar status do pedido");
            return;
          }
          const nextStatus = (data as { status?: string }).status ?? "AWAITING_CONFIRMATION";
          setCurrentStatus(nextStatus);
          toast.success("Confirmacao enviada com sucesso");
        } catch {
          toast.error("Erro de conexao ao confirmar pagamento");
        }
      }}
    />
  );
}
