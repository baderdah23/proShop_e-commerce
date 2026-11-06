export interface HeroSlide {
  id: string;
  image: string;
  alt: string;
  eyebrow: string;
  title: string;
  titleAccent: string;
  subtitle: string;
  priceNote: string;
  cta: string;
  href: string;
  badge: string;
}

export const heroSlides: HeroSlide[] = [
  {
    id: "gpus-deal",
    image: "/images/hero/graphics-power-premium.webp",
    alt: "بطاقات كروت الشاشة والعتاد الرسومي",
    eyebrow: "عرض محدود للأسبوع 🔥",
    title: "كروت شاشة الجيل الجديد",
    titleAccent: "RTX 40 & RX 7000",
    subtitle: "أعلى أداء للألعاب وصناعة المحتوى مع ضمان رسمي 36 شهراً وشحن مجاني.",
    priceNote: "تبدأ الأسعار من $749",
    cta: "تسوق كروت الشاشة",
    href: "/products?category=4",
    badge: "خصم حتى 25%",
  },
  {
    id: "pcs-deal",
    image: "/images/hero/gaming-command-premium.webp",
    alt: "تجميعات حواسيب احترافية متكاملة",
    eyebrow: "أحدث المعالجات 2026 ⚡",
    title: "تجميعات احترافية جاهزة",
    titleAccent: "معالجات الجيل الأحدث",
    subtitle: "اختبار استقرار وضغط قبل الشحن مع تركيب وتوصيل مجاني للباب.",
    priceNote: "حزم تبدأ من $499",
    cta: "استكشف التجميعات",
    href: "/products",
    badge: "توفير فوري حتى $180",
  },
  {
    id: "displays-deal",
    image: "/images/hero/gaming-screen.webp",
    alt: "شاشات ألعاب ومونتاج فائقة الوضوح",
    eyebrow: "شاشات فائقة الوضوح 🖥️",
    title: "شاشات الألعاب والمونتاج",
    titleAccent: "4K & OLED 240Hz",
    subtitle: "ألوان دقيقة وزمن استجابة 0.03ms مع خيارات تقسيط ميسرة وبدون فوائد.",
    priceNote: "تقسيط 0% بدون فوائد",
    cta: "تصفح الشاشات",
    href: "/products?category=2",
    badge: "ضمان 3 سنوات معتمد",
  },
];
