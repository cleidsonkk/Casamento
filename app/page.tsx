import Link from "next/link";
import { Button } from "@/components/ui/button";

export default function HomePage() {
  return (
    <main className="mx-auto flex min-h-screen max-w-5xl items-center justify-center px-6">
      <section className="text-center">
        <p className="mb-4 text-xs tracking-[0.2em] text-[var(--color-muted)]">WEDDING SAAS 2026</p>
        <h1 className="mb-4 text-5xl">Experiência premium para casais</h1>
        <p className="mx-auto mb-8 max-w-2xl text-[var(--color-muted)]">
          Plataforma multi-casais com site público, RSVP inteligente e lista de presentes com Pix.
        </p>
        <div className="flex items-center justify-center gap-3">
          <Link href="/ana-e-bruno">
            <Button>Ver exemplo público</Button>
          </Link>
          <Link href="/dashboard">
            <Button variant="outline">Abrir dashboard</Button>
          </Link>
        </div>
      </section>
    </main>
  );
}

