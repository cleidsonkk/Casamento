export type TemplateTheme = {
  key: string;
  shellClass: string;
  panelClass: string;
  heroImage: string;
  heroOverlay: string;
  accent: string;
};

const themes: Record<string, TemplateTheme> = {
  "luxe-minimal": {
    key: "luxe-minimal",
    shellClass: "bg-[radial-gradient(circle_at_top,#fffaf1_0%,#f8f1e5_45%,#efe4d4_100%)]",
    panelClass: "border-amber-100/80 bg-white/75",
    heroImage: "https://images.unsplash.com/photo-1519741497674-611481863552?w=1800&q=80&auto=format&fit=crop",
    heroOverlay: "bg-[linear-gradient(to_bottom,rgba(53,39,17,.25),rgba(53,39,17,.55))]",
    accent: "#8e6d3b",
  },
  "romantic-contemporary": {
    key: "romantic-contemporary",
    shellClass: "bg-[radial-gradient(circle_at_top,#fff8fb_0%,#fdeff4_45%,#f7e5ed_100%)]",
    panelClass: "border-rose-100/80 bg-white/75",
    heroImage: "https://images.unsplash.com/photo-1511285560929-80b456fea0bc?w=1800&q=80&auto=format&fit=crop",
    heroOverlay: "bg-[linear-gradient(to_bottom,rgba(86,37,52,.22),rgba(86,37,52,.55))]",
    accent: "#b05674",
  },
  "black-gold": {
    key: "black-gold",
    shellClass: "bg-[radial-gradient(circle_at_top,#1a1a1a_0%,#101010_50%,#090909_100%)]",
    panelClass: "border-amber-300/20 bg-black/45",
    heroImage: "https://images.unsplash.com/photo-1537633552985-df8429e8048b?w=1800&q=80&auto=format&fit=crop",
    heroOverlay: "bg-[linear-gradient(to_bottom,rgba(0,0,0,.3),rgba(0,0,0,.7))]",
    accent: "#d6b062",
  },
  "destination-beach": {
    key: "destination-beach",
    shellClass: "bg-[radial-gradient(circle_at_top,#f0fbff_0%,#e5f6ff_45%,#d5eef8_100%)]",
    panelClass: "border-sky-100/80 bg-white/75",
    heroImage: "https://images.unsplash.com/photo-1507525428034-b723cf961d3e?w=1800&q=80&auto=format&fit=crop",
    heroOverlay: "bg-[linear-gradient(to_bottom,rgba(18,85,112,.15),rgba(18,85,112,.45))]",
    accent: "#1f84ae",
  },
  "classic-elegance": {
    key: "classic-elegance",
    shellClass: "bg-[radial-gradient(circle_at_top,#f8f8f8_0%,#f1efec_45%,#e8e3db_100%)]",
    panelClass: "border-stone-200/80 bg-white/80",
    heroImage: "https://images.unsplash.com/photo-1519225421980-715cb0215aed?w=1800&q=80&auto=format&fit=crop",
    heroOverlay: "bg-[linear-gradient(to_bottom,rgba(45,40,32,.22),rgba(45,40,32,.5))]",
    accent: "#5b4631",
  },
  "modern-neutral": {
    key: "modern-neutral",
    shellClass: "bg-[radial-gradient(circle_at_top,#f7f8fb_0%,#eceff5_48%,#dde3ee_100%)]",
    panelClass: "border-slate-200/85 bg-white/78",
    heroImage: "https://images.unsplash.com/photo-1513278974582-3e1b4a4fa21d?w=1800&q=80&auto=format&fit=crop",
    heroOverlay: "bg-[linear-gradient(to_bottom,rgba(35,49,72,.18),rgba(35,49,72,.56))]",
    accent: "#3f567a",
  },
};

export function getTemplateTheme(key?: string | null) {
  return themes[key ?? "modern-neutral"] ?? themes["modern-neutral"];
}

