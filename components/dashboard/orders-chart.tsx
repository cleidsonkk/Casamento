"use client";

import {
  Bar,
  BarChart,
  CartesianGrid,
  Cell,
  ResponsiveContainer,
  Tooltip,
  XAxis,
  YAxis,
} from "recharts";

const statusLabel: Record<string, string> = {
  PENDING_PAYMENT: "Pendente",
  AWAITING_CONFIRMATION: "Aguardando",
  PAID: "Pago",
  CANCELED: "Cancelado",
  EXPIRED: "Expirado",
};

const statusColor: Record<string, string> = {
  PENDING_PAYMENT: "#c28a34",
  AWAITING_CONFIRMATION: "#5f7ea6",
  PAID: "#2e8b57",
  CANCELED: "#b65b5b",
  EXPIRED: "#8b8b8b",
};

const order = ["PENDING_PAYMENT", "AWAITING_CONFIRMATION", "PAID", "CANCELED", "EXPIRED"];

export function OrdersChart({ data }: { data: Array<{ status: string; total: number }> }) {
  const normalized = [...data]
    .sort((a, b) => order.indexOf(a.status) - order.indexOf(b.status))
    .map((item) => ({
      ...item,
      label: statusLabel[item.status] ?? item.status,
      fill: statusColor[item.status] ?? "#161616",
    }));

  if (!normalized.length) {
    return (
      <div className="flex h-72 w-full items-center justify-center rounded-2xl border border-dashed border-[var(--color-border)] bg-white/60">
        <div className="text-center">
          <p className="text-sm tracking-[0.16em] text-[var(--color-muted)]">SEM DADOS</p>
          <p className="mt-2 text-lg">Os pedidos aparecerao aqui</p>
        </div>
      </div>
    );
  }

  return (
    <div className="h-72 w-full rounded-2xl border border-white/70 bg-white/65 p-3">
      <ResponsiveContainer width="100%" height="100%">
        <BarChart data={normalized} margin={{ top: 12, right: 12, left: -18, bottom: 0 }}>
          <CartesianGrid strokeDasharray="3 4" stroke="#ebe7df" vertical={false} />
          <XAxis
            dataKey="label"
            tickLine={false}
            axisLine={false}
            tick={{ fontSize: 12, fill: "#6f6659" }}
          />
          <YAxis allowDecimals={false} tickLine={false} axisLine={false} tick={{ fontSize: 12, fill: "#6f6659" }} />
          <Tooltip
            cursor={{ fill: "rgba(199,151,72,.08)" }}
            contentStyle={{
              borderRadius: 14,
              border: "1px solid #e7decf",
              background: "rgba(255,255,255,.96)",
              boxShadow: "0 18px 40px -24px rgba(0,0,0,.35)",
            }}
            formatter={(value) => [`${value}`, "Pedidos"]}
          />
          <Bar dataKey="total" radius={[10, 10, 0, 0]} maxBarSize={62}>
            {normalized.map((item) => (
              <Cell key={item.status} fill={item.fill} />
            ))}
          </Bar>
        </BarChart>
      </ResponsiveContainer>
    </div>
  );
}
