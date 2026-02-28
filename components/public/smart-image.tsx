"use client";

import Image from "next/image";
import { useMemo, useState } from "react";
import { cn } from "@/lib/utils";

const BREAKPOINT_WIDTHS = [640, 960, 1280, 1600, 2048];

function fallbackFrom(src: string) {
  const seed = encodeURIComponent(src || "gift");
  return [
    `https://loremflickr.com/1200/900/wedding,gift?lock=${Math.abs(seed.length * 97)}`,
    `https://picsum.photos/seed/${seed}/1200/900`,
  ];
}

function appendQuery(url: string, entries: Record<string, string>) {
  const [base, hash = ""] = url.split("#");
  const [path, query = ""] = base.split("?");
  const params = new URLSearchParams(query);
  for (const [key, value] of Object.entries(entries)) {
    params.set(key, value);
  }
  const next = `${path}?${params.toString()}`;
  return hash ? `${next}#${hash}` : next;
}

function optimizeSrc(url: string, width: number) {
  if (!url.startsWith("http")) return url;

  if (url.includes("res.cloudinary.com") && url.includes("/upload/")) {
    return url.replace("/upload/", `/upload/f_auto,q_auto:best,dpr_auto,c_limit,w_${width}/`);
  }

  if (url.includes("images.unsplash.com")) {
    return appendQuery(url, {
      auto: "format",
      fit: "max",
      q: "90",
      w: String(width),
    });
  }

  if (url.includes("images.pexels.com") || url.includes("picsum.photos")) {
    return appendQuery(url, {
      auto: "compress",
      cs: "tinysrgb",
      w: String(width),
    });
  }

  return url;
}

export function SmartImage({
  src,
  alt,
  className,
  loading = "lazy",
  sizes,
}: {
  src: string;
  alt: string;
  className?: string;
  loading?: "lazy" | "eager";
  sizes?: string;
}) {
  const fallbacks = useMemo(() => fallbackFrom(src), [src]);
  const [index, setIndex] = useState(0);
  const current = index === 0 ? src : fallbacks[index - 1];
  const finalSrc = useMemo(() => optimizeSrc(current, BREAKPOINT_WIDTHS[BREAKPOINT_WIDTHS.length - 1]), [current]);

  return (
    <Image
      src={finalSrc}
      sizes={sizes ?? "100vw"}
      alt={alt}
      width={2400}
      height={1600}
      className={cn("max-w-full", className)}
      loading={loading === "eager" ? undefined : "lazy"}
      priority={loading === "eager"}
      onError={() => {
        setIndex((prev) => (prev < fallbacks.length ? prev + 1 : prev));
      }}
    />
  );
}
