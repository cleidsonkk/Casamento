import { cn } from "@/lib/utils";

export function Card(props: React.HTMLAttributes<HTMLDivElement>) {
  return (
    <div
      {...props}
      className={cn(
        "rounded-[var(--radius-card)] border border-[var(--color-border)] bg-[var(--color-card)] shadow-[0_12px_30px_-20px_rgba(0,0,0,.35)]",
        props.className,
      )}
    />
  );
}

