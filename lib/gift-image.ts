function normalize(value: string) {
  return (value || "")
    .normalize("NFD")
    .replace(/[\u0300-\u036f]/g, "")
    .toLowerCase();
}

type GiftKey =
  | "cutlery"
  | "cookware"
  | "dinnerware"
  | "wine-glasses"
  | "coffee-machine"
  | "air-fryer"
  | "blender"
  | "microwave"
  | "bed-linen"
  | "bath-towels"
  | "pillows"
  | "rug"
  | "armchair"
  | "lamp"
  | "closet-organizer"
  | "storage-boxes"
  | "hangers"
  | "suitcase"
  | "airplane"
  | "hotel"
  | "romantic-dinner"
  | "boat-trip"
  | "spa"
  | "car-rental"
  | "gift";

function keyFromGift(title: string, category: string): GiftKey {
  const t = normalize(title);
  const c = normalize(category);
  if (t.includes("talher")) return "cutlery";
  if (t.includes("panela")) return "cookware";
  if (t.includes("jantar") || t.includes("prato")) return "dinnerware";
  if (t.includes("taca") || t.includes("copo")) return "wine-glasses";
  if (t.includes("cafeteira") || t.includes("cafe")) return "coffee-machine";
  if (t.includes("air fryer")) return "air-fryer";
  if (t.includes("liquidificador")) return "blender";
  if (t.includes("micro-ondas")) return "microwave";
  if (t.includes("roupa de cama") || t.includes("edredom")) return "bed-linen";
  if (t.includes("toalha") || t.includes("banho")) return "bath-towels";
  if (t.includes("almofada")) return "pillows";
  if (t.includes("tapete")) return "rug";
  if (t.includes("poltrona")) return "armchair";
  if (t.includes("luminaria")) return "lamp";
  if (t.includes("organizador")) return "closet-organizer";
  if (t.includes("caixa")) return "storage-boxes";
  if (t.includes("cabide")) return "hangers";
  if (t.includes("mala")) return "suitcase";
  if (t.includes("passagem") || t.includes("aviao")) return "airplane";
  if (t.includes("hotel")) return "hotel";
  if (t.includes("jantar romantico")) return "romantic-dinner";
  if (t.includes("barco")) return "boat-trip";
  if (t.includes("spa")) return "spa";
  if (t.includes("carro") || c.includes("transporte")) return "car-rental";
  return "gift";
}

const PHOTO_BY_KEY: Record<GiftKey, string> = {
  cutlery: "https://images.unsplash.com/photo-1525088553748-01d6e210e00b?w=1200&q=80&auto=format&fit=crop",
  cookware: "https://images.unsplash.com/photo-1584990347449-5a5d2d6ebf13?w=1200&q=80&auto=format&fit=crop",
  dinnerware: "https://images.unsplash.com/photo-1414235077428-338989a2e8c0?w=1200&q=80&auto=format&fit=crop",
  "wine-glasses": "https://images.unsplash.com/photo-1516594798947-e65505dbb29d?w=1200&q=80&auto=format&fit=crop",
  "coffee-machine": "https://images.unsplash.com/photo-1495474472287-4d71bcdd2085?w=1200&q=80&auto=format&fit=crop",
  "air-fryer": "https://images.unsplash.com/photo-1586201375761-83865001e31c?w=1200&q=80&auto=format&fit=crop",
  blender: "https://images.unsplash.com/photo-1570222094114-d054a817e56b?w=1200&q=80&auto=format&fit=crop",
  microwave: "https://images.unsplash.com/photo-1585652757173-57de5e9fab42?w=1200&q=80&auto=format&fit=crop",
  "bed-linen": "https://images.unsplash.com/photo-1505693416388-ac5ce068fe85?w=1200&q=80&auto=format&fit=crop",
  "bath-towels": "https://images.unsplash.com/photo-1631049552240-59c37f38802b?w=1200&q=80&auto=format&fit=crop",
  pillows: "https://images.unsplash.com/photo-1567016432779-094069958ea5?w=1200&q=80&auto=format&fit=crop",
  rug: "https://images.unsplash.com/photo-1604709177225-055f99402ea3?w=1200&q=80&auto=format&fit=crop",
  armchair: "https://images.unsplash.com/photo-1505691938895-1758d7feb511?w=1200&q=80&auto=format&fit=crop",
  lamp: "https://images.unsplash.com/photo-1507473885765-e6ed057f782c?w=1200&q=80&auto=format&fit=crop",
  "closet-organizer": "https://images.unsplash.com/photo-1558618666-fcd25c85cd64?w=1200&q=80&auto=format&fit=crop",
  "storage-boxes": "https://images.unsplash.com/photo-1588854337115-1c67d9247e4d?w=1200&q=80&auto=format&fit=crop",
  hangers: "https://images.unsplash.com/photo-1441986300917-64674bd600d8?w=1200&q=80&auto=format&fit=crop",
  suitcase: "https://images.unsplash.com/photo-1502920514313-52581002a659?w=1200&q=80&auto=format&fit=crop",
  airplane: "https://images.unsplash.com/photo-1436491865332-7a61a109cc05?w=1200&q=80&auto=format&fit=crop",
  hotel: "https://images.unsplash.com/photo-1566073771259-6a8506099945?w=1200&q=80&auto=format&fit=crop",
  "romantic-dinner": "https://images.unsplash.com/photo-1466978913421-dad2ebd01d17?w=1200&q=80&auto=format&fit=crop",
  "boat-trip": "https://images.unsplash.com/photo-1500375592092-40eb2168fd21?w=1200&q=80&auto=format&fit=crop",
  spa: "https://images.unsplash.com/photo-1544161515-4ab6ce6db874?w=1200&q=80&auto=format&fit=crop",
  "car-rental": "https://images.unsplash.com/photo-1493238792000-8113da705763?w=1200&q=80&auto=format&fit=crop",
  gift: "https://images.unsplash.com/photo-1512909006721-3d6018887383?w=1200&q=80&auto=format&fit=crop",
};

export function getGiftImageUrl(imageUrl: string | null | undefined, title: string, category: string) {
  const isBrokenUnsplashSource = (imageUrl ?? "").includes("source.unsplash.com");
  if (imageUrl && !isBrokenUnsplashSource) return imageUrl;
  return PHOTO_BY_KEY[keyFromGift(title, category)];
}

