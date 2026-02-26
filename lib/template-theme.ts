export type TemplateTheme = {
  key: string;
  shellClass: string;
  frameClass: string;
  navClass: string;
  contentCardClass: string;
  sidebarCardClass: string;
  heroImage: string;
  heroOverlay: string;
  titleClass: string;
  mutedClass: string;
  accent: string;
};

const themes: Record<string, TemplateTheme> = {
  "luxe-minimal": {
    key: "luxe-minimal",
    shellClass: "bg-[radial-gradient(circle_at_top,#fffaf1_0%,#f7efdf_45%,#ecdfc7_100%)]",
    frameClass: "border-amber-100/80 bg-[#fdf8ef]/80",
    navClass: "border-amber-200/55 bg-[#f5ead6]/70 text-[#6f5430]",
    contentCardClass: "border-amber-100/70 bg-white/85",
    sidebarCardClass: "border-amber-200/70 bg-[#fcf6ea]/85",
    heroImage: "https://images.unsplash.com/photo-1519741497674-611481863552?w=1800&q=80&auto=format&fit=crop",
    heroOverlay: "bg-[linear-gradient(to_bottom,rgba(107,83,43,.2),rgba(107,83,43,.45))]",
    titleClass: "text-[#5a4427]",
    mutedClass: "text-[#7e6b50]",
    accent: "#9a7642",
  },
  "romantic-contemporary": {
    key: "romantic-contemporary",
    shellClass: "bg-[radial-gradient(circle_at_top,#fff7fb_0%,#fcecf3_46%,#f6deea_100%)]",
    frameClass: "border-rose-100/80 bg-[#fff7fb]/80",
    navClass: "border-rose-200/60 bg-[#fdeaf2]/70 text-[#95566d]",
    contentCardClass: "border-rose-100/80 bg-white/85",
    sidebarCardClass: "border-rose-200/70 bg-[#fff1f6]/85",
    heroImage: "https://images.unsplash.com/photo-1511285560929-80b456fea0bc?w=1800&q=80&auto=format&fit=crop",
    heroOverlay: "bg-[linear-gradient(to_bottom,rgba(123,56,86,.16),rgba(123,56,86,.48))]",
    titleClass: "text-[#8e3f60]",
    mutedClass: "text-[#9a6a80]",
    accent: "#be6889",
  },
  "black-gold": {
    key: "black-gold",
    shellClass: "bg-[radial-gradient(circle_at_top,#1e1b16_0%,#14110e_48%,#090807_100%)]",
    frameClass: "border-amber-300/25 bg-black/45",
    navClass: "border-amber-300/30 bg-black/60 text-amber-100",
    contentCardClass: "border-amber-300/20 bg-[#0d0d0d]/80",
    sidebarCardClass: "border-amber-300/35 bg-[#12100c]/85",
    heroImage: "https://images.unsplash.com/photo-1537633552985-df8429e8048b?w=1800&q=80&auto=format&fit=crop",
    heroOverlay: "bg-[linear-gradient(to_bottom,rgba(0,0,0,.25),rgba(0,0,0,.72))]",
    titleClass: "text-amber-100",
    mutedClass: "text-amber-50/70",
    accent: "#d0a95a",
  },
  "destination-beach": {
    key: "destination-beach",
    shellClass: "bg-[radial-gradient(circle_at_top,#eefbff_0%,#dff2fb_46%,#cfe8f6_100%)]",
    frameClass: "border-sky-100/85 bg-[#f4fbff]/80",
    navClass: "border-sky-200/65 bg-[#e2f5ff]/65 text-[#34718f]",
    contentCardClass: "border-sky-100/80 bg-white/85",
    sidebarCardClass: "border-cyan-200/70 bg-[#ecf9ff]/85",
    heroImage: "https://images.unsplash.com/photo-1507525428034-b723cf961d3e?w=1800&q=80&auto=format&fit=crop",
    heroOverlay: "bg-[linear-gradient(to_bottom,rgba(23,86,112,.1),rgba(23,86,112,.45))]",
    titleClass: "text-[#2f6986]",
    mutedClass: "text-[#4f7f98]",
    accent: "#2f9bc7",
  },
  "classic-elegance": {
    key: "classic-elegance",
    shellClass: "bg-[radial-gradient(circle_at_top,#fbfaf8_0%,#f2efea_48%,#e7e1d8_100%)]",
    frameClass: "border-stone-200/80 bg-[#faf8f5]/80",
    navClass: "border-stone-200/70 bg-[#efebe4]/68 text-[#5b4f40]",
    contentCardClass: "border-stone-200/80 bg-white/86",
    sidebarCardClass: "border-stone-300/75 bg-[#f6f2ec]/88",
    heroImage: "https://images.unsplash.com/photo-1519225421980-715cb0215aed?w=1800&q=80&auto=format&fit=crop",
    heroOverlay: "bg-[linear-gradient(to_bottom,rgba(51,45,36,.18),rgba(51,45,36,.5))]",
    titleClass: "text-[#473a2f]",
    mutedClass: "text-[#7a6a58]",
    accent: "#8a745e",
  },
  "modern-neutral": {
    key: "modern-neutral",
    shellClass: "bg-[radial-gradient(circle_at_top,#f6f8fc_0%,#eaedf5_46%,#dde4ef_100%)]",
    frameClass: "border-slate-200/85 bg-[#f8faff]/78",
    navClass: "border-slate-200/70 bg-[#e8edf7]/68 text-[#425777]",
    contentCardClass: "border-slate-200/80 bg-white/86",
    sidebarCardClass: "border-slate-300/75 bg-[#edf2fb]/85",
    heroImage: "https://images.unsplash.com/photo-1513278974582-3e1b4a4fa21d?w=1800&q=80&auto=format&fit=crop",
    heroOverlay: "bg-[linear-gradient(to_bottom,rgba(39,58,89,.16),rgba(39,58,89,.55))]",
    titleClass: "text-[#344a67]",
    mutedClass: "text-[#5f738f]",
    accent: "#4c6488",
  },
};

export function getTemplateTheme(key?: string | null) {
  return themes[key ?? "modern-neutral"] ?? themes["modern-neutral"];
}

