import Link from "next/link";
import { notFound } from "next/navigation";
import { db } from "@/lib/db";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { getGiftImageUrl } from "@/lib/gift-image";
import { formatBRLFromCents } from "@/lib/currency";
import { getTemplateTheme } from "@/lib/template-theme";
import { SmartImage } from "@/components/public/smart-image";
import { AnimatedSection } from "@/components/public/animated-section";

function formatEventDate(date: Date | null | undefined) {
  if (!date) return "12.12.2026";
  return new Intl.DateTimeFormat("pt-BR").format(date).replaceAll("/", ".");
}

function buildNameLines(rawTitle: string) {
  const clean = rawTitle.replace(/\s+/g, " ").trim();
  if (!clean) return ["Noivos"];

  const byMainDelimiters = clean.split(/\s*(?:\+|&|\be\b)\s*/i).filter(Boolean);
  if (byMainDelimiters.length >= 2) {
    return byMainDelimiters.map((item) => item.trim()).filter(Boolean);
  }

  const words = clean.split(" ");
  const lines: string[] = [];
  let current = "";
  const maxChars = 14;
  for (const word of words) {
    const next = current ? `${current} ${word}` : word;
    if (next.length > maxChars && current) {
      lines.push(current);
      current = word;
    } else {
      current = next;
    }
  }
  if (current) lines.push(current);
  return lines.slice(0, 4);
}

