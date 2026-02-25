import Link from "next/link";
import { requireSession } from "@/lib/session";

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
  await requireSession();
  return (
    <main className="min-h-screen">
      <header className="glass sticky top-0 z-30 border-b">
        <div className="mx-auto flex h-16 max-w-7xl items-center justify-between px-6">
          <p className="text-sm">Dashboard dos Noivos</p>
          <nav className="flex items-center gap-2 overflow-auto">
            {links.map(([label, href]) => (
              <Link key={href} href={href} className="rounded-full px-3 py-1 text-sm hover:bg-white/70">
                {label}
              </Link>
            ))}
            <Link href="/login" className="rounded-full px-3 py-1 text-sm hover:bg-white/70">
              Login
            </Link>
          </nav>
        </div>
      </header>
      <div className="mx-auto max-w-7xl px-6 py-8">{children}</div>
    </main>
  );
}
