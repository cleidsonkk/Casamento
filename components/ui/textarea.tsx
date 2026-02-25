import * as React from "react";
import { cn } from "@/lib/utils";

export function Textarea(props: React.TextareaHTMLAttributes<HTMLTextAreaElement>) {
  return (
    <textarea
      {...props}
      className={cn(
        "min-h-24 w-full rounded-[var(--radius-input)] border border-[var(--color-border)] bg-white px-3 py-2 text-sm outline-none transition",
        "focus:ring-2 focus:ring-[var(--color-primary)]/20",
        props.className,
      )}
    />
  );
}

