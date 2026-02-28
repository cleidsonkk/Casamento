import Link from "next/link";
import { notFound } from "next/navigation";
import { OrderStatus } from "@prisma/client";
import { db } from "@/lib/db";
import { GiftsClient } from "@/components/public/gifts-client";
import { Button } from "@/components/ui/button";
import { expireOrders } from "@/lib/reservation";
import { getTemplateTheme } from "@/lib/template-theme";

export default async function GiftsPage({ params }: { params: Promise<{ slug: string }> }) {
  const { slug } = await params;
  const couple = await db.couple.findUnique({
    where: { slug },
    include: { wedding: { include: { template: true } }, gifts: { include: { catalogItem: true, orders: true } } },
  });
  if (!couple?.wedding?.published) notFound();
  await expireOrders(couple.id);

  const gifts = couple.gifts
    .filter((gift) => gift.active)
    .map((gift) => {
      const paidUnique = gift.giftMode === "UNIQUE" && gift.orders.some((o) => o.status === OrderStatus.PAID);
      const reserved = gift.orders.some(
        (o) =>
          o.status === OrderStatus.AWAITING_CONFIRMATION ||
          (o.status === OrderStatus.PENDING_PAYMENT && !!o.reservedUntil && o.reservedUntil > new Date()),
      );
      return {
        id: gift.id,
        title: gift.catalogItem.title,
        category: gift.catalogItem.category,
        description: gift.catalogItem.description,
        priceCents: gift.priceCents,
        imageUrl: gift.catalogItem.imageUrl,
        state: paidUnique ? "indisponível" : reserved ? "reservado" : "disponível",
        reservations: reserved ? 1 : 0,
      };
    });

  const theme = getTemplateTheme(couple.wedding.template?.key);

  return (
    <main className={`relative min-h-screen overflow-hidden ${theme.shellClass}`}>
      <div className="pointer-events-none absolute inset-x-0 top-0 h-64 bg-gradient-to-b from-white/70 to-transparent" />
      <div className="pointer-events-none absolute -left-24 top-24 h-72 w-72 rounded-full bg-white/55 blur-3xl" />
      <div className="pointer-events-none absolute -right-24 bottom-20 h-80 w-80 rounded-full bg-black/10 blur-3xl" />

      <section className="mx-auto max-w-6xl px-4 pb-6 pt-8 md:px-6 md:pt-12">
        <div className={`rounded-[2rem] border p-6 shadow-[0_30px_90px_-45px_rgba(0,0,0,0.4)] backdrop-blur md:p-8 ${theme.contentCardClass}`}>
          <div className="mb-8 flex flex-wrap items-start justify-between gap-4">
            <div>
              <p className={`mb-2 text-xs tracking-[0.24em] ${theme.mutedClass}`}>LISTA DE PRESENTES</p>
              <h1 className={`text-4xl leading-tight md:text-5xl ${theme.titleClass}`}>Escolha um presente com carinho</h1>
              <p className={`mt-3 max-w-2xl ${theme.mutedClass}`}>
                Cada item ajuda a construir nosso novo lar. Pagamento por Pix com confirmação simples e segura.
              </p>
            </div>
            <Link href={`/${slug}`}>
              <Button variant="outline" className="px-6">
                Voltar
              </Button>
            </Link>
          </div>

          <GiftsClient slug={slug} items={gifts} />
        </div>
      </section>
    </main>
  );
}