export default async function WeddingPublicPage({ params }: { params: Promise<{ slug: string }> }) {
  const { slug } = await params;
  const couple = await db.couple.findUnique({
    where: { slug },
    include: {
      wedding: { include: { template: true, sections: true, gallery: { orderBy: { order: "asc" } } } },
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
  const heroImageUrl =
    couple.wedding.sections.find((section) => section.type === "HERO_IMAGE")?.content ||
    couple.wedding.gallery[0]?.imageUrl ||
    theme.heroImage;
  const galleryUrls =
    couple.wedding.gallery.map((item) => item.imageUrl).filter(Boolean) ||
    [];
  const nameLines = buildNameLines(couple.wedding.title);
  const longestLine = Math.max(...nameLines.map((line) => line.length), 0);
  const nameSizeClass =
    longestLine > 18
      ? "text-[clamp(2rem,4.2vw,4rem)]"
      : nameLines.length >= 3
        ? "text-[clamp(2.2rem,4.5vw,4.5rem)]"
        : "text-[clamp(2.6rem,5.2vw,5.8rem)]";

  const heroPanel = (
    <div className={`relative w-full overflow-visible rounded-[2rem] border p-5 text-center shadow-[0_26px_60px_-36px_rgba(0,0,0,.42)] md:p-8 ${theme.heroCardClass}`}>
      <p className={`mx-auto inline-flex rounded-full border px-6 py-1 text-xs tracking-[0.22em] ${theme.heroBadgeClass}`}>
        WEDDING DAY
      </p>
      <div className={`mx-auto mt-4 h-px w-24 bg-gradient-to-r ${theme.heroDividerClass}`} />
      <h1
        className={`mt-4 px-1 font-semibold leading-[0.95] tracking-[-0.01em] ${nameSizeClass}`}
        style={{
          fontFamily: "var(--font-heading)",
          fontStyle: "italic",
          backgroundImage: theme.heroNameGradient,
          WebkitBackgroundClip: "text",
          color: "transparent",
          textShadow: theme.heroNameShadow,
        }}
      >
        {nameLines.map((line) => (
          <span key={line} className="block break-words">
            {line}
          </span>
        ))}
      </h1>
      <p className={`mt-3 text-2xl font-medium tracking-[0.08em] ${theme.heroDateClass}`}>{date}</p>
      <div className="mt-6 grid grid-cols-4 gap-2 md:gap-3">
        {[
          [String(Math.max(1, couple.guests.length || 42)), "DIAS"],
          ["14", "HORAS"],
          ["22", "MIN"],
          ["05", "SEG"],
        ].map(([value, label]) => (
          <div key={label} className={`rounded-2xl border p-2 shadow-[0_10px_22px_-18px_rgba(0,0,0,.3)] md:p-3 ${theme.statBoxClass}`}>
            <p className={`text-3xl leading-tight ${theme.titleClass}`}>{value}</p>
            <p className={`text-[11px] tracking-[0.13em] ${theme.mutedClass}`}>{label}</p>
          </div>
        ))}
      </div>
      <Link href={`/${slug}/presentes`}>
        <Button className={`mt-6 w-full rounded-2xl py-6 text-lg font-semibold md:w-auto md:px-14 md:whitespace-nowrap ${theme.ctaClass}`}>
          Presentear os noivos
        </Button>
      </Link>
    </div>
  );

  return (
    <main className={`min-h-screen ${theme.shellClass}`} style={{ ["--font-heading" as any]: theme.headingFont }}>
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

          <AnimatedSection className="p-3 md:p-6">
            {theme.heroLayout === "overlay" ? (
              <div className={`relative overflow-hidden rounded-3xl border shadow-[0_30px_80px_-40px_rgba(0,0,0,.45)] ${theme.heroCardClass}`}>
                <div className="relative min-h-[34rem] md:min-h-[42rem]">
                  <SmartImage src={heroImageUrl} alt={couple.wedding.title} className="h-full w-full object-cover" loading="eager" />
                  <div className={`absolute inset-0 ${theme.heroOverlay}`} />
                  <div className="absolute inset-0 bg-[radial-gradient(circle_at_center,rgba(255,255,255,.08),transparent_56%)]" />
                  <div className="absolute inset-x-3 bottom-3 md:inset-x-6 md:bottom-6">
                    {heroPanel}
                  </div>
                </div>
              </div>
            ) : theme.heroLayout === "editorial" ? (
              <div className={`overflow-hidden rounded-3xl border shadow-[0_30px_80px_-40px_rgba(0,0,0,.45)] ${theme.heroCardClass}`}>
                <div className="grid lg:grid-cols-12">
                  <div className="relative min-h-[20rem] lg:col-span-7">
                    <SmartImage src={heroImageUrl} alt={couple.wedding.title} className="h-full w-full object-cover" loading="eager" />
                    <div className={`absolute inset-0 ${theme.heroOverlay}`} />
                  </div>
                  <div className={`flex items-center p-4 md:p-8 lg:col-span-5 ${theme.heroRightBgClass}`}>
                    {heroPanel}
                  </div>
                </div>
              </div>
            ) : (
              <div className={`overflow-hidden rounded-3xl border shadow-[0_30px_80px_-40px_rgba(0,0,0,.45)] ${theme.heroCardClass}`}>
                <div className="grid lg:grid-cols-12">
                  <div className="relative min-h-[21rem] lg:col-span-7">
                    <SmartImage src={heroImageUrl} alt={couple.wedding.title} className="h-full w-full object-cover" loading="eager" />
                    <div className={`absolute inset-0 ${theme.heroOverlay}`} />
                    <div className="absolute inset-0 bg-[linear-gradient(90deg,rgba(11,11,11,.35),transparent_45%,rgba(255,255,255,.06))]" />
                  </div>
                  <div className="relative flex items-center justify-center p-4 md:p-8 lg:col-span-5">
                    <div className={`absolute inset-0 ${theme.heroRightBgClass}`} />
                    <div className="absolute inset-0 opacity-50 [background:radial-gradient(circle_at_18%_20%,rgba(203,169,113,.15),transparent_40%),radial-gradient(circle_at_90%_90%,rgba(188,146,85,.12),transparent_42%)]" />
                    {heroPanel}
                  </div>
                </div>
              </div>
            )}
          </AnimatedSection>

          <AnimatedSection className="px-3 pb-3 md:px-6 md:pb-6">
            <Card className={`grid gap-3 p-4 md:grid-cols-3 ${theme.contentCardClass}`}>
              <div className={`rounded-xl border p-3 ${theme.statBoxClass}`}>
                <p className={`text-3xl ${theme.titleClass}`}>{confirmed}</p>
                <p className={`text-sm ${theme.mutedClass}`}>Confirmados</p>
              </div>
              <div className={`rounded-xl border p-3 ${theme.statBoxClass}`}>
                <p className={`text-3xl ${theme.titleClass}`}>{couple.gifts.length}</p>
                <p className={`text-sm ${theme.mutedClass}`}>Presentes ativos</p>
              </div>
              <div className={`rounded-xl border p-3 ${theme.statBoxClass}`}>
                <p className={`text-xl ${theme.titleClass}`}>{couple.name.toLowerCase().replaceAll(" ", "")}.com</p>
                <p className={`text-sm ${theme.mutedClass}`}>Link do casal</p>
              </div>
            </Card>
          </AnimatedSection>

          <section className="grid gap-4 px-3 pb-8 md:px-6 lg:grid-cols-12">
            <div className="space-y-4 lg:col-span-8">
              <AnimatedSection>
                <Card id="historia" className={`grid gap-4 p-4 md:grid-cols-12 md:p-6 ${theme.contentCardClass}`}>
                <SmartImage
                  src={galleryUrls[0] || "https://images.unsplash.com/photo-1529636798458-92182e662485?w=1200&q=80&auto=format&fit=crop"}
                  alt="Historia do casal"
                  className="h-56 w-full rounded-2xl object-cover md:col-span-5 md:h-full"
                />
                <div className="md:col-span-7">
                  <h2 className={`text-4xl ${theme.titleClass}`}>Historia do Casal</h2>
                  <p className={`mt-3 ${theme.mutedClass}`}>
                    {couple.wedding.story ?? "Uma historia de amor, parceria e celebracao com as pessoas mais importantes."}
                  </p>
                  <Link href={`/${slug}/rsvp`}>
                    <Button variant="outline" className="mt-4">Nossa Historia</Button>
                  </Link>
                </div>
              </Card>
              </AnimatedSection>

              <AnimatedSection>
                <Card className={`grid gap-4 p-4 md:grid-cols-2 md:p-6 ${theme.contentCardClass}`}>
                <div>
                  <h3 className={`text-3xl ${theme.titleClass}`}>Album de Fotos</h3>
                  <p className={`mt-2 text-sm ${theme.mutedClass}`}>Momentos que marcaram nossa historia.</p>
                  <div className="mt-4 grid grid-cols-3 gap-2">
                    {(galleryUrls.length ? galleryUrls : [
                      "https://images.unsplash.com/photo-1519225421980-715cb0215aed?w=1200&q=80&auto=format&fit=crop",
                      "https://images.unsplash.com/photo-1520854221256-17451cc331bf?w=1200&q=80&auto=format&fit=crop",
                      "https://images.unsplash.com/photo-1606216794074-735e91aa2c92?w=1200&q=80&auto=format&fit=crop",
                    ]).slice(0, 6).map((url) => (
                      <SmartImage key={url} src={url} alt="Foto do casal" className="aspect-[4/3] w-full rounded-lg object-cover" />
                    ))}
                  </div>
                </div>
                <div className={`rounded-2xl border p-4 ${theme.statBoxClass}`}>
                  <h3 className={`text-3xl ${theme.titleClass}`}>Confirmacao de Presenca</h3>
                  <p className={`mt-2 text-sm ${theme.mutedClass}`}>
                    Sua presenca torna nosso dia ainda mais especial. Confirme em menos de 1 minuto.
                  </p>
                  <div className="mt-5">
                    <Link href={`/${slug}/rsvp`}>
                      <Button className="w-full md:w-auto">Confirmar Presenca</Button>
                    </Link>
                  </div>
                </div>
              </Card>
              </AnimatedSection>
            </div>

            <AnimatedSection id="presentes" className="lg:col-span-4">
              <Card className={`border-white/70 p-4 ${theme.sidebarCardClass}`}>
                <h3 className={`text-3xl ${theme.titleClass}`}>Lista de Presentes</h3>
                <p className={`mb-4 mt-1 text-sm ${theme.mutedClass}`}>Contribua com um presente via Pix.</p>
                <div className="space-y-3">
                  {couple.gifts.slice(0, 4).map((gift) => (
                    <div key={gift.id} className={`rounded-xl border p-2 ${theme.statBoxClass}`}>
                      <SmartImage
                        src={getGiftImageUrl(gift.catalogItem.imageUrl, gift.catalogItem.title, gift.catalogItem.category)}
                        alt={gift.catalogItem.title}
                        className="aspect-[4/3] w-full rounded-lg object-cover"
                      />
                      <p className={`mt-2 text-sm ${theme.titleClass}`}>{gift.catalogItem.title}</p>
                      <p className={`text-xs ${theme.mutedClass}`}>{formatBRLFromCents(gift.priceCents)}</p>
                      <Link href={`/${slug}/presentes`}>
                        <Button variant="outline" className="mt-2 w-full">Dar presente</Button>
                      </Link>
                    </div>
                  ))}
                </div>
              </Card>
            </AnimatedSection>
          </section>
        </div>
      </div>
    </main>
  );
}
