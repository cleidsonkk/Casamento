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
          <div key={l.id} className="grid grid-cols-3 rounded-xl border p-2 text-sm">
            <span>{l.action}</span>
            <span>{l.entity}</span>
            <span>{new Date(l.createdAt).toLocaleString("pt-BR")}</span>
          </div>
        ))}
      </div>
    </Card>
  );
}

