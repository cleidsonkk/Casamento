import { requireCoupleContext } from "@/lib/currentUser";
import { requireSession } from "@/lib/session";
import { db } from "@/lib/db";
import { getTemplateTheme } from "@/lib/template-theme";
import { DashboardHeaderClient } from "@/components/dashboard/header-client";

const links: Array<[string, string]> = [
  ["Visao Geral", "/dashboard"],
  ["Site", "/dashboard/site"],
  ["Convidados", "/dashboard/convidados"],
  ["RSVP", "/dashboard/rsvp"],
  ["Presentes", "/dashboard/presentes"],
  ["Pix", "/dashboard/pix"],
  ["Pedidos", "/dashboard/pedidos"],
  ["Logs", "/dashboard/logs"],
];

export default async function DashboardLayout({ children }: { children: React.ReactNode }) {
  const session = await requireSession();
  const { coupleId } = await requireCoupleContext();
  const [wedding, memberships] = await Promise.all([
    db.wedding.findUnique({
      where: { coupleId },
      include: { template: true },
    }),
    db.coupleMember.findMany({
      where: { userId: session.user.id },
      orderBy: { createdAt: "desc" },
      include: { couple: { select: { id: true, name: true, slug: true } } },
    }),
  ]);

  const theme = getTemplateTheme(wedding?.template?.key);
  const dark = wedding?.template?.key === "black-gold";
  const couples = memberships.map((item) => item.couple);

  return (
    <main className={`relative min-h-screen overflow-hidden ${theme.shellClass}`}>
      <div className="pointer-events-none absolute -left-24 top-20 h-80 w-80 rounded-full bg-white/35 blur-3xl" />
      <div className="pointer-events-none absolute -right-24 bottom-16 h-96 w-96 rounded-full bg-black/10 blur-3xl" />
      <DashboardHeaderClient
        title="Dashboard dos Noivos"
        dark={dark}
        userName={session.user.name || undefined}
        links={links.map(([label, href]) => ({ label, href }))}
        couples={couples}
        currentCoupleId={coupleId}
      />
      <div className="relative mx-auto max-w-7xl px-4 py-6 md:px-6 md:py-8">{children}</div>
    </main>
  );
}
