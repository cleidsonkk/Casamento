"use client";

import { useEffect, useState } from "react";
import { Card } from "@/components/ui/card";

type Template = { id: string; key: string; name: string };

export default function AdminTemplatesPage() {
  const [templates, setTemplates] = useState<Template[]>([]);
  useEffect(() => {
    fetch("/api/admin/templates").then((r) => r.json()).then((d) => setTemplates(d.templates ?? []));
  }, []);
  return (
    <Card className="p-5">
      <h1 className="mb-3 text-3xl">Templates</h1>
      {templates.map((t) => (
        <div key={t.id} className="border-b py-2 text-sm md:grid md:grid-cols-2 md:gap-2">
          <p className="break-words">{t.name}</p>
          <p className="break-words text-[var(--color-muted)] md:text-inherit">{t.key}</p>
        </div>
      ))}
    </Card>
  );
}
