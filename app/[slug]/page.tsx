import Link from "next/link";
import { notFound } from "next/navigation";
import { db } from "@/lib/db";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { getGiftImageUrl } from "@/lib/gift-image";
import { formatBRLFromCents } from "@/lib/currency";
import { getTemplateTheme } from "@/lib/template-theme";
import { SmartImage } from "@/components/public/smart-image";

function formatEventDate(date: Date | null | undefined) {
  if (!date) return "12.12.2026";
  return new Intl.DateTimeFormat("pt-BR").format(date).replaceAll("/", ".");
}

export default async function WeddingPublicPage({ params }: { params: Promise<{ slug: string }> }) {
  const { slug } = await params;
  const couple = await db.couple.findUnique({
    where: { slug },
    include: {
      wedding: { include: { template: true, sections: true } },
      gifts: { where: { active: true }, include: { catalogItem: true }, take: 6, orderBy: { updatedAt: "desc" } },
      pixSetting: true,
      guests: true,
      rsvps: true,
    },
  });
  if (!couple?.wedding?.published) notFound();

  const theme = getTemplateTheme(couple.wedding.template?.key);
  const date = formatEventDate(couple.wedding.eventDate);
  const confirmed = couple.rsvps.filter((r) => r.status === "YES").length;

  return (
    <main className={`min-h-screen ${theme.shellClass}`}>
      <div className="mx-auto max-w-7xl px-4 py-4 md:px-6 md:py-6">
        <div className={`overflow-hidden rounded-[2rem] border shadow-[0_40px_80px_-50px_rgba(0,0,0,0.45)] ${theme.frameClass}`}>
          <header className={`border-b px-4 py-4 md:px-8 ${theme.navClass}`}>
            <div className="flex flex-wrap items-center justify-between gap-3">
              <nav className="flex flex-wrap items-center gap-5 text-sm md:gap-8 md:text-base">
                <a href="#historia" className="border-b border-current pb-1">Historia</a>
                <a href="#presentes">Lista de Presentes</a>
                <a href={`/${slug}/rsvp`}>Confirmacao de Presenca</a>
              </nav>
              <Link href={`/${slug}/rsvp`}>
                <Button variant="outline" className="px-6">
                  Confirmar Presenca
                </Button>
              </Link>
            </div>
          </header>

          <section className="p-3 md:p-6">
            <div className="overflow-hidden rounded-3xl border border-white/60 bg-white/60 backdrop-blur">
              <div className="grid lg:grid-cols-12">
                <div className="relative min-h-[19rem] lg:col-span-7">
                  <SmartImage src={theme.heroImage} alt={couple.wedding.title} className="h-full w-full object-cover" loading="eager" />
                  <div className={`absolute inset-0 ${theme.heroOverlay}`} />
                  <div className="absolute inset-0 bg-[radial-gradient(circle_at_75%_20%,rgba(255,255,255,.28),transparent_45%)]" />
                </div>
                <div className="relative flex items-center justify-center overflow-hidden p-5 md:p-10 lg:col-span-5">
                  <div className="absolute inset-0 bg-[linear-gradient(160deg,rgba(255,255,255,.82),rgba(246,242,234,.66))]" />
                  <div className="absolute -right-14 -top-14 h-44 w-44 rounded-full bg-white/45 blur-2xl" />
                  <div className="absolute -bottom-16 -left-14 h-44 w-44 rounded-full bg-white/35 blur-2xl" />
                  <div className="relative w-full rounded-3xl border border-white/70 bg-white/45 p-4 text-center shadow-[0_25px_60px_-38px_rgba(0,0,0,.45)] backdrop-blur md:p-7">
                    <p className="mx-auto mb-3 inline-flex rounded-full border border-white/80 bg-white/65 px-4 py-1 text-xs tracking-[0.18em] text-[var(--color-muted)]">
                      WEDDING DAY
                    </p>
                    <h1 className={`text-5xl md:text-6xl ${theme.titleClass}`}>{couple.wedding.title.replace("+", "&")}</h1>
                    <p className={`mt-2 text-2xl font-medium ${theme.mutedClass}`}>{date}</p>
                    <div className="mt-6 grid grid-cols-4 gap-2">
                      {[
                        [String(Math.max(1, couple.guests.length || 42)), "DIAS"],
                        ["14", "HORAS"],
                        ["22", "MIN"],
                        ["05", "SEG"],
                      ].map(([value, label]) => (
                        <div key={label} className="rounded-2xl border border-white/80 bg-white/80 p-2 shadow-[0_12px_26px_-20px_rgba(0,0,0,.45)]">
                          <p className="text-3xl leading-tight">{value}</p>
                          <p className="text-[11px] tracking-[0.12em] text-[var(--color-muted)]">{label}</p>
                        </div>
                      ))}
                    </div>
                    <Link href={`/${slug}/presentes`}>
                      <Button className="mt-6 w-full rounded-xl bg-[linear-gradient(120deg,#111,#2d2d2d)] py-6 text-base md:w-auto md:px-12">
                        Presentear os noivos
                      </Button>
                    </Link>
                  </div>
                </div>
              </div>
            </div>
          </section>

          <section className="px-3 pb-3 md:px-6 md:pb-6">
            <Card className="grid gap-3 border-white/70 bg-white/75 p-4 md:grid-cols-3">
              <div className="rounded-xl border bg-white/80 p-3">
                <p className="text-3xl">{confirmed}</p>
                <p className="text-sm text-[var(--color-muted)]">Confirmados</p>
              </div>
              <div className="rounded-xl border bg-white/80 p-3">
                <p className="text-3xl">{couple.gifts.length}</p>
                <p className="text-sm text-[var(--color-muted)]">Presentes ativos</p>
              </div>
              <div className="rounded-xl border bg-white/80 p-3">
                <p className="text-xl">{couple.name.toLowerCase().replaceAll(" ", "")}.com</p>
                <p className="text-sm text-[var(--color-muted)]">Link do casal</p>
              </div>
            </Card>
          </section>

          <section className="grid gap-4 px-3 pb-8 md:px-6 lg:grid-cols-12">
            <div className="space-y-4 lg:col-span-8">
              <Card id="historia" className="grid gap-4 border-white/70 bg-white/80 p-4 md:grid-cols-12 md:p-6">
                <SmartImage
                  src="https://images.unsplash.com/photo-1529636798458-92182e662485?w=1200&q=80&auto=format&fit=crop"
                  alt="Historia do casal"
                  className="h-56 w-full rounded-2xl object-cover md:col-span-5"
                />
                <div className="md:col-span-7">
                  <h2 className={`text-4xl ${theme.titleClass}`}>Historia do Casal</h2>
                  <p className="mt-3 text-[var(--color-muted)]">
                    {couple.wedding.story ?? "Uma historia de amor, parceria e celebracao com as pessoas mais importantes."}
                  </p>
                  <Link href={`/${slug}/rsvp`}>
                    <Button variant="outline" className="mt-4">Nossa Historia</Button>
                  </Link>
                </div>
              </Card>

              <Card className="grid gap-4 border-white/70 bg-white/80 p-4 md:grid-cols-2 md:p-6">
                <div>
                  <h3 className={`text-3xl ${theme.titleClass}`}>Album de Fotos</h3>
                  <p className="mt-2 text-sm text-[var(--color-muted)]">Momentos que marcaram nossa historia.</p>
                  <div className="mt-4 grid grid-cols-3 gap-2">
                    {[
                      "https://images.unsplash.com/photo-1519225421980-715cb0215aed?w=1200&q=80&auto=format&fit=crop",
                      "https://images.unsplash.com/photo-1520854221256-17451cc331bf?w=1200&q=80&auto=format&fit=crop",
                      "https://images.unsplash.com/photo-1606216794074-735e91aa2c92?w=1200&q=80&auto=format&fit=crop",
                    ].map((url) => (
                      <SmartImage key={url} src={url} alt="Foto do casal" className="h-24 w-full rounded-lg object-cover md:h-28" />
                    ))}
                  </div>
                </div>
                <div className="rounded-2xl border bg-white/70 p-4">
                  <h3 className={`text-3xl ${theme.titleClass}`}>Confirmacao de Presenca</h3>
                  <p className="mt-2 text-sm text-[var(--color-muted)]">
                    Sua presenca torna nosso dia ainda mais especial. Confirme em menos de 1 minuto.
                  </p>
                  <div className="mt-5">
                    <Link href={`/${slug}/rsvp`}>
                      <Button className="w-full md:w-auto">Confirmar Presenca</Button>
                    </Link>
                  </div>
                </div>
              </Card>
            </div>

            <aside id="presentes" className="lg:col-span-4">
              <Card className={`border-white/70 p-4 ${theme.sidebarCardClass}`}>
                <h3 className={`text-3xl ${theme.titleClass}`}>Lista de Presentes</h3>
                <p className="mb-4 mt-1 text-sm text-[var(--color-muted)]">Contribua com um presente via Pix.</p>
                <div className="space-y-3">
                  {couple.gifts.slice(0, 4).map((gift) => (
                    <div key={gift.id} className="rounded-xl border bg-white/80 p-2">
                      <SmartImage
                        src={getGiftImageUrl(gift.catalogItem.imageUrl, gift.catalogItem.title, gift.catalogItem.category)}
                        alt={gift.catalogItem.title}
                        className="h-28 w-full rounded-lg object-cover"
                      />
                      <p className="mt-2 text-sm">{gift.catalogItem.title}</p>
                      <p className="text-xs text-[var(--color-muted)]">{formatBRLFromCents(gift.priceCents)}</p>
                      <Link href={`/${slug}/presentes`}>
                        <Button variant="outline" className="mt-2 w-full">Dar presente</Button>
                      </Link>
                    </div>
                  ))}
                </div>
              </Card>
            </aside>
          </section>
        </div>
      </div>
    </main>
  );
}
