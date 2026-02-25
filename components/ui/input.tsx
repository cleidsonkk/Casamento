import * as React from "react";
import { cn } from "@/lib/utils";

export function Input(props: React.InputHTMLAttributes<HTMLInputElement>) {
  return (
    <input
      {...props}
      className={cn(
        "h-11 w-full rounded-[var(--radius-input)] border border-[var(--color-border)] bg-white px-3 text-sm outline-none transition",
        "focus:ring-2 focus:ring-[var(--color-primary)]/20",
        props.className,
      )}
    />
  );
}

