"use client";

import { useEffect, useState } from "react";
import { Card } from "@/components/ui/card";

type Log = { id: string; action: string; entity: string; createdAt: string };

export default function AdminLogsPage() {
  const [logs, setLogs] = useState<Log[]>([]);
  useEffect(() => {
    fetch("/api/admin/logs").then((r) => r.json()).then((d) => setLogs(d.logs ?? []));
  }, []);
  return (
    <Card className="p-5">
      <h1 className="mb-3 text-3xl">Audit Logs</h1>
      <div className="space-y-2">
        {logs.map((l) => (
          <div key={l.id} className="rounded-xl border p-3 text-sm md:grid md:grid-cols-3 md:gap-2 md:p-2">
            <p className="break-words">{l.action}</p>
            <p className="break-words text-[var(--color-muted)] md:text-inherit">{l.entity}</p>
            <p className="text-xs text-[var(--color-muted)] md:text-sm md:text-inherit">{new Date(l.createdAt).toLocaleString("pt-BR")}</p>
          </div>
        ))}
      </div>
    </Card>
  );
}
