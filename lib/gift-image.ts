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
  cutlery: "https://images.pexels.com/photos/189333/pexels-photo-189333.jpeg?auto=compress&cs=tinysrgb&w=1200",
  cookware: "https://images.pexels.com/photos/6996319/pexels-photo-6996319.jpeg?auto=compress&cs=tinysrgb&w=1200",
  dinnerware: "https://images.pexels.com/photos/6287295/pexels-photo-6287295.jpeg?auto=compress&cs=tinysrgb&w=1200",
  "wine-glasses": "https://images.pexels.com/photos/1407846/pexels-photo-1407846.jpeg?auto=compress&cs=tinysrgb&w=1200",
  "coffee-machine": "https://images.pexels.com/photos/324028/pexels-photo-324028.jpeg?auto=compress&cs=tinysrgb&w=1200",
  "air-fryer": "https://images.pexels.com/photos/6996105/pexels-photo-6996105.jpeg?auto=compress&cs=tinysrgb&w=1200",
  blender: "https://images.pexels.com/photos/1362534/pexels-photo-1362534.jpeg?auto=compress&cs=tinysrgb&w=1200",
  microwave: "https://images.pexels.com/photos/5824519/pexels-photo-5824519.jpeg?auto=compress&cs=tinysrgb&w=1200",
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
  hotel: "https://images.pexels.com/photos/261102/pexels-photo-261102.jpeg?auto=compress&cs=tinysrgb&w=1200",
  "romantic-dinner": "https://images.pexels.com/photos/67468/pexels-photo-67468.jpeg?auto=compress&cs=tinysrgb&w=1200",
  "boat-trip": "https://images.pexels.com/photos/1001682/pexels-photo-1001682.jpeg?auto=compress&cs=tinysrgb&w=1200",
  spa: "https://images.pexels.com/photos/3188/love-romantic-bath-candlelight.jpg?auto=compress&cs=tinysrgb&w=1200",
  "car-rental": "https://images.pexels.com/photos/170811/pexels-photo-170811.jpeg?auto=compress&cs=tinysrgb&w=1200",
  gift: "https://images.pexels.com/photos/1666065/pexels-photo-1666065.jpeg?auto=compress&cs=tinysrgb&w=1200",
};

export function getGiftImageUrl(imageUrl: string | null | undefined, title: string, category: string) {
  const isBrokenUnsplashSource = (imageUrl ?? "").includes("source.unsplash.com");
  if (imageUrl && !isBrokenUnsplashSource) return imageUrl;
  return PHOTO_BY_KEY[keyFromGift(title, category)];
}
