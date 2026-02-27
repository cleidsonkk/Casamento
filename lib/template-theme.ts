export type TemplateTheme = {
  key: string;
  heroLayout: "split" | "overlay" | "editorial";
  headingFont: string;
  shellClass: string;
  frameClass: string;
  navClass: string;
  contentCardClass: string;
  sidebarCardClass: string;
  heroImage: string;
  heroOverlay: string;
  heroRightBgClass: string;
  heroCardClass: string;
  heroBadgeClass: string;
  heroDividerClass: string;
  heroNameGradient: string;
  heroNameShadow: string;
  heroDateClass: string;
  statBoxClass: string;
  ctaClass: string;
  titleClass: string;
  mutedClass: string;
  accent: string;
};

const themes: Record<string, TemplateTheme> = {
  "luxe-minimal": {
    key: "luxe-minimal",
    heroLayout: "split",
    headingFont: "var(--font-cormorant)",
    shellClass: "bg-[radial-gradient(circle_at_top,#fffaf1_0%,#f7efdf_45%,#ecdfc7_100%)]",
    frameClass: "border-amber-100/80 bg-[#fdf8ef]/80",
    navClass: "border-amber-200/55 bg-[#f5ead6]/70 text-[#6f5430]",
    contentCardClass: "border-amber-100/70 bg-white/85",
    sidebarCardClass: "border-amber-200/70 bg-[#fcf6ea]/85",
    heroImage: "https://images.unsplash.com/photo-1519741497674-611481863552?w=1800&q=80&auto=format&fit=crop",
    heroOverlay: "bg-[linear-gradient(to_bottom,rgba(107,83,43,.2),rgba(107,83,43,.45))]",
    heroRightBgClass: "bg-[linear-gradient(165deg,#fdfcf9_0%,#f7f1e6_45%,#fdfbf7_100%)]",
    heroCardClass: "border-[#e7decd] bg-white/88",
    heroBadgeClass: "border-[#d8cbb6] text-[#6f6659]",
    heroDividerClass: "from-transparent via-[#d6ba89] to-transparent",
    heroNameGradient: "linear-gradient(178deg,#efd6a3 0%,#c89c50 52%,#8f652c 100%)",
    heroNameShadow: "0 6px 20px rgba(125,89,42,.2)",
    heroDateClass: "text-[#caaf84]",
    statBoxClass: "border-[#ded4c6] bg-white",
    ctaClass: "bg-[linear-gradient(110deg,#90601e,#b6822f,#dcac49)] text-white shadow-[0_16px_30px_-16px_rgba(128,90,39,.72)]",
    titleClass: "text-[#5a4427]",
    mutedClass: "text-[#7e6b50]",
    accent: "#9a7642",
  },
  "romantic-contemporary": {
    key: "romantic-contemporary",
    heroLayout: "overlay",
    headingFont: "var(--font-cormorant)",
    shellClass: "bg-[radial-gradient(circle_at_top,#fff7fb_0%,#fcecf3_46%,#f6deea_100%)]",
    frameClass: "border-rose-100/80 bg-[#fff7fb]/80",
    navClass: "border-rose-200/60 bg-[#fdeaf2]/70 text-[#95566d]",
    contentCardClass: "border-rose-100/80 bg-white/85",
    sidebarCardClass: "border-rose-200/70 bg-[#fff1f6]/85",
    heroImage: "https://images.unsplash.com/photo-1511285560929-80b456fea0bc?w=1800&q=80&auto=format&fit=crop",
    heroOverlay: "bg-[linear-gradient(to_bottom,rgba(123,56,86,.16),rgba(123,56,86,.48))]",
    heroRightBgClass: "bg-[linear-gradient(165deg,#fffafd_0%,#fdeef4_45%,#fff9fb_100%)]",
    heroCardClass: "border-[#edd4df] bg-white/88",
    heroBadgeClass: "border-[#e8c6d4] text-[#8d5a6f]",
    heroDividerClass: "from-transparent via-[#d794b0] to-transparent",
    heroNameGradient: "linear-gradient(178deg,#f2bfd4 0%,#cf6d95 52%,#9f3f66 100%)",
    heroNameShadow: "0 6px 20px rgba(165,72,114,.2)",
    heroDateClass: "text-[#c680a0]",
    statBoxClass: "border-[#ead4de] bg-white",
    ctaClass: "bg-[linear-gradient(110deg,#944661,#b95f84,#d884aa)] text-white shadow-[0_16px_30px_-16px_rgba(148,70,97,.65)]",
    titleClass: "text-[#8e3f60]",
    mutedClass: "text-[#9a6a80]",
    accent: "#be6889",
  },
  "black-gold": {
    key: "black-gold",
    heroLayout: "editorial",
    headingFont: "var(--font-playfair)",
    shellClass: "bg-[radial-gradient(circle_at_top,#1e1b16_0%,#14110e_48%,#090807_100%)]",
    frameClass: "border-amber-300/25 bg-black/45",
    navClass: "border-amber-300/30 bg-black/60 text-amber-100",
    contentCardClass: "border-amber-300/20 bg-[#0d0d0d]/80",
    sidebarCardClass: "border-amber-300/35 bg-[#12100c]/85",
    heroImage: "https://images.unsplash.com/photo-1537633552985-df8429e8048b?w=1800&q=80&auto=format&fit=crop",
    heroOverlay: "bg-[linear-gradient(to_bottom,rgba(0,0,0,.25),rgba(0,0,0,.72))]",
    heroRightBgClass: "bg-[linear-gradient(165deg,#171410_0%,#1e1912_45%,#18130d_100%)]",
    heroCardClass: "border-amber-300/40 bg-black/78",
    heroBadgeClass: "border-amber-200/35 text-amber-100",
    heroDividerClass: "from-transparent via-[#d8b06a] to-transparent",
    heroNameGradient: "linear-gradient(178deg,#f2d79d 0%,#d3a14e 52%,#ae7a2e 100%)",
    heroNameShadow: "0 8px 24px rgba(0,0,0,.45)",
    heroDateClass: "text-amber-100",
    statBoxClass: "border-amber-300/35 bg-black/65",
    ctaClass: "bg-[linear-gradient(110deg,#7f5a22,#a97931,#d1a65d)] text-white shadow-[0_16px_30px_-16px_rgba(0,0,0,.7)]",
    titleClass: "text-amber-100",
    mutedClass: "text-amber-50/70",
    accent: "#d0a95a",
  },
  "destination-beach": {
    key: "destination-beach",
    heroLayout: "overlay",
    headingFont: "var(--font-playfair)",
    shellClass: "bg-[radial-gradient(circle_at_top,#eefbff_0%,#dff2fb_46%,#cfe8f6_100%)]",
    frameClass: "border-sky-100/85 bg-[#f4fbff]/80",
    navClass: "border-sky-200/65 bg-[#e2f5ff]/65 text-[#34718f]",
    contentCardClass: "border-sky-100/80 bg-white/85",
    sidebarCardClass: "border-cyan-200/70 bg-[#ecf9ff]/85",
    heroImage: "https://images.unsplash.com/photo-1507525428034-b723cf961d3e?w=1800&q=80&auto=format&fit=crop",
    heroOverlay: "bg-[linear-gradient(to_bottom,rgba(18,70,96,.2),rgba(18,70,96,.58))]",
    heroRightBgClass: "bg-[linear-gradient(165deg,#f2f9fe_0%,#dff0fa_45%,#f5fbff_100%)]",
    heroCardClass: "border-[#b9d9ea] bg-white/96",
    heroBadgeClass: "border-[#a9cde2] text-[#2f6683]",
    heroDividerClass: "from-transparent via-[#68b8de] to-transparent",
    heroNameGradient: "linear-gradient(178deg,#78c5ea 0%,#2d93c5 52%,#1f6589 100%)",
    heroNameShadow: "0 6px 18px rgba(63,139,179,.22)",
    heroDateClass: "text-[#2f7ea5]",
    statBoxClass: "border-[#bfdceb] bg-white",
    ctaClass: "bg-[linear-gradient(110deg,#2c7ca4,#3ba6d7,#5ec0ea)] text-white shadow-[0_16px_30px_-16px_rgba(63,139,179,.6)]",
    titleClass: "text-[#2f6986]",
    mutedClass: "text-[#4f7f98]",
    accent: "#2f9bc7",
  },
  "classic-elegance": {
    key: "classic-elegance",
    heroLayout: "split",
    headingFont: "var(--font-cormorant)",
    shellClass: "bg-[radial-gradient(circle_at_top,#fbfaf8_0%,#f2efea_48%,#e7e1d8_100%)]",
    frameClass: "border-stone-200/80 bg-[#faf8f5]/80",
    navClass: "border-stone-200/70 bg-[#efebe4]/68 text-[#5b4f40]",
    contentCardClass: "border-stone-200/80 bg-white/86",
    sidebarCardClass: "border-stone-300/75 bg-[#f6f2ec]/88",
    heroImage: "https://images.unsplash.com/photo-1519225421980-715cb0215aed?w=1800&q=80&auto=format&fit=crop",
    heroOverlay: "bg-[linear-gradient(to_bottom,rgba(51,45,36,.18),rgba(51,45,36,.5))]",
    heroRightBgClass: "bg-[linear-gradient(165deg,#fdfbf8_0%,#f3efe8_45%,#fcfaf6_100%)]",
    heroCardClass: "border-[#ddd3c6] bg-white/90",
    heroBadgeClass: "border-[#cfc2b0] text-[#6f5e49]",
    heroDividerClass: "from-transparent via-[#b79c78] to-transparent",
    heroNameGradient: "linear-gradient(178deg,#d8c6a9 0%,#a58a66 52%,#6f5a42 100%)",
    heroNameShadow: "0 6px 18px rgba(111,90,66,.2)",
    heroDateClass: "text-[#a48b69]",
    statBoxClass: "border-[#d9cfbf] bg-white",
    ctaClass: "bg-[linear-gradient(110deg,#6e5a42,#8b7256,#b09372)] text-white shadow-[0_16px_30px_-16px_rgba(111,90,66,.58)]",
    titleClass: "text-[#473a2f]",
    mutedClass: "text-[#7a6a58]",
    accent: "#8a745e",
  },
  "modern-neutral": {
    key: "modern-neutral",
    heroLayout: "editorial",
    headingFont: "var(--font-playfair)",
    shellClass: "bg-[radial-gradient(circle_at_top,#f6f8fc_0%,#eaedf5_46%,#dde4ef_100%)]",
    frameClass: "border-slate-200/85 bg-[#f8faff]/78",
    navClass: "border-slate-200/70 bg-[#e8edf7]/68 text-[#425777]",
    contentCardClass: "border-slate-200/80 bg-white/86",
    sidebarCardClass: "border-slate-300/75 bg-[#edf2fb]/85",
    heroImage: "https://images.unsplash.com/photo-1513278974582-3e1b4a4fa21d?w=1800&q=80&auto=format&fit=crop",
    heroOverlay: "bg-[linear-gradient(to_bottom,rgba(39,58,89,.16),rgba(39,58,89,.55))]",
    heroRightBgClass: "bg-[linear-gradient(165deg,#fafcff_0%,#edf2fb_45%,#f8fbff_100%)]",
    heroCardClass: "border-[#d7deea] bg-white/90",
    heroBadgeClass: "border-[#ccd4e2] text-[#556882]",
    heroDividerClass: "from-transparent via-[#7f96b8] to-transparent",
    heroNameGradient: "linear-gradient(178deg,#aab9d2 0%,#7088ad 52%,#425a7a 100%)",
    heroNameShadow: "0 6px 18px rgba(66,90,122,.22)",
    heroDateClass: "text-[#758aa8]",
    statBoxClass: "border-[#d7deea] bg-white",
    ctaClass: "bg-[linear-gradient(110deg,#425a7a,#5f7698,#7d93b3)] text-white shadow-[0_16px_30px_-16px_rgba(66,90,122,.58)]",
    titleClass: "text-[#344a67]",
    mutedClass: "text-[#5f738f]",
    accent: "#4c6488",
  },
};

export function getTemplateTheme(key?: string | null) {
  return themes[key ?? "modern-neutral"] ?? themes["modern-neutral"];
}
