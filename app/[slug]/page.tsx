import Link from "next/link";
import { notFound } from "next/navigation";
import type React from "react";
import type { WeddingSection } from "@prisma/client";
import { db } from "@/lib/db";
import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { AnimatedSection } from "@/components/public/animated-section";
import { getGiftImageUrl } from "@/lib/gift-image";
import { formatBRLFromCents } from "@/lib/currency";

const heroByTemplate: Record<string, string> = {
  "luxe-minimal": "https://images.unsplash.com/photo-1519741497674-611481863552?w=1600&q=80&auto=format&fit=crop",
  "romantic-contemporary": "https://images.unsplash.com/photo-1511285560929-80b456fea0bc?w=1600&q=80&auto=format&fit=crop",
  "black-gold": "https://images.unsplash.com/photo-1537633552985-df8429e8048b?w=1600&q=80&auto=format&fit=crop",
  "destination-beach": "https://images.unsplash.com/photo-1507525428034-b723cf961d3e?w=1600&q=80&auto=format&fit=crop",
  "classic-elegance": "https://images.unsplash.com/photo-1519225421980-715cb0215aed?w=1600&q=80&auto=format&fit=crop",
  "modern-neutral": "https://images.unsplash.com/photo-1513278974582-3e1b4a4fa21d?w=1600&q=80&auto=format&fit=crop",
};

const frameByTemplate: Record<string, string> = {
  "luxe-minimal": "from-amber-50 to-stone-100",
  "romantic-contemporary": "from-rose-50 to-neutral-100",
  "black-gold": "from-neutral-900 to-neutral-800",
  "destination-beach": "from-sky-100 to-cyan-50",
  "classic-elegance": "from-zinc-50 to-stone-100",
  "modern-neutral": "from-slate-100 to-zinc-50",
};

export default async function WeddingPublicPage({ params }: { params: Promise<{ slug: string }> }) {
  const { slug } = await params;
  const couple = await db.couple.findUnique({
    where: { slug },
    include: {
      wedding: { include: { template: true, sections: true } },
      gifts: { where: { active: true }, include: { catalogItem: true }, take: 4, orderBy: { updatedAt: "desc" } },
      pixSetting: true,
    },
  });
  if (!couple?.wedding?.published) notFound();
  const tokens = (couple.wedding.template?.tokensJson ?? {}) as Record<string, string>;
  const templateKey = couple.wedding.template?.key ?? "modern-neutral";
  const heroUrl = heroByTemplate[templateKey] ?? heroByTemplate["modern-neutral"];
  const heroFrame = frameByTemplate[templateKey] ?? frameByTemplate["modern-neutral"];
  const darkTemplate = templateKey === "black-gold";

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

      <section className="mx-auto max-w-6xl px-6 pb-10 pt-14">
        <div className={`overflow-hidden rounded-[2rem] border bg-gradient-to-br ${heroFrame}`}>
          <div className="relative h-[28rem]">
            <img src={heroUrl} alt={couple.wedding.title} className="h-full w-full object-cover" />
            <div className={`absolute inset-0 ${darkTemplate ? "bg-black/55" : "bg-black/25"}`} />
            <div className="absolute inset-0 flex flex-col items-center justify-center px-6 text-center text-white">
              <p className="mb-3 text-xs tracking-[0.22em]">CASAMENTO</p>
              <h1 className="text-6xl drop-shadow">{couple.wedding.title}</h1>
              <p className="mt-4 max-w-2xl text-white/90">{couple.wedding.subtitle}</p>
              <div className="mt-8 flex gap-3">
                <Link href={`/${slug}/rsvp`}>
                  <Button>Confirmar Presenca</Button>
                </Link>
                <Link href={`/${slug}/presentes`}>
                  <Button variant="outline">Lista de Presentes</Button>
                </Link>
              </div>
            </div>
          </div>
        </div>
      </section>

      <section className="mx-auto grid max-w-6xl gap-6 px-6 pb-20 md:grid-cols-12">
        <div className="space-y-6 md:col-span-8">
          {couple.wedding.sections.map((section: WeddingSection) => (
            <AnimatedSection key={section.id}>
              <Card className="p-6">
                <h2 className="mb-2 text-3xl">{section.title ?? section.type}</h2>
                <p className="text-[var(--color-muted)]">{section.content}</p>
              </Card>
            </AnimatedSection>
          ))}
          <AnimatedSection>
            <Card className="p-6">
              <div className="mb-4 flex items-center justify-between">
                <h2 className="text-3xl">Lista de Presentes</h2>
                <Link href={`/${slug}/presentes`}>
                  <Button variant="outline">Ver completa</Button>
                </Link>
              </div>
              <div className="grid gap-3 md:grid-cols-2">
                {couple.gifts.map((gift) => (
                  <div key={gift.id} className="rounded-xl border p-2">
                    <img
                      src={getGiftImageUrl(gift.catalogItem.imageUrl, gift.catalogItem.title, gift.catalogItem.category)}
                      alt={gift.catalogItem.title}
                      className="mb-2 h-36 w-full rounded-lg border object-cover"
                    />
                    <p className="text-sm text-[var(--color-muted)]">{gift.catalogItem.category}</p>
                    <p className="text-lg">{gift.catalogItem.title}</p>
                    <p className="text-sm font-semibold">{formatBRLFromCents(gift.priceCents)}</p>
                  </div>
                ))}
              </div>
            </Card>
          </AnimatedSection>
        </div>

        <div className="space-y-6 md:col-span-4">
          <Card className="p-6">
            <h3 className="mb-2 text-2xl">Pix</h3>
            <p className="mb-4 text-sm text-[var(--color-muted)]">
              {couple.pixSetting?.enabled ? "Pagamento Pix disponivel para presentear." : "Pix temporariamente indisponivel."}
            </p>
            <Link href={`/${slug}/presentes`}>
              <Button className="w-full">Presentear agora</Button>
            </Link>
          </Card>
          <Card className="p-6">
            <h3 className="mb-2 text-2xl">Template</h3>
            <p className="text-sm text-[var(--color-muted)]">{couple.wedding.template?.name ?? "Template customizado"}</p>
          </Card>
        </div>
      </section>
    </main>
  );
}

