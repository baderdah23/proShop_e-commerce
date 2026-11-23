import Link from "next/link";
import {
  Shield01Icon,
  DeliveryTruck01Icon,
  CustomerSupportIcon,
  DiamondIcon,
  StarIcon,
  CreditCardIcon,
  CheckmarkCircle02Icon,
} from "hugeicons-react";
import { Navbar } from "@/shared/components/Navbar";
import { Footer } from "@/shared/components/Footer";
import { ProductCard } from "@/features/products/components/ProductCard";
import { HeroSlider } from "@/features/home";
import { SectionHeading } from "@/shared/components/SectionHeading";
import LogoLoop, { type LogoItem } from "@/shared/components/LogoLoop";
import {
  SiAmd,
  SiNvidia,
  SiSamsung,
  SiHonor,
  SiApple,
  SiXiaomi,
  SiRedragon,
  SiRazer,
  SiStripe,
} from "react-icons/si";
import { fetchOrFallback } from "@/lib/api/fetch-or-fallback";
import { STATIC_CATEGORIES, STATIC_PRODUCTS } from "@/shared/data/mock-data";
import type { Product } from "@/shared/types";

type SubCategories = {
  sub_category_id: number;
  name_ar: string;
  name_en: string;
  slug: string;
};

type Category = {
  category_id: number;
  category_name_ar: string;
  category_name_en: string;
  category_slug: string;
  image_url: string;
  subcategories: SubCategories[];
};

type ProductsResponse = { success: boolean; products: Product[] };
type CategoriesResponse = { success: boolean; categories: Category[] };

const trustItems = [
  {
    icon: DeliveryTruck01Icon,
    title: "شحن سريع ومجاني",
    detail: "للطلبات فوق $100 مع تتبع لحظي",
  },
  {
    icon: Shield01Icon,
    title: "ضمان رسمي 36 شهراً",
    detail: "استبدال مباشر ضد عيوب الصناعة",
  },
  {
    icon: DiamondIcon,
    title: "قطع أصلية 100%",
    detail: "من الوكلاء والموزعين الرسميين",
  },
  {
    icon: CustomerSupportIcon,
    title: "دعم فني متخصص",
    detail: "استشارة مجانية من خبراء التجميع",
  },
];

const promises = [
  {
    icon: CheckmarkCircle02Icon,
    title: "فحص واختبار التجميعات",
    detail: "نختبر استقرار كل بطاقة ومعالج ومزود طاقة تحت أقصى ضغط قبل التغليف والشحن.",
  },
  {
    icon: CreditCardIcon,
    title: "دفع إلكتروني محمي",
    detail: "عمليات الدفع مشفرة عبر بوابات معتمدة عالمياً مع حماية كاملة لبياناتك.",
  },
  {
    icon: Shield01Icon,
    title: "استرجاع واستبدال مرن",
    detail: "إمكانية إرجاع أو استبدال المنتج خلال 14 يوماً وفق السياسات المعتمدة.",
  },
];

