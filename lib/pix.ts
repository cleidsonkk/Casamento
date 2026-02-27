const GUI = "br.gov.bcb.pix";

const id = (value: string, code: string) => `${code}${value.length.toString().padStart(2, "0")}${value}`;

function onlyAsciiUpper(value: string) {
  return (value || "")
    .normalize("NFD")
    .replace(/[\u0300-\u036f]/g, "")
    .replace(/[^A-Za-z0-9 $%*+\-./:]/g, " ")
    .replace(/\s+/g, " ")
    .trim()
    .toUpperCase();
}

function normalizePixKey(rawKey: string) {
  const key = (rawKey || "").trim();
  if (!key) return key;
  if (key.startsWith("+")) return key;

  const digits = key.replace(/\D/g, "");
  // Heuristic for Brazilian mobile phone key (AA + 9 + 8 digits)
  if (digits.length === 11 && digits[2] === "9") {
    return `+55${digits}`;
  }
  return key;
}

function crc16(payload: string) {
  let crc = 0xffff;
  for (let i = 0; i < payload.length; i += 1) {
    crc ^= payload.charCodeAt(i) << 8;
    for (let j = 0; j < 8; j += 1) {
      crc = (crc & 0x8000) !== 0 ? (crc << 1) ^ 0x1021 : crc << 1;
    }
  }
  return (crc & 0xffff).toString(16).toUpperCase().padStart(4, "0");
}

export function buildPixPayload(input: {
  key: string;
  receiverName: string;
  city: string;
  amountCents: number;
  txid: string;
  description?: string;
}) {
  const amount = (input.amountCents / 100).toFixed(2);
  const key = normalizePixKey(input.key);
  const receiverName = onlyAsciiUpper(input.receiverName).slice(0, 25) || "RECEBEDOR";
  const city = onlyAsciiUpper(input.city).slice(0, 15) || "SAO PAULO";
  const description = input.description ? onlyAsciiUpper(input.description).slice(0, 72) : "";
  const txid = onlyAsciiUpper(input.txid).replace(/[^A-Z0-9]/g, "").slice(0, 25) || "***";

  const merchant =
    id(id(GUI, "00") + id(key, "01") + (description ? id(description, "02") : ""), "26");
  const payloadNoCrc = [
    id("01", "00"),
    id("11", "01"),
    merchant,
    id("0000", "52"),
    id("986", "53"),
    id(amount, "54"),
    id("BR", "58"),
    id(receiverName, "59"),
    id(city, "60"),
    id(id(txid, "05"), "62"),
    "6304",
  ].join("");
  return `${payloadNoCrc}${crc16(payloadNoCrc)}`;
}
