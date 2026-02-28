import Link from "next/link";
import { notFound } from "next/navigation";
import { db } from "@/lib/db";
import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { RsvpForm } from "@/components/public/rsvp-form";
import { getTemplateTheme } from "@/lib/template-theme";
import { SmartImage } from "@/components/public/smart-image";

export default async function RsvpPage({ params }: { params: Promise<{ slug: string }> }) {
  const { slug } = await params;
  const couple = await db.couple.findUnique({
    where: { slug },
    include: {
      wedding: { include: { template: true, sections: true, gallery: { orderBy: { order: "asc" } } } },
    },
  });
  if (!couple?.wedding?.published) notFound();

  const theme = getTemplateTheme(couple.wedding.template?.key);
  const heroImageUrl =
    couple.wedding.sections.find((section) => section.type === "HERO_IMAGE")?.content ||
    couple.wedding.gallery[0]?.imageUrl ||
    theme.heroImage;

  return (
    <main className={`relative min-h-screen overflow-hidden ${theme.shellClass}`}>
      <div className="pointer-events-none absolute inset-x-0 top-0 h-64 bg-gradient-to-b from-white/65 to-transparent" />
      <div className="mx-auto max-w-6xl px-4 py-8 md:px-6 md:py-12">
        <div className={`overflow-hidden rounded-[2rem] border shadow-[0_35px_80px_-44px_rgba(0,0,0,.45)] ${theme.contentCardClass}`}>
          <div className="grid lg:grid-cols-12">
            <div className="relative min-h-[20rem] lg:col-span-5">
              <SmartImage src={heroImageUrl} alt={couple.wedding.title} className="h-full w-full object-cover" />
              <div className={`absolute inset-0 ${theme.heroOverlay}`} />
              <div className="absolute inset-x-6 bottom-6 text-white">
                <p className="text-xs tracking-[0.2em] text-white/80">RSVP PREMIUM</p>
                <p className="mt-2 text-4xl leading-tight" style={{ fontFamily: "var(--font-heading)" }}>{couple.wedding.title}</p>
              </div>
            </div>

            <div className="relative p-5 md:p-8 lg:col-span-7">
              <div className={`absolute inset-0 ${theme.heroRightBgClass}`} />
              <div className="relative">
                <Link href={`/${slug}`}>
                  <Button variant="ghost" className="mb-3">
                    Voltar
                  </Button>
                </Link>

                <Card className={`border p-5 md:p-7 ${theme.heroCardClass}`}>
                  <p className={`text-xs tracking-[0.18em] ${theme.mutedClass}`}>CONFIRMAÇÃO DE PRESENÇA</p>
                  <h1 className={`mt-1 text-3xl md:text-4xl ${theme.titleClass}`}>Confirme sua presença</h1>
                  <p className={`mb-5 mt-2 ${theme.mutedClass}`}>Fluxo rápido, elegante e seguro para seus convidados.</p>
                  <RsvpForm slug={slug} />
                </Card>
              </div>
            </div>
          </div>
        </div>
      </div>
    </main>
  );
}
