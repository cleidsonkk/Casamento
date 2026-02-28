"use client";

import { useEffect, useState } from "react";
import { toast } from "sonner";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { Input } from "@/components/ui/input";

type Couple = { id: string; name: string; slug: string };

export default function AdminCouplesPage() {
  const [couples, setCouples] = useState<Couple[]>([]);
  const load = () => fetch("/api/admin/couples").then((r) => r.json()).then((d) => setCouples(d.couples ?? []));
  useEffect(() => void load(), []);

  async function create(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault();
    const fd = new FormData(e.currentTarget);
    const res = await fetch("/api/admin/couples", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ name: fd.get("name"), slug: fd.get("slug") }),
    });
    if (!res.ok) return toast.error("Falha ao criar casal");
    toast.success("Casal criado");
    e.currentTarget.reset();
    load();
  }

  return (
    <div className="space-y-4">
      <Card className="p-5">
        <form className="grid gap-2 lg:grid-cols-3" onSubmit={create}>
          <Input name="name" placeholder="Nome do casal" required />
          <Input name="slug" placeholder="slug" />
          <Button>Criar</Button>
        </form>
      </Card>
      <Card className="p-5">
        {couples.map((c) => (
          <div key={c.id} className="border-b py-2 text-sm md:grid md:grid-cols-2 md:gap-2">
            <p className="break-words">{c.name}</p>
            <p className="break-words text-[var(--color-muted)] md:text-inherit">{c.slug}</p>
          </div>
        ))}
      </Card>
    </div>
  );
}
