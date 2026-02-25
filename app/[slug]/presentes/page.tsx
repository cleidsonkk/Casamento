import Link from "next/link";
import { notFound } from "next/navigation";
import { OrderStatus } from "@prisma/client";
import { db } from "@/lib/db";
import { GiftsClient } from "@/components/public/gifts-client";
import { Button } from "@/components/ui/button";
import { expireOrders } from "@/lib/reservation";

export default async function GiftsPage({ params }: { params: Promise<{ slug: string }> }) {
  const { slug } = await params;
  const couple = await db.couple.findUnique({
    where: { slug },
    include: { wedding: true, gifts: { include: { catalogItem: true, orders: true } } },
  });
  if (!couple?.wedding?.published) notFound();
  await expireOrders(couple.id);

  const gifts = couple.gifts
    .filter((g) => g.active)
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
        state: paidUnique ? "indisponivel" : reserved ? "reservado" : "disponivel",
        reservations: reserved ? 1 : 0,
      };
    });

  return (
    <main className="mx-auto min-h-screen max-w-6xl px-6 py-14">
      <div className="mb-8 flex items-center justify-between">
        <h1 className="text-5xl">Lista de Presentes</h1>
        <Link href={`/${slug}`}>
          <Button variant="outline">Voltar</Button>
        </Link>
      </div>
      <GiftsClient slug={slug} items={gifts} />
    </main>
  );
}

