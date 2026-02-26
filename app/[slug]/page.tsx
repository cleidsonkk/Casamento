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
import { getTemplateTheme } from "@/lib/template-theme";

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
  const theme = getTemplateTheme(couple.wedding.template?.key);
  const dark = couple.wedding.template?.key === "black-gold";

  return (
    <main
      className={`min-h-screen ${theme.shellClass}`}
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
      <header className={`sticky top-0 z-40 border-b backdrop-blur ${dark ? "border-white/10 bg-black/40" : "border-black/10 bg-white/55"}`}>
        <nav className="mx-auto flex h-16 max-w-6xl items-center justify-between px-6">
          <p className={`text-sm ${dark ? "text-white" : ""}`}>{couple.name}</p>
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

      <section className="mx-auto max-w-6xl px-6 pb-8 pt-10">
        <div className={`overflow-hidden rounded-[2rem] border ${theme.frameClass} shadow-[0_35px_80px_-45px_rgba(0,0,0,.55)]`}>
          <div className="relative h-[31rem]">
            <img src={theme.heroImage} alt={couple.wedding.title} className="h-full w-full object-cover" />
            <div className={`absolute inset-0 ${theme.heroOverlay}`} />
            <div className="absolute inset-0 flex flex-col items-center justify-center px-6 text-center text-white">
              <p className="mb-2 text-xs tracking-[0.22em]">CASAMENTO</p>
              <h1 className="text-6xl drop-shadow-xl">{couple.wedding.title}</h1>
              <p className="mt-4 max-w-2xl text-lg text-white/90">{couple.wedding.subtitle}</p>
              <div className="mt-8 flex gap-3">
                <Link href={`/${slug}/rsvp`}>
                  <Button>Confirmar Presenca</Button>
                </Link>
                <Link href={`/${slug}/presentes`}>
                  <Button variant="outline">Ver lista de presentes</Button>
                </Link>
              </div>
            </div>
          </div>
        </div>
      </section>

      <section className="mx-auto grid max-w-6xl gap-6 px-6 pb-20 lg:grid-cols-12">
        <div className="space-y-6 lg:col-span-8">
          {couple.wedding.sections.map((section: WeddingSection) => (
            <AnimatedSection key={section.id}>
              <Card className={`p-6 ${dark ? "bg-black/50 text-white" : ""}`}>
                <h2 className="mb-2 text-3xl">{section.title ?? section.type}</h2>
                <p className={dark ? "text-white/80" : "text-[var(--color-muted)]"}>{section.content}</p>
              </Card>
            </AnimatedSection>
          ))}

          <AnimatedSection>
            <Card className={`p-6 ${dark ? "bg-black/50 text-white" : ""}`}>
              <div className="mb-4 flex items-center justify-between">
                <h2 className="text-3xl">Lista de Presentes</h2>
                <Link href={`/${slug}/presentes`}>
                  <Button variant="outline">Ver completa</Button>
                </Link>
              </div>
              <div className="grid gap-3 md:grid-cols-2">
                {couple.gifts.map((gift) => (
                  <div key={gift.id} className={`overflow-hidden rounded-xl border ${dark ? "border-white/20 bg-black/35" : "bg-white/85"}`}>
                    <img
                      src={getGiftImageUrl(gift.catalogItem.imageUrl, gift.catalogItem.title, gift.catalogItem.category)}
                      alt={gift.catalogItem.title}
                      className="h-36 w-full object-cover"
                    />
                    <div className="space-y-1 p-3">
                      <p className={`text-xs ${dark ? "text-white/70" : "text-[var(--color-muted)]"}`}>{gift.catalogItem.category}</p>
                      <p className="text-lg">{gift.catalogItem.title}</p>
                      <p className="text-sm font-semibold">{formatBRLFromCents(gift.priceCents)}</p>
                    </div>
                  </div>
                ))}
              </div>
            </Card>
          </AnimatedSection>
        </div>

        <div className="space-y-6 lg:col-span-4">
          <Card className={`p-6 ${dark ? "bg-black/50 text-white" : ""}`}>
            <h3 className="mb-2 text-2xl">Pagamento Pix</h3>
            <p className={`mb-4 text-sm ${dark ? "text-white/80" : "text-[var(--color-muted)]"}`}>
              {couple.pixSetting?.enabled ? "Checkout instantaneo com QR Code e Pix Copia e Cola." : "Pix temporariamente indisponivel."}
            </p>
            <Link href={`/${slug}/presentes`}>
              <Button className="w-full">Ir para presentes</Button>
            </Link>
          </Card>
          <Card className={`p-6 ${dark ? "bg-black/50 text-white" : ""}`}>
            <h3 className="mb-2 text-xl">Template atual</h3>
            <p className={dark ? "text-white/80" : "text-[var(--color-muted)]"}>{couple.wedding.template?.name ?? "Template customizado"}</p>
          </Card>
        </div>
      </section>
    </main>
  );
}
