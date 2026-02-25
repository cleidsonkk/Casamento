import Link from "next/link";
import { notFound } from "next/navigation";
import type React from "react";
import { db } from "@/lib/db";
import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { AnimatedSection } from "@/components/public/animated-section";

export default async function WeddingPublicPage({ params }: { params: Promise<{ slug: string }> }) {
  const { slug } = await params;
  const couple = await db.couple.findUnique({
    where: { slug },
    include: { wedding: { include: { template: true, sections: true } } },
  });
  if (!couple?.wedding?.published) notFound();
  const tokens = (couple.wedding.template?.tokensJson ?? {}) as Record<string, string>;

  return (
    <main
      className="min-h-screen"
      style={
        {
          "--color-bg": tokens.background ?? "#f8f7f4",
          "--color-card": tokens.card ?? "#fff",
          "--color-text": tokens.text ?? "#111",
          "--color-muted": tokens.muted ?? "#6f6f6f",
          "--color-primary": tokens.primary ?? "#111",
          "--color-border": tokens.border ?? "#ececec",
          "--radius-card": tokens.radiusCard ?? "1.25rem",
          "--radius-button": tokens.radiusButton ?? "999px",
          "--radius-input": tokens.radiusInput ?? "0.9rem",
          "--font-heading": tokens.fontHeading ?? "var(--font-playfair)",
        } as React.CSSProperties
      }
    >
      <header className="glass sticky top-0 z-40 border-b">
        <nav className="mx-auto flex h-16 max-w-6xl items-center justify-between px-6">
          <p className="text-sm">{couple.name}</p>
          <div className="flex items-center gap-2">
            <Link href={`/${slug}/rsvp`}>
              <Button variant="ghost">RSVP</Button>
            </Link>
            <Link href={`/${slug}/presentes`}>
              <Button>Presentes</Button>
            </Link>
          </div>
        </nav>
      </header>

      <section className="mx-auto max-w-6xl px-6 pb-20 pt-28 text-center">
        <p className="mb-2 text-xs tracking-[0.2em] text-[var(--color-muted)]">CASAMENTO</p>
        <h1 className="text-6xl">{couple.wedding.title}</h1>
        <p className="mx-auto mt-4 max-w-2xl text-[var(--color-muted)]">{couple.wedding.subtitle}</p>
        <div className="mt-8 flex justify-center gap-3">
          <Link href={`/${slug}/rsvp`}>
            <Button>Confirmar presença</Button>
          </Link>
          <Link href={`/${slug}/presentes`}>
            <Button variant="outline">Ver lista de presentes</Button>
          </Link>
        </div>
      </section>

      <div className="mx-auto grid max-w-6xl gap-6 px-6 pb-20 md:grid-cols-2">
        {couple.wedding.sections.map(
          (section: { id: string; title: string | null; type: string; content: string | null }) => (
          <AnimatedSection key={section.id}>
            <Card className="p-6">
              <h2 className="mb-2 text-3xl">{section.title ?? section.type}</h2>
              <p className="text-[var(--color-muted)]">{section.content}</p>
            </Card>
          </AnimatedSection>
          ),
        )}
      </div>
    </main>
  );
}
