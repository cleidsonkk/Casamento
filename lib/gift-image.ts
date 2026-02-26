function categoryEmoji(category: string) {
  const c = (category || "").toLowerCase();
  if (c.includes("cozinha")) return "🍽️";
  if (c.includes("quarto")) return "🛏️";
  if (c.includes("decor")) return "🕯️";
  if (c.includes("organ")) return "🧺";
  if (c.includes("viagem")) return "✈️";
  if (c.includes("exper")) return "🎟️";
  if (c.includes("transporte")) return "🚗";
  if (c.includes("cotas")) return "💝";
  return "🎁";
}

export function getGiftImageUrl(imageUrl: string | null | undefined, title: string, category: string) {
  if (imageUrl) return imageUrl;
  const emoji = categoryEmoji(category);
  const safeTitle = (title || "Presente").replace(/[<>&"]/g, "");
  const svg = `<svg xmlns='http://www.w3.org/2000/svg' width='1200' height='900'>
  <defs>
    <linearGradient id='g' x1='0' y1='0' x2='1' y2='1'>
      <stop offset='0%' stop-color='#faf7f2'/>
      <stop offset='100%' stop-color='#efe7db'/>
    </linearGradient>
  </defs>
  <rect width='100%' height='100%' fill='url(#g)'/>
  <rect x='48' y='48' width='1104' height='804' rx='40' fill='white' fill-opacity='0.82'/>
  <text x='600' y='390' text-anchor='middle' font-size='140'>${emoji}</text>
  <text x='600' y='500' text-anchor='middle' font-size='52' font-family='serif' fill='#3f3b33'>${safeTitle}</text>
  <text x='600' y='560' text-anchor='middle' font-size='28' font-family='sans-serif' fill='#8b8478'>Ilustracao premium</text>
  </svg>`;
  return `data:image/svg+xml;utf8,${encodeURIComponent(svg)}`;
}

