import Link from "next/link";
import { notFound } from "next/navigation";
import { db } from "@/lib/db";
import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { RsvpForm } from "@/components/public/rsvp-form";

export default async function RsvpPage({ params }: { params: Promise<{ slug: string }> }) {
  const { slug } = await params;
  const couple = await db.couple.findUnique({ where: { slug }, include: { wedding: true } });
  if (!couple?.wedding?.published) notFound();

  return (
    <main className="min-h-screen bg-[radial-gradient(circle_at_top,#fffefb,#f6f2ea)] px-4 py-10 md:py-16">
      <div className="mx-auto w-full max-w-2xl">
        <Link href={`/${slug}`}>
          <Button variant="ghost" className="mb-4">
            Voltar
          </Button>
        </Link>

        <Card className="border-white/80 bg-white/80 p-5 shadow-[0_30px_70px_-45px_rgba(0,0,0,.45)] backdrop-blur md:p-7">
          <p className="text-xs tracking-[0.18em] text-[var(--color-muted)]">RSVP</p>
          <h1 className="mt-1 text-4xl">Confirmacao de presenca</h1>
          <p className="mb-5 mt-2 text-[var(--color-muted)]">Confirme sua presenca em menos de 1 minuto.</p>
          <RsvpForm slug={slug} />
        </Card>
      </div>
    </main>
  );
}
