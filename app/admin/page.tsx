"use client";

import { useEffect, useState } from "react";
import { Card } from "@/components/ui/card";

export default function AdminHome() {
  const [data, setData] = useState({ couples: 0, users: 0, orders: 0 });
  useEffect(() => {
    fetch("/api/admin").then((r) => r.json()).then(setData);
  }, []);
  return (
    <div className="grid gap-4 md:grid-cols-3">
      <Card className="p-5"><p>Casais</p><p className="text-4xl">{data.couples}</p></Card>
      <Card className="p-5"><p>Usuários</p><p className="text-4xl">{data.users}</p></Card>
      <Card className="p-5"><p>Pedidos</p><p className="text-4xl">{data.orders}</p></Card>
    </div>
  );
}

