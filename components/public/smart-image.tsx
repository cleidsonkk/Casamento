"use client";

import { useMemo, useState } from "react";
import { cn } from "@/lib/utils";

function fallbackFrom(src: string) {
  const seed = encodeURIComponent(src || "gift");
  return [
    `https://loremflickr.com/1200/900/wedding,gift?lock=${Math.abs(seed.length * 97)}`,
    `https://picsum.photos/seed/${seed}/1200/900`,
  ];
}

export function SmartImage({
  src,
  alt,
  className,
  loading = "lazy",
}: {
  src: string;
  alt: string;
  className?: string;
  loading?: "lazy" | "eager";
}) {
  const fallbacks = useMemo(() => fallbackFrom(src), [src]);
  const [index, setIndex] = useState(0);
  const current = index === 0 ? src : fallbacks[index - 1];

  return (
    <img
      src={current}
      alt={alt}
      className={cn("max-w-full", className)}
      loading={loading}
      decoding="async"
      onError={() => {
        setIndex((prev) => (prev < fallbacks.length ? prev + 1 : prev));
      }}
    />
  );
}
