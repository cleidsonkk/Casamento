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
  | "stove"
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
  | "airport-transfer"
  | "fuel"
  | "honeymoon-quota"
  | "photo-quota"
  | "music-quota"
  | "beer-help"
  | "gas-cylinder-help"
  | "gift";

function containsAny(value: string, terms: string[]) {
  return terms.some((term) => value.includes(term));
}

function keyFromGift(title: string, category: string): GiftKey {
  const t = normalize(title);
  const c = normalize(category);

  if (containsAny(t, ["talher", "faqueiro"])) return "cutlery";
  if (containsAny(t, ["panela"])) return "cookware";
  if (containsAny(t, ["aparelho de jantar", "prato", "jantar"])) return "dinnerware";
  if (containsAny(t, ["taca", "copo", "cristal"])) return "wine-glasses";
  if (containsAny(t, ["cafeteira", "cafe"])) return "coffee-machine";
  if (containsAny(t, ["air fryer"])) return "air-fryer";
  if (containsAny(t, ["liquidificador"])) return "blender";
  if (containsAny(t, ["micro-ondas"])) return "microwave";
  if (containsAny(t, ["fogao", "cooktop", "forno"])) return "stove";
  if (containsAny(t, ["roupa de cama", "edredom", "colcha", "lencol"])) return "bed-linen";
  if (containsAny(t, ["toalha", "banho"])) return "bath-towels";
  if (containsAny(t, ["almofada"])) return "pillows";
  if (containsAny(t, ["tapete"])) return "rug";
  if (containsAny(t, ["poltrona", "cadeira"])) return "armchair";
  if (containsAny(t, ["luminaria", "abajur", "lampada"])) return "lamp";
  if (containsAny(t, ["organizador", "closet"])) return "closet-organizer";
  if (containsAny(t, ["caixa", "empilhavel"])) return "storage-boxes";
  if (containsAny(t, ["cabide"])) return "hangers";
  if (containsAny(t, ["mala"])) return "suitcase";
  if (containsAny(t, ["passagem", "aviao", "aerea"])) return "airplane";
  if (containsAny(t, ["hotel", "diaria"])) return "hotel";
  if (containsAny(t, ["jantar romantico"])) return "romantic-dinner";
  if (containsAny(t, ["barco"])) return "boat-trip";
  if (containsAny(t, ["spa"])) return "spa";
  if (containsAny(t, ["aluguel de carro", "carro"]) || c.includes("transporte")) return "car-rental";
  if (containsAny(t, ["transfer aeroporto", "transfer"])) return "airport-transfer";
  if (containsAny(t, ["combustivel", "gasolina"])) return "fuel";
  if (containsAny(t, ["cota de lua de mel", "lua de mel"])) return "honeymoon-quota";
  if (containsAny(t, ["cota de fotografia", "fotografia", "foto"])) return "photo-quota";
  if (containsAny(t, ["cota de musica", "musica", "banda", "dj"])) return "music-quota";
  if (containsAny(t, ["cerveja", "beer"])) return "beer-help";
  if (containsAny(t, ["botijao", "gas"])) return "gas-cylinder-help";

  if (c.includes("cozinha")) return "cookware";
  if (c.includes("quarto")) return "bed-linen";
  if (c.includes("banho")) return "bath-towels";
  if (c.includes("decoracao")) return "lamp";
  if (c.includes("organizacao")) return "closet-organizer";
  if (c.includes("viagem")) return "honeymoon-quota";
  if (c.includes("experiencias")) return "romantic-dinner";
  if (c.includes("cotas")) return "honeymoon-quota";
  return "gift";
}

