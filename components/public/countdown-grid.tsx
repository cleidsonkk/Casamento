"use client";

import { useEffect, useState } from "react";
import { cn } from "@/lib/utils";

function splitRemaining(targetMs: number, nowMs: number) {
  const diff = Math.max(0, targetMs - nowMs);
  const totalSeconds = Math.floor(diff / 1000);
  const days = Math.floor(totalSeconds / 86400);
  const hours = Math.floor((totalSeconds % 86400) / 3600);
  const minutes = Math.floor((totalSeconds % 3600) / 60);
  const seconds = totalSeconds % 60;
  return { days, hours, minutes, seconds };
}

function twoDigits(value: number) {
  return String(value).padStart(2, "0");
}

export function CountdownGrid({
  targetMs,
  className,
  cellClassName,
  valueClassName,
  labelClassName,
}: {
  targetMs?: number | null;
  className?: string;
  cellClassName?: string;
  valueClassName?: string;
  labelClassName?: string;
}) {
  const [nowMs, setNowMs] = useState(() => Date.now());

  useEffect(() => {
    const timer = window.setInterval(() => setNowMs(Date.now()), 1000);
    return () => window.clearInterval(timer);
  }, []);

  const remaining = targetMs && Number.isFinite(targetMs) ? splitRemaining(targetMs, nowMs) : { days: 0, hours: 0, minutes: 0, seconds: 0 };
  const items: Array<[string, string]> = [
    [String(remaining.days), "DIAS"],
    [twoDigits(remaining.hours), "HORAS"],
    [twoDigits(remaining.minutes), "MIN"],
    [twoDigits(remaining.seconds), "SEG"],
  ];

  return (
    <div className={cn("grid grid-cols-2 gap-2 sm:grid-cols-4 md:gap-3", className)}>
      {items.map(([value, label]) => (
        <div key={label} className={cn("rounded-2xl border p-2 shadow-[0_10px_22px_-18px_rgba(0,0,0,.3)] md:p-3", cellClassName)}>
          <p className={cn("text-3xl leading-tight", valueClassName)}>{value}</p>
          <p className={cn("text-[11px] tracking-[0.13em]", labelClassName)}>{label}</p>
        </div>
      ))}
    </div>
  );
}
