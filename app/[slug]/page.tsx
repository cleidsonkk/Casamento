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
  const titleText = couple.wedding.title.replace("+", "&");
  const [nameA, nameB] = titleText.includes("&")
    ? titleText.split("&").map((p) => p.trim())
    : titleText.split(" ").length > 1
      ? [titleText.split(" ")[0], titleText.split(" ").slice(1).join(" ")]
      : [titleText, ""];

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
            <div className="overflow-hidden rounded-3xl border border-white/60 bg-white/65 shadow-[0_30px_80px_-40px_rgba(0,0,0,.45)] backdrop-blur">
              <div className="grid lg:grid-cols-12">
                <div className="relative min-h-[21rem] lg:col-span-7">
                  <SmartImage src={theme.heroImage} alt={couple.wedding.title} className="h-full w-full object-cover" loading="eager" />
                  <div className={`absolute inset-0 ${theme.heroOverlay}`} />
                  <div className="absolute inset-0 bg-[linear-gradient(90deg,rgba(11,11,11,.35),transparent_45%,rgba(255,255,255,.06))]" />
                </div>
                <div className="relative flex items-center justify-center p-4 md:p-8 lg:col-span-5">
                  <div className="absolute inset-0 bg-[linear-gradient(165deg,#fdfcf9_0%,#f7f1e6_45%,#fdfbf7_100%)]" />
                  <div className="absolute inset-0 opacity-50 [background:radial-gradient(circle_at_18%_20%,rgba(203,169,113,.15),transparent_40%),radial-gradient(circle_at_90%_90%,rgba(188,146,85,.12),transparent_42%)]" />
                  <div className="relative w-full rounded-[2rem] border border-[#e7decd] bg-white/88 p-5 text-center shadow-[0_26px_60px_-36px_rgba(0,0,0,.42)] md:p-8">
                    <p className="mx-auto inline-flex rounded-full border border-[#d8cbb6] px-6 py-1 text-xs tracking-[0.22em] text-[#6f6659]">
                      WEDDING DAY
                    </p>
                    <div className="mx-auto mt-4 h-px w-24 bg-gradient-to-r from-transparent via-[#d6ba89] to-transparent" />
                    <h1
                      className="mt-4 text-5xl font-semibold leading-[0.9] tracking-[-0.01em] md:text-7xl"
                      style={{
                        fontFamily: "var(--font-heading)",
                        fontStyle: "italic",
                        backgroundImage: "linear-gradient(178deg,#efd6a3 0%,#c89c50 52%,#8f652c 100%)",
                        WebkitBackgroundClip: "text",
                        color: "transparent",
                        textShadow: "0 6px 20px rgba(125,89,42,.2)",
                      }}
                    >
                      {nameA}
                      {nameB ? <><br />{nameB}</> : null}
                    </h1>
                    <p className="mt-3 text-2xl font-medium tracking-[0.08em] text-[#caaf84]">{date}</p>
                    <div className="mt-6 grid grid-cols-4 gap-2 md:gap-3">
                      {[
                        [String(Math.max(1, couple.guests.length || 42)), "DIAS"],
                        ["14", "HORAS"],
                        ["22", "MIN"],
                        ["05", "SEG"],
                      ].map(([value, label]) => (
                        <div key={label} className="rounded-2xl border border-[#ded4c6] bg-white p-2 shadow-[0_10px_22px_-18px_rgba(0,0,0,.3)] md:p-3">
                          <p className="text-3xl leading-tight text-[#3f3c39]">{value}</p>
                          <p className="text-[11px] tracking-[0.13em] text-[#777066]">{label}</p>
                        </div>
                      ))}
                    </div>
                    <Link href={`/${slug}/presentes`}>
                      <Button className="mt-6 w-full rounded-2xl bg-[linear-gradient(110deg,#90601e,#b6822f,#dcac49)] py-6 text-lg font-semibold text-white shadow-[0_16px_30px_-16px_rgba(128,90,39,.72)] md:w-auto md:px-14">
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
