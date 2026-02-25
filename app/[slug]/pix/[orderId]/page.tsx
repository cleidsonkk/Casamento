import Link from "next/link";
import { notFound } from "next/navigation";
import QRCode from "qrcode";
import { db } from "@/lib/db";
import { buildPixPayload } from "@/lib/pix";
import { Button } from "@/components/ui/button";
import { PixPageClient } from "@/components/public/pix-page-client";

export default async function PixPage({ params }: { params: Promise<{ slug: string; orderId: string }> }) {
  const { slug, orderId } = await params;
  const order = await db.giftOrder.findFirst({
    where: { id: orderId, couple: { slug } },
    include: { couple: { include: { pixSetting: true } } },
  });
  if (!order) notFound();
  const pixSetting = order.couple.pixSetting;
  if (!pixSetting?.enabled) {
    return (
      <main className="mx-auto min-h-screen max-w-xl px-6 py-20">
        <h1 className="mb-2 text-3xl">Pix indisponível</h1>
        <p className="mb-4 text-[var(--color-muted)]">Os noivos ainda não configuraram o Pix.</p>
        <Link href={`/${slug}/presentes`}>
          <Button>Voltar</Button>
        </Link>
      </main>
    );
  }

  const payload = buildPixPayload({
    key: pixSetting.pixKey,
    receiverName: pixSetting.receiverName,
    city: pixSetting.city,
    txid: order.pixTxid,
    amountCents: order.amountCents,
    description: "Presente Casamento",
  });
  const qrDataUrl = await QRCode.toDataURL(payload, { margin: 1, width: 512 });

  return (
    <main className="mx-auto min-h-screen max-w-xl px-6 py-12">
      <Link href={`/${slug}/presentes`}>
        <Button variant="ghost" className="mb-4">
          Voltar
        </Button>
      </Link>
      <PixPageClient
        slug={slug}
        orderId={order.id}
        qrDataUrl={qrDataUrl}
        payload={payload}
        pixKey={pixSetting.pixKey}
        status={order.status}
      />
    </main>
  );
}

