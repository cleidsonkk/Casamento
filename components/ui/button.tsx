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
        "inline-flex items-center justify-center rounded-[var(--radius-button)] px-4 py-2 text-sm font-medium transition",
        "disabled:cursor-not-allowed disabled:opacity-50",
        variant === "default" && "bg-[var(--color-primary)] text-white hover:opacity-90",
        variant === "outline" && "border border-[var(--color-border)] bg-white hover:bg-neutral-50",
        variant === "ghost" && "hover:bg-neutral-100",
        className,
      )}
      {...props}
    />
  );
}