export default async function HomePage() {
  const [featuredProductsRes, newProductsRes, categoriesRes] =
    await Promise.all([
      fetchOrFallback<ProductsResponse | null>(
        "products?sort=rating_desc&page=1&limit=4",
        null,
      ),
      fetchOrFallback<ProductsResponse | null>(
        "products?sort=newest&page=1&limit=4",
        null,
      ),
      fetchOrFallback<CategoriesResponse | null>("categories?limit=5", null),
    ]);

  const featuredProducts =
    featuredProductsRes?.products && featuredProductsRes.products.length > 0
      ? featuredProductsRes.products
      : STATIC_PRODUCTS.slice(0, 4);

  const newProducts =
    newProductsRes?.products && newProductsRes.products.length > 0
      ? newProductsRes.products
      : STATIC_PRODUCTS.slice(4, 8);

  const catData: Category[] =
    categoriesRes?.categories && categoriesRes.categories.length > 0
      ? categoriesRes.categories
      : STATIC_CATEGORIES.map((c) => ({
          category_id: c.category_id,
          category_name_ar: c.name_ar ?? "",
          category_name_en: c.name_en ?? "",
          category_slug: c.slug ?? "",
          image_url: c.image_url,
          subcategories: [],
        }));

  const partnerLogos: LogoItem[] = [
    { node: <SiAmd color="#ED1C24" />, title: "AMD" },
    { node: <SiNvidia color="#76B900" />, title: "NVIDIA" },
    { node: <SiSamsung color="#1428A0" />, title: "Samsung" },
    { node: <SiHonor color="#111111" />, title: "HONOR" },
    { node: <SiApple color="#555555" />, title: "Apple" },
    { node: <SiXiaomi color="#FF6900" />, title: "Xiaomi" },
    { node: <SiRedragon color="#E21B23" />, title: "Redragon" },
    { node: <SiRazer color="#44D62C" />, title: "Razer" },
    { node: <SiStripe color="#635BFF" />, title: "Stripe" },
  ];

  return (
    <div className="flex min-h-screen flex-col">
      <Navbar />

      <main className="flex-1">
        <HeroSlider />

        <section className="shell mt-8 sm:mt-12">
          <div className="grid grid-cols-1 divide-y divide-line rounded-[24px] border border-line bg-surface sm:grid-cols-2 sm:divide-x lg:grid-cols-4 lg:divide-y-0">
            {trustItems.map(({ icon: Icon, title, detail }) => (
              <div key={title} className="flex items-center gap-4 p-5 sm:p-6">
                <span className="grid size-11 shrink-0 place-items-center rounded-xl bg-ink text-white">
                  <Icon size={20} />
                </span>
                <div>
                  <h3 className="text-[13px] font-black text-ink">{title}</h3>
                  <p className="mt-1 text-[11px] leading-5 text-muted">{detail}</p>
                </div>
              </div>
            ))}
          </div>
        </section>

        <section className="shell pt-16 sm:pt-24">
          <SectionHeading
            index="01 /"
            eyebrow="تصفح حسب القسم"
            title="ابدأ من حيث يهمك"
            description="أقسام منتقية تضم العتاد الذي يثق به المحترفون."
            action={{ label: "كل الفئات", href: "/categories" }}
          />

          <div className="mt-9 grid grid-cols-2 gap-4 md:grid-cols-4 md:grid-rows-2">
            {catData.map((cat, index) => (
              <Link
                key={cat.category_id}
                href={`/products?category=${cat.category_id}`}
                className={`group relative flex min-h-[180px] flex-col overflow-hidden rounded-[24px] border border-line bg-surface p-4 transition-all duration-300 hover:-translate-y-1 hover:border-brand/30 hover:shadow-[0_20px_44px_rgba(16,22,30,0.08)] md:min-h-[200px] ${
                  index === 0 ? "col-span-2 md:row-span-2" : ""
                }`}
              >
                <div className="relative flex-1 overflow-hidden rounded-2xl bg-paper">
                  <img
                    src={cat.image_url}
                    alt={cat.category_name_ar || cat.category_name_en || ""}
                    className="size-full object-cover transition-transform duration-700 group-hover:scale-110"
                  />
                  <div className="absolute inset-0 bg-gradient-to-t from-ink/25 to-transparent" />
                  <span className="font-latin absolute bottom-3 start-4 text-[11px] font-bold tracking-[0.18em] text-white/80">
                    {String(index + 1).padStart(2, "0")}
                  </span>
                </div>
                <div className="flex items-end justify-between gap-2 px-1 pt-4">
                  <div>
                    <h3 className="text-[14px] font-black text-ink transition-colors group-hover:text-brand">
                      {cat.category_name_ar}
                    </h3>
                    <span className="font-latin mt-1 block text-[10px] font-semibold uppercase tracking-[0.12em] text-muted">
                      {cat.category_name_en}
                    </span>
                  </div>
                  <span className="grid size-8 shrink-0 place-items-center rounded-lg bg-paper text-ink transition-colors group-hover:bg-brand group-hover:text-white">
                    <svg viewBox="0 0 20 20" className="size-4 rotate-180" fill="none" stroke="currentColor" strokeWidth="1.8" aria-hidden="true">
                      <path d="M4 10h12m0 0-5-5m5 5-5 5" strokeLinecap="round" strokeLinejoin="round" />
                    </svg>
                  </span>
                </div>
              </Link>
            ))}
          </div>
        </section>

        <section className="shell pt-16 sm:pt-24">
          <SectionHeading
            index="02 /"
            eyebrow="وصل حديثاً"
            title="عتاد جديد، اختيار مدروس"
            description="أحدث الإصدارات التي أضفناها إلى المخزون هذا الأسبوع."
            action={{ label: "تصفح المنتجات", href: "/products" }}
          />
          <div className="mt-9 grid grid-cols-1 gap-5 sm:grid-cols-2 lg:grid-cols-4">
            {newProducts.map((product) => (
              <ProductCard key={product.product_id} product={product} />
            ))}
          </div>
        </section>

        <section className="shell pt-16 sm:pt-24">
          <div className="blueprint relative overflow-hidden rounded-[32px] border border-line px-6 py-12 sm:px-12 sm:py-14">
            <div className="pointer-events-none absolute -end-20 top-0 size-72 rounded-full bg-signal/20 blur-[100px]" />
            <div className="relative grid items-center gap-10 lg:grid-cols-[1.2fr_0.8fr]">
              <div>
                <div className="mb-5 inline-flex items-center gap-2 rounded-full border border-ink/10 bg-surface px-3 py-1.5 text-[11px] font-bold text-ink">
                  <span className="size-1.5 rounded-full bg-signal" />
                  تخفيضات الموسم
                </div>
                <h2 className="max-w-2xl text-[30px] font-black leading-[1.2] tracking-[-0.03em] text-ink sm:text-[40px]">
                  تجميعتك تستحق عتاداً أفضل <span className="text-muted">بسعر أذكى</span>
                </h2>
                <p className="mt-4 max-w-xl text-[13px] leading-7 text-muted">
                  استخدم رمز الخصم عند إتمام الطلب، مع فحص شامل وضمان معتمد لكل قطعة.
                </p>
              </div>

              <div className="flex flex-col items-start gap-4 sm:flex-row sm:items-center lg:justify-end">
                <div className="coupon-edge min-w-44 bg-signal px-6 py-4 text-center text-ink">
                  <span className="block text-[10px] font-bold">كود الخصم</span>
                  <span className="font-latin mt-1 block text-xl font-black tracking-[0.14em]">PRO2026</span>
                </div>
                <Link
                  href="/products"
                  className="liquid-glass-btn inline-flex h-12 items-center gap-2 rounded-xl px-6 text-[13px] font-bold"
                >
                  تسوق العروض
                  <ArrowGlyph />
                </Link>
              </div>
            </div>
          </div>
        </section>

        <section className="mt-16 border-y border-line bg-surface py-16 sm:mt-24 sm:py-20">
          <div className="shell">
            <SectionHeading
              index="03 /"
              eyebrow="الأكثر طلباً"
              title="اختيارات يثق بها المحترفون"
              description="منتجات حصدت أعلى تقييمات من عملائنا هذا الموسم."
              action={{ label: "كل المنتجات", href: "/products" }}
              icon={<StarIcon size={15} className="fill-signal text-ink" />}
            />
            <div className="mt-10 grid grid-cols-1 gap-5 sm:grid-cols-2 lg:grid-cols-4">
              {featuredProducts.map((product) => (
                <ProductCard key={product.product_id} product={product} />
              ))}
            </div>
          </div>
        </section>

        <section className="shell py-16 sm:py-24">
          <div className="grid items-start gap-12 lg:grid-cols-12 lg:gap-20">
            <div className="lg:col-span-5">
              <span className="eyebrow text-brand">لماذا نحن</span>
              <h2 className="mt-4 text-[30px] font-black leading-[1.25] tracking-[-0.03em] text-ink sm:text-[38px]">
                ليس مجرد متجر.
                <br />
                <span className="text-muted">شريكك في كل ترقية.</span>
              </h2>
              <div className="mt-8 space-y-0 border-t border-line">
                {promises.map(({ icon: Icon, title, detail }, index) => (
                  <div key={title} className="flex gap-5 border-b border-line py-6">
                    <span className="font-latin pt-0.5 text-[11px] font-bold text-brand">
                      0{index + 1}
                    </span>
                    <div>
                      <div className="mb-2 flex items-center gap-2.5">
                        <Icon size={17} className="text-brand" />
                        <h3 className="text-[15px] font-black text-ink">{title}</h3>
                      </div>
                      <p className="max-w-md text-[12px] leading-6 text-muted">{detail}</p>
                    </div>
                  </div>
                ))}
              </div>
            </div>

            <div className="blueprint relative min-h-[420px] overflow-hidden rounded-[32px] border border-line p-6 sm:p-9 lg:col-span-7">
              <div className="flex items-center justify-between border-b border-line pb-5">
                <div>
                  <span className="eyebrow text-muted">SYSTEM CHECK</span>
                  <p className="mt-2 text-lg font-black text-ink">كل قطعة تمر بخطة فحص واضحة</p>
                </div>
                <span className="rounded-full border border-ink/10 bg-surface px-3 py-1 font-latin text-[10px] font-bold text-ink">
                  VERIFIED
                </span>
              </div>

              <div className="mt-7 space-y-5">
                {[
                  { label: "فحص المكونات ومطابقة المواصفات", value: 100 },
                  { label: "اختبار الاستقرار تحت الضغط", value: 92 },
                  { label: "التغليف الآمن والتتبع", value: 86 },
                ].map((row) => (
                  <div key={row.label}>
                    <div className="mb-2 flex items-center justify-between text-[12px]">
                      <span className="text-muted">{row.label}</span>
                      <span className="font-latin font-bold text-ink">{row.value}%</span>
                    </div>
                    <div className="h-1.5 overflow-hidden rounded-full bg-ink/10">
                      <div
                        className="h-full rounded-full bg-gradient-to-r from-ink to-signal"
                        style={{ width: `${row.value}%` }}
                      />
                    </div>
                  </div>
                ))}
              </div>

              <div className="mt-9 grid grid-cols-3 gap-3">
                {[
                  { value: "24h", label: "تجهيز الطلب" },
                  { value: "36", label: "شهر ضمان" },
                  { value: "100%", label: "فحص قبل الشحن" },
                ].map((stat) => (
                  <div key={stat.label} className="rounded-2xl border border-line bg-surface p-4">
                    <div className="font-latin text-xl font-black text-ink">{stat.value}</div>
                    <div className="mt-1 text-[10px] text-muted">{stat.label}</div>
                  </div>
                ))}
              </div>

              <div className="pointer-events-none absolute -bottom-16 -start-16 size-64 rounded-full border border-line" />
            </div>
          </div>
        </section>

        <section className="shell pb-16 sm:pb-24">
          <div className="rounded-[28px] border border-line bg-surface px-6 py-8 sm:px-10">
            <div className="flex flex-col items-center gap-8">
              <p className="eyebrow text-center text-muted">شركاء ووكلاء معتمدون</p>
              <div className="w-full">
                <LogoLoop
                  logos={partnerLogos}
                  speed={100}
                  direction="left"
                  logoHeight={54}
                  gap={64}
                  hoverSpeed={0}
                  scaleOnHover
                  fadeOut
                  fadeOutColor="#ffffff"
                  ariaLabel="شعارات شركاء التقنية"
                />
              </div>
            </div>
          </div>
        </section>
      </main>

      <Footer />
    </div>
  );
}

function ArrowGlyph() {
  return (
    <svg viewBox="0 0 20 20" className="size-4 rotate-180" fill="none" stroke="currentColor" strokeWidth="1.8" aria-hidden="true">
      <path d="M4 10h12m0 0-5-5m5 5-5 5" strokeLinecap="round" strokeLinejoin="round" />
    </svg>
  );
}
