import Link from "next/link";
import { requireCoupleContext } from "@/lib/currentUser";
import { db } from "@/lib/db";
import { getTemplateTheme } from "@/lib/template-theme";

const links = [
  ["Visão Geral", "/dashboard"],
  ["Site", "/dashboard/site"],
  ["Convidados", "/dashboard/convidados"],
  ["RSVP", "/dashboard/rsvp"],
  ["Presentes", "/dashboard/presentes"],
  ["Pix", "/dashboard/pix"],
  ["Pedidos", "/dashboard/pedidos"],
];

export default async function DashboardLayout({ children }: { children: React.ReactNode }) {
  const { coupleId } = await requireCoupleContext();
  const wedding = await db.wedding.findUnique({
    where: { coupleId },
    include: { template: true },
  });
  const theme = getTemplateTheme(wedding?.template?.key);
  const dark = wedding?.template?.key === "black-gold";
  return (
    <main className={`min-h-screen ${theme.shellClass}`}>
      <header className={`sticky top-0 z-30 border-b backdrop-blur ${dark ? "border-white/10 bg-black/35" : "border-black/10 bg-white/60"}`}>
        <div className="mx-auto flex h-16 max-w-7xl items-center justify-between px-6">
          <p className={`text-sm ${dark ? "text-white" : ""}`}>Dashboard dos Noivos</p>
          <nav className="flex items-center gap-2 overflow-auto">
            {links.map(([label, href]) => (
              <Link key={href} href={href} className={`rounded-full px-3 py-1 text-sm ${dark ? "text-white hover:bg-white/10" : "hover:bg-white/70"}`}>
                {label}
              </Link>
            ))}
            <Link href="/login" className={`rounded-full px-3 py-1 text-sm ${dark ? "text-white hover:bg-white/10" : "hover:bg-white/70"}`}>
              Login
            </Link>
          </nav>
        </div>
      </header>
      <div className="mx-auto max-w-7xl px-6 py-8">{children}</div>
    </main>
  );
}
