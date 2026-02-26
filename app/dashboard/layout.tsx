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
  const wedding = await db.wedding.findUnique({
    where: { coupleId },
    include: { template: true },
  });

  const theme = getTemplateTheme(wedding?.template?.key);
  const dark = wedding?.template?.key === "black-gold";

  return (
    <main className={`min-h-screen ${theme.shellClass}`}>
      <DashboardHeaderClient
        title="Dashboard dos Noivos"
        dark={dark}
        userName={session.user.name || undefined}
        links={links.map(([label, href]) => ({ label, href }))}
      />
      <div className="mx-auto max-w-7xl px-4 py-6 md:px-6 md:py-8">{children}</div>
    </main>
  );
}
