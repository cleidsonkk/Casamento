const brlFormatter = new Intl.NumberFormat("pt-BR", {
  style: "currency",
  currency: "BRL",
});

export function formatBRLFromCents(cents: number) {
  return brlFormatter.format((cents || 0) / 100);
}

export function formatCentsToInput(cents: number) {
  return ((cents || 0) / 100).toFixed(2).replace(".", ",");
}

export function parseCurrencyInputToCents(value: string) {
  const raw = (value || "").replace(/\s/g, "").replace("R$", "");
  if (!raw) return 0;

  let normalized = raw;
  if (raw.includes(",")) {
    normalized = raw.replace(/\./g, "").replace(",", ".");
  } else if (raw.includes(".")) {
    const lastDot = raw.lastIndexOf(".");
    const decimals = raw.length - lastDot - 1;
    if (decimals <= 2) {
      normalized = `${raw.slice(0, lastDot).replace(/\./g, "")}.${raw.slice(lastDot + 1)}`;
    } else {
      normalized = raw.replace(/\./g, "");
    }
  }

  const amount = Number(normalized);
  if (Number.isNaN(amount) || !Number.isFinite(amount)) return 0;
  return Math.max(0, Math.round(amount * 100));
}

