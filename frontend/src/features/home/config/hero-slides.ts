export interface HeroSlide {
  id: string;
  image: string;
  alt: string;
  eyebrow: string;
  title: string;
  titleAccent: string;
  subtitle: string;
  cta: string;
  href: string;
  badge: string;
  position: string;
}

export const heroSlides: HeroSlide[] = [
  {
    id: "gaming-command",
    image: "/images/hero/gaming-command-premium.webp",
    alt: "إعداد ألعاب احترافي بإضاءة زرقاء وشاشة عريضة",
    eyebrow: "ترقية المستوى",
    title: "ابنِ مساحة اللعب",
    titleAccent: "التي تستحقها",
    subtitle: "شاشات غامرة، أداء بلا حدود، وإكسسوارات مصممة للانتصار.",
    cta: "تسوق تجهيزات الألعاب",
    href: "/products",
    badge: "اختيارات المحترفين",
    position: "center",
  },
  {
    id: "graphics-power",
    image: "/images/hero/graphics-power-premium.webp",
    alt: "بطاقة رسومية قوية داخل جهاز كمبيوتر بإضاءة RGB",
    eyebrow: "أداء الجيل القادم",
    title: "أطلق العنان لـ",
    titleAccent: "قوة الرسوميات",
    subtitle: "بطاقات GPU جاهزة لأعلى إطارات وأثقل مشاريعك الإبداعية.",
    cta: "استكشف كروت الشاشة",
    href: "/products?category=1",
    badge: "حتى 30% خصم",
    position: "center",
  },
  {
    id: "mobile-future",
    image: "/images/hero/gaming-blue-premium.webp",
    alt: "لوحة مفاتيح ألعاب بإضاءة زرقاء على مكتب داكن",
    eyebrow: "تحكم أدق",
    title: "كل نقرة تصنع",
    titleAccent: "فرقاً أكبر",
    subtitle: "لوحات مفاتيح وإكسسوارات بإحساس سريع وإضاءة تليق بإعدادك.",
    cta: "تسوق الإكسسوارات",
    href: "/products",
    badge: "وصل حديثاً",
    position: "center",
  },
  {
    id: "desk-setup",
    image: "/images/hero/gaming-screen.webp",
    alt: "لاعب أمام شاشة ألعاب بإضاءة زرقاء داخل معرض تقني",
    eyebrow: "تجربة غامرة",
    title: "شاهد الفرق",
    titleAccent: "في كل إطار",
    subtitle: "شاشات ألعاب عالية الأداء تمنحك وضوحاً وسرعة واستجابة أدق.",
    cta: "اكتشف الشاشات",
    href: "/products",
    badge: "تجربة 4K",
    position: "center",
  },
  {
    id: "accessories",
    image: "/images/hero/gaming-purple-room.webp",
    alt: "صندوق كمبيوتر احترافي بإضاءة زرقاء قوية",
    eyebrow: "الصوت في التفاصيل",
    title: "اسمع كل لحظة",
    titleAccent: "بوضوح كامل",
    subtitle: "قطع قوية وإضاءة راقية وأداء يصنع فرقاً حقيقياً.",
    cta: "اكتشف القطع",
    href: "/products?category=5",
    badge: "ضمان رسمي",
    position: "center",
  },
];
