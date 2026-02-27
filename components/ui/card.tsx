import { cn } from "@/lib/utils";

export function Card(props: React.HTMLAttributes<HTMLDivElement>) {
  return (
    <div
      {...props}
      className={cn(
        "rounded-[var(--radius-card)] border border-[var(--color-border)] bg-[var(--color-card)]",
        "shadow-[0_18px_40px_-28px_rgba(0,0,0,.38)]",
        props.className,
      )}
    />
  );
}
