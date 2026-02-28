import Link from "next/link";
import { notFound } from "next/navigation";
import QRCode from "qrcode";
import { db } from "@/lib/db";
import { buildPixPayload } from "@/lib/pix";
import { Button } from "@/components/ui/button";
import { PixPageClient } from "@/components/public/pix-page-client";
import { getTemplateTheme } from "@/lib/template-theme";

export default async function PixPage({ params }: { params: Promise<{ slug: string; orderId: string }> }) {
  const { slug, orderId } = await params;
  const order = await db.giftOrder.findFirst({
    where: { id: orderId, couple: { slug } },
    include: { couple: { include: { pixSetting: true, wedding: { include: { template: true } } } } },
  });
  if (!order) notFound();

  const theme = getTemplateTheme(order.couple.wedding?.template?.key);
  const pixSetting = order.couple.pixSetting;

  if (!pixSetting?.enabled) {
    return (
      <main className={`mx-auto min-h-screen px-6 py-20 ${theme.shellClass}`}>
        <div className={`mx-auto max-w-xl rounded-3xl border p-8 ${theme.contentCardClass}`}>
          <h1 className={`mb-2 text-3xl ${theme.titleClass}`}>Pix indisponível</h1>
          <p className={`mb-4 ${theme.mutedClass}`}>Os noivos ainda não configuraram o Pix.</p>
          <Link href={`/${slug}/presentes`}>
            <Button>Voltar</Button>
          </Link>
        </div>
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
  const qrPayloadDataUrl = await QRCode.toDataURL(payload, { margin: 1, width: 512 });

  return (
    <main className={`relative min-h-screen overflow-hidden ${theme.shellClass}`}>
      <div className="pointer-events-none absolute inset-x-0 top-0 h-64 bg-gradient-to-b from-white/65 to-transparent" />
      <div className="mx-auto max-w-4xl px-4 py-8 md:px-6 md:py-12">
        <Link href={`/${slug}/presentes`}>
          <Button variant="ghost" className="mb-4">
            Voltar
          </Button>
        </Link>

        <PixPageClient
          slug={slug}
          orderId={order.id}
          qrPayloadDataUrl={qrPayloadDataUrl}
          payload={payload}
          pixKey={pixSetting.pixKey}
          status={order.status}
        />
      </div>
    </main>
  );
}
