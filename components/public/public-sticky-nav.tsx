"use client";

import { useEffect, useMemo, useState } from "react";
import Link from "next/link";
import { Button } from "@/components/ui/button";

type NavItem = { id: string; label: string };

export function PublicStickyNav({
  slug,
  items,
}: {
  slug: string;
  items: NavItem[];
}) {
  const [active, setActive] = useState(items[0]?.id ?? "");
  const [progress, setProgress] = useState(0);

  const ids = useMemo(() => items.map((item) => item.id), [items]);

  useEffect(() => {
    const onScroll = () => {
      const scrollTop = window.scrollY;
      const body = document.body;
      const doc = document.documentElement;
      const height = Math.max(body.scrollHeight, doc.scrollHeight) - window.innerHeight;
      setProgress(height > 0 ? Math.min(100, Math.max(0, (scrollTop / height) * 100)) : 0);

      let current = ids[0] ?? "";
      for (const id of ids) {
        const el = document.getElementById(id);
        if (!el) continue;
        const top = el.getBoundingClientRect().top;
        if (top <= 140) current = id;
      }
      setActive(current);
    };

    onScroll();
    window.addEventListener("scroll", onScroll, { passive: true });
    return () => window.removeEventListener("scroll", onScroll);
  }, [ids]);

  return (
    <>
      <header className="sticky top-0 z-40 border-b border-white/50 bg-white/75 backdrop-blur-xl">
        <div className="mx-auto max-w-7xl px-3 py-3 md:px-6">
          <div className="mb-2 h-1.5 overflow-hidden rounded-full bg-black/10">
            <div
              className="h-full rounded-full bg-[linear-gradient(90deg,#8b5e2a,#d7b071)] transition-all duration-300"
              style={{ width: `${progress}%` }}
            />
          </div>
          <div className="flex flex-col gap-3 md:flex-row md:items-center md:justify-between">
            <nav className="hidden flex-wrap items-center gap-2 md:flex">
              {items.map((item) => (
                <a
                  key={item.id}
                  href={`#${item.id}`}
                  className={`rounded-full px-4 py-2 text-sm transition ${
                    active === item.id ? "bg-black text-white" : "bg-white/80 text-[var(--color-muted)]"
                  }`}
                >
                  {item.label}
                </a>
              ))}
            </nav>
            <nav className="-mx-1 flex gap-2 overflow-x-auto px-1 pb-1 md:hidden">
              {items.map((item) => (
                <a
                  key={item.id}
                  href={`#${item.id}`}
                  className={`shrink-0 rounded-full px-3 py-2 text-xs transition ${
                    active === item.id ? "bg-black text-white" : "bg-white/85 text-[var(--color-muted)]"
                  }`}
                >
                  {item.label}
                </a>
              ))}
            </nav>
            <Link href={`/${slug}/rsvp`}>
              <Button className="h-10 w-full rounded-full px-6 sm:w-auto">Confirmar Presenca</Button>
            </Link>
          </div>
        </div>
      </header>

      <div className="fixed inset-x-0 bottom-3 z-40 px-4 md:hidden">
        <Link href={`/${slug}/rsvp`}>
          <Button className="h-12 w-full rounded-full shadow-[0_18px_40px_-22px_rgba(0,0,0,.55)]">
            Confirmar Presenca
          </Button>
        </Link>
      </div>
    </>
  );
}