const PHOTO_BY_KEY: Record<GiftKey, string> = {
  cutlery: "https://images.pexels.com/photos/189333/pexels-photo-189333.jpeg?auto=compress&cs=tinysrgb&w=1200",
  cookware: "https://images.pexels.com/photos/6996319/pexels-photo-6996319.jpeg?auto=compress&cs=tinysrgb&w=1200",
  dinnerware: "https://images.pexels.com/photos/6287295/pexels-photo-6287295.jpeg?auto=compress&cs=tinysrgb&w=1200",
  "wine-glasses": "https://images.pexels.com/photos/1407846/pexels-photo-1407846.jpeg?auto=compress&cs=tinysrgb&w=1200",
  "coffee-machine": "https://images.pexels.com/photos/324028/pexels-photo-324028.jpeg?auto=compress&cs=tinysrgb&w=1200",
  "air-fryer": "https://images.pexels.com/photos/6996105/pexels-photo-6996105.jpeg?auto=compress&cs=tinysrgb&w=1200",
  blender: "https://images.pexels.com/photos/1362534/pexels-photo-1362534.jpeg?auto=compress&cs=tinysrgb&w=1200",
  microwave: "https://images.pexels.com/photos/5824519/pexels-photo-5824519.jpeg?auto=compress&cs=tinysrgb&w=1200",
  stove: "https://images.pexels.com/photos/4108716/pexels-photo-4108716.jpeg?auto=compress&cs=tinysrgb&w=1200",
  "bed-linen": "https://images.pexels.com/photos/164595/pexels-photo-164595.jpeg?auto=compress&cs=tinysrgb&w=1200",
  "bath-towels": "https://images.pexels.com/photos/271618/pexels-photo-271618.jpeg?auto=compress&cs=tinysrgb&w=1200",
  pillows: "https://images.pexels.com/photos/2119714/pexels-photo-2119714.jpeg?auto=compress&cs=tinysrgb&w=1200",
  rug: "https://images.pexels.com/photos/1571460/pexels-photo-1571460.jpeg?auto=compress&cs=tinysrgb&w=1200",
  armchair: "https://images.pexels.com/photos/276583/pexels-photo-276583.jpeg?auto=compress&cs=tinysrgb&w=1200",
  lamp: "https://images.pexels.com/photos/112811/pexels-photo-112811.jpeg?auto=compress&cs=tinysrgb&w=1200",
  "closet-organizer": "https://images.pexels.com/photos/6585754/pexels-photo-6585754.jpeg?auto=compress&cs=tinysrgb&w=1200",
  "storage-boxes": "https://images.pexels.com/photos/4246116/pexels-photo-4246116.jpeg?auto=compress&cs=tinysrgb&w=1200",
  hangers: "https://images.pexels.com/photos/6311392/pexels-photo-6311392.jpeg?auto=compress&cs=tinysrgb&w=1200",
  suitcase: "https://images.pexels.com/photos/1008155/pexels-photo-1008155.jpeg?auto=compress&cs=tinysrgb&w=1200",
  airplane: "https://images.pexels.com/photos/62623/wing-plane-flying-airplane-62623.jpeg?auto=compress&cs=tinysrgb&w=1200",
  hotel: "https://images.pexels.com/photos/271624/pexels-photo-271624.jpeg?auto=compress&cs=tinysrgb&w=1200",
  "romantic-dinner": "https://images.pexels.com/photos/67468/pexels-photo-67468.jpeg?auto=compress&cs=tinysrgb&w=1200",
  "boat-trip": "https://images.pexels.com/photos/1001682/pexels-photo-1001682.jpeg?auto=compress&cs=tinysrgb&w=1200",
  spa: "https://images.pexels.com/photos/3188/love-romantic-bath-candlelight.jpg?auto=compress&cs=tinysrgb&w=1200",
  "car-rental": "https://images.pexels.com/photos/170811/pexels-photo-170811.jpeg?auto=compress&cs=tinysrgb&w=1200",
  "airport-transfer": "https://images.pexels.com/photos/912050/pexels-photo-912050.jpeg?auto=compress&cs=tinysrgb&w=1200",
  fuel: "https://images.pexels.com/photos/13861/IMG_3496bfree.jpg?auto=compress&cs=tinysrgb&w=1200",
  "honeymoon-quota": "https://images.pexels.com/photos/457882/pexels-photo-457882.jpeg?auto=compress&cs=tinysrgb&w=1200",
  "photo-quota": "https://images.pexels.com/photos/2253879/pexels-photo-2253879.jpeg?auto=compress&cs=tinysrgb&w=1200",
  "music-quota": "https://images.pexels.com/photos/1763075/pexels-photo-1763075.jpeg?auto=compress&cs=tinysrgb&w=1200",
  "beer-help": "https://images.pexels.com/photos/1267320/pexels-photo-1267320.jpeg?auto=compress&cs=tinysrgb&w=1200",
  "gas-cylinder-help": "https://images.unsplash.com/photo-1581093458791-9f3c3900df4b?auto=format&fit=crop&w=1200&q=80",
  gift: "https://images.pexels.com/photos/1666065/pexels-photo-1666065.jpeg?auto=compress&cs=tinysrgb&w=1200",
};

export function getStableGiftImageUrl(title: string, category: string) {
  return PHOTO_BY_KEY[keyFromGift(title, category)];
}

export function hasWeakGiftImage(imageUrl: string | null | undefined) {
  const value = imageUrl ?? "";
  return !value || value.includes("source.unsplash.com") || value.includes("loremflickr.com");
}

export function getGiftImageUrl(imageUrl: string | null | undefined, title: string, category: string) {
  if (imageUrl && !hasWeakGiftImage(imageUrl)) return imageUrl;
  return getStableGiftImageUrl(title, category);
}
