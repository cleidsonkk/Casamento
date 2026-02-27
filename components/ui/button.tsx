"use client";

import * as React from "react";
import { cn } from "@/lib/utils";

type Props = React.ButtonHTMLAttributes<HTMLButtonElement> & {
  variant?: "default" | "outline" | "ghost";
};

export function Button({ className, variant = "default", ...props }: Props) {
  return (
    <button
      className={cn(
        "inline-flex items-center justify-center rounded-[var(--radius-button)] px-4 py-2 text-sm font-medium transition-all duration-200",
        "focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[var(--color-primary)]/25",
        "disabled:cursor-not-allowed disabled:opacity-50",
        variant === "default" &&
          "bg-[linear-gradient(120deg,var(--color-primary),color-mix(in_srgb,var(--color-primary),white_18%))] text-white shadow-[0_14px_30px_-18px_rgba(0,0,0,.6)] hover:-translate-y-[1px] hover:shadow-[0_18px_34px_-18px_rgba(0,0,0,.68)]",
        variant === "outline" &&
          "border border-[var(--color-border)] bg-white/90 text-[var(--color-text)] shadow-[0_8px_18px_-16px_rgba(0,0,0,.4)] hover:bg-white hover:-translate-y-[1px]",
        variant === "ghost" && "text-[var(--color-text)] hover:bg-white/70",
        className,
      )}
      {...props}
    />
  );
}
