"use client";

import Link from "next/link";
import { usePathname, useRouter } from "next/navigation";
import { signOut, useSession } from "next-auth/react";
import { useState } from "react";
import { Menu, X } from "lucide-react";
import { toast } from "sonner";
import { Button } from "@/components/ui/button";

type NavLink = { label: string; href: string };
type CoupleOption = { id: string; name: string; slug: string };

export function DashboardHeaderClient({
  title,
  dark,
  userName,
  links,
  couples,
  currentCoupleId,
}: {
  title: string;
  dark: boolean;
  userName?: string;
  links: NavLink[];
  couples: CoupleOption[];
  currentCoupleId: string;
}) {
  const pathname = usePathname();
  const router = useRouter();
  const { update } = useSession();
  const [open, setOpen] = useState(false);
  const [switching, setSwitching] = useState(false);
  const baseClass = dark ? "text-white" : "text-black";
  const hoverClass = dark ? "hover:bg-white/10" : "hover:bg-white/70";
  const activeClass = dark ? "bg-white/15" : "bg-white";

  async function switchCouple(nextCoupleId: string) {
    if (!nextCoupleId || nextCoupleId === currentCoupleId) return;
    setSwitching(true);
    try {
      await update({ coupleId: nextCoupleId } as never);
      router.refresh();
      setOpen(false);
      toast.success("Casal ativo atualizado.");
    } catch {
      toast.error("Nao foi possivel trocar o casal ativo.");
    } finally {
      setSwitching(false);
    }
  }

  return (
    <header className={`sticky top-0 z-30 border-b backdrop-blur ${dark ? "border-white/10 bg-black/45" : "border-white/60 bg-white/70"}`}>
      <div className="mx-auto flex min-h-16 max-w-7xl items-center justify-between gap-3 px-4 py-2 md:px-6">
        <div className="min-w-0">
          <p className={`text-[11px] tracking-[0.18em] ${dark ? "text-white/70" : "text-[var(--color-muted)]"}`}>PAINEL LUXO 2026</p>
          <p className={`text-sm ${baseClass}`}>{title}</p>
        </div>

        <div className="hidden min-w-0 items-center gap-2 lg:flex">
          <nav className="flex max-w-[34rem] items-center gap-1 overflow-x-auto rounded-full border border-white/60 bg-white/60 p-1 xl:max-w-[42rem]">
            {links.map((item) => (
              <Link
                key={item.href}
                href={item.href}
                className={`whitespace-nowrap rounded-full px-3 py-1 text-sm ${baseClass} ${hoverClass} ${pathname === item.href ? activeClass : ""} transition`}
              >
                {item.label}
              </Link>
            ))}
          </nav>
          <select
            className={`h-9 max-w-[20rem] rounded-full border px-3 text-sm ${dark ? "border-white/20 bg-black/30 text-white" : "border-[var(--color-border)] bg-white/90 shadow-sm"}`}
            value={currentCoupleId}
            disabled={switching}
            onChange={(e) => switchCouple(e.target.value)}
          >
            {couples.map((couple) => (
              <option key={couple.id} value={couple.id}>
                {couple.name}
              </option>
            ))}
          </select>
          <div className={`rounded-full px-3 py-1 text-sm ${baseClass} ${dark ? "bg-white/10" : "bg-white/90 shadow-sm"}`}>
            {userName || "Noivos"}
          </div>
          <Button
            type="button"
            variant="outline"
            className="h-9 px-4"
            onClick={() => signOut({ callbackUrl: "/login" })}
          >
            Sair
          </Button>
        </div>

        <button
          type="button"
          className={`rounded-full p-2 md:hidden ${baseClass} ${hoverClass}`}
          onClick={() => setOpen((v) => !v)}
          aria-label="Abrir menu"
        >
          {open ? <X size={18} /> : <Menu size={18} />}
        </button>
      </div>

      {open ? (
        <div className={`border-t px-4 pb-5 pt-3 md:hidden ${dark ? "border-white/10 bg-black/40" : "border-white/70 bg-white/90"}`}>
          <p className={`mb-2 text-sm ${baseClass}`}>{userName || "Noivos"}</p>
          <select
            className={`mb-3 h-10 w-full rounded-xl border px-3 text-sm ${dark ? "border-white/20 bg-black/30 text-white" : "border-[var(--color-border)] bg-white"}`}
            value={currentCoupleId}
            disabled={switching}
            onChange={(e) => switchCouple(e.target.value)}
          >
            {couples.map((couple) => (
              <option key={couple.id} value={couple.id}>
                {couple.name}
              </option>
            ))}
          </select>
          <nav className="grid gap-2">
            {links.map((item) => (
              <Link
                key={item.href}
                href={item.href}
                className={`rounded-xl px-3 py-2 text-sm ${baseClass} ${hoverClass} ${pathname === item.href ? activeClass : ""}`}
                onClick={() => setOpen(false)}
              >
                {item.label}
              </Link>
            ))}
          </nav>
          <Button
            type="button"
            variant="outline"
            className="mt-3 w-full"
            onClick={() => signOut({ callbackUrl: "/login" })}
          >
            Sair
          </Button>
        </div>
      ) : null}
    </header>
  );
}
