"use client";

import { useState } from "react";
import { toast } from "sonner";
import { PixViewer } from "@/components/public/pix-viewer";

export function PixPageClient({
  slug,
  orderId,
  qrDataUrl,
  payload,
  pixKey,
  status,
}: {
  slug: string;
  orderId: string;
  qrDataUrl: string;
  payload: string;
  pixKey: string;
  status: string;
}) {
  const [currentStatus, setCurrentStatus] = useState(status);

  return (
    <PixViewer
      qrDataUrl={qrDataUrl}
      payload={payload}
      pixKey={pixKey}
      status={currentStatus}
      onPaid={async () => {
        const res = await fetch(`/api/public/${slug}/orders/${orderId}/pay`, { method: "POST" });
        const data = await res.json();
        if (!res.ok) {
          toast.error(data.error ?? "Falha ao atualizar");
          return;
        }
        setCurrentStatus(data.status);
        toast.success("Recebemos sua confirmação");
      }}
    />
  );
}
