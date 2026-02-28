import Link from "next/link";
import { requireAdminContext } from "@/lib/currentUser";

const links = [
  ["Visão Geral", "/admin"],
  ["Casais", "/admin/casais"],
  ["Templates", "/admin/templates"],
  ["Catálogo", "/admin/catalogo-presentes"],
  ["Logs", "/admin/logs"],
];

export default async function AdminLayout({ children }: { children: React.ReactNode }) {
  await requireAdminContext();
  return (
    <main className="min-h-screen">
      <header className="glass sticky top-0 z-30 border-b">
        <div className="mx-auto flex h-16 max-w-7xl items-center gap-2 overflow-x-auto px-4 md:gap-3 md:px-6">
          {links.map(([label, href]) => (
            <Link key={href} href={href} className="whitespace-nowrap rounded-full px-3 py-1 text-sm hover:bg-white/70">
              {label}
            </Link>
          ))}
        </div>
      </header>
      <div className="mx-auto max-w-7xl px-4 py-6 md:px-6 md:py-8">{children}</div>
    </main>
  );
}
