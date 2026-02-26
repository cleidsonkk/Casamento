function normalize(value: string) {
  return (value || "")
    .normalize("NFD")
    .replace(/[\u0300-\u036f]/g, "")
    .toLowerCase();
}

function hashCode(value: string) {
  let hash = 0;
  for (let i = 0; i < value.length; i += 1) {
    hash = (hash << 5) - hash + value.charCodeAt(i);
    hash |= 0;
  }
  return Math.abs(hash);
}

function keywordFromGift(title: string, category: string) {
  const t = normalize(title);
  const c = normalize(category);

  if (t.includes("talher")) return "cutlery";
  if (t.includes("panela")) return "cooking-pot";
  if (t.includes("jantar") || t.includes("prato")) return "dinner-table";
  if (t.includes("taca") || t.includes("copo")) return "wine-glass";
  if (t.includes("cafeteira") || t.includes("cafe")) return "coffee-maker";
  if (t.includes("air fryer")) return "air-fryer";
  if (t.includes("liquidificador")) return "blender";
  if (t.includes("micro-ondas")) return "microwave";
  if (t.includes("cama") || t.includes("edredom")) return "bedroom";
  if (t.includes("toalha") || t.includes("banho")) return "bathroom";
  if (t.includes("almofada") || t.includes("tapete")) return "home-decor";
  if (t.includes("poltrona")) return "armchair";
  if (t.includes("luminaria")) return "lamp";
  if (t.includes("organizador") || t.includes("caixa") || t.includes("cabide")) return "closet-organization";
  if (t.includes("mala")) return "luggage";
  if (t.includes("passagem") || t.includes("aviao")) return "airplane-travel";
  if (t.includes("hotel")) return "hotel-room";
  if (t.includes("jantar romantico")) return "romantic-dinner";
  if (t.includes("barco")) return "boat-trip";
  if (t.includes("spa")) return "spa";
  if (t.includes("carro") || c.includes("transporte")) return "car";
  if (c.includes("cozinha")) return "kitchen";
  if (c.includes("quarto")) return "bedroom";
  if (c.includes("decoracao")) return "interior-design";
  if (c.includes("organizacao")) return "organization";
  if (c.includes("viagem")) return "travel";
  if (c.includes("experiencias")) return "experience";
  return "gift";
}

export function getGiftImageUrl(imageUrl: string | null | undefined, title: string, category: string) {
  if (imageUrl) return imageUrl;
  const keyword = keywordFromGift(title, category);
  const lock = hashCode(`${title}-${category}`);
  return `https://loremflickr.com/1200/900/${keyword}?lock=${lock}`;
}

