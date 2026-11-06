import React from "react";
import Link from "next/link";
import {
  Shield01Icon,
  DeliveryTruck01Icon,
  CustomerSupportIcon,
  ArrowRight01Icon,
  DiamondIcon,
  StarIcon,
  CreditCardIcon,
  CheckmarkCircle02Icon,
  FlashIcon,
} from "hugeicons-react";
import { Navbar } from "@/shared/components/Navbar";
import { Footer } from "@/shared/components/Footer";
import { ProductCard } from "@/features/products/components/ProductCard";
import { HeroSlider } from "@/features/home";
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
    { node: <SiHonor color="#000000" />, title: "HONOR" },
    { node: <SiApple color="#555555" />, title: "Apple" },
    { node: <SiXiaomi color="#FF6900" />, title: "Xiaomi" },
    { node: <SiRedragon color="#E21B23" />, title: "Redragon" },
    { node: <SiRazer color="#44D62C" />, title: "Razer" },
    { node: <SiStripe color="#635BFF" />, title: "Stripe" },
  ];

  return (
    <div className="min-h-screen flex flex-col bg-[#F8FAFC]">
      <Navbar />

      <main className="flex-1 space-y-16 sm:space-y-24">
        {/* ============================================================
            HERO SLIDER
            ============================================================ */}
        <HeroSlider />

        {/* ============================================================
            TRUST BAR & VALUE PROPOSITIONS
            ============================================================ */}
        <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-20">
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
            <div className="bg-white rounded-2xl p-5 border border-black/8 shadow-sm flex items-center gap-4 transition-all hover:shadow-md">
              <div className="w-12 h-12 rounded-xl bg-[#111111] text-white flex items-center justify-center shrink-0">
                <DeliveryTruck01Icon size={24} />
              </div>
              <div>
                <h4 className="font-bold text-sm text-[#1A1D2A]">
                  شحن سريع ومجاني
                </h4>
                <p className="text-xs text-[#64748B] mt-0.5">
                  للطلبات فوق $100 مع تتبع لحظي
                </p>
              </div>
            </div>

            <div className="bg-white rounded-2xl p-5 border border-black/8 shadow-sm flex items-center gap-4 transition-all hover:shadow-md">
              <div className="w-12 h-12 rounded-xl bg-[#111111] text-white flex items-center justify-center shrink-0">
                <Shield01Icon size={24} />
              </div>
              <div>
                <h4 className="font-bold text-sm text-[#1A1D2A]">
                  ضمان رسمي معتمد 36 شهراً
                </h4>
                <p className="text-xs text-[#64748B] mt-0.5">
                  استبدال مباشر ضد عيوب الصناعة
                </p>
              </div>
            </div>

            <div className="bg-white rounded-2xl p-5 border border-black/8 shadow-sm flex items-center gap-4 transition-all hover:shadow-md">
              <div className="w-12 h-12 rounded-xl bg-[#111111] text-white flex items-center justify-center shrink-0">
                <DiamondIcon size={24} />
              </div>
              <div>
                <h4 className="font-bold text-sm text-[#1A1D2A]">
                  قطع أصلية 100%
                </h4>
                <p className="text-xs text-[#64748B] mt-0.5">
                  من الوكلاء والموزعين الرسميين
                </p>
              </div>
            </div>

            <div className="bg-white rounded-2xl p-5 border border-black/8 shadow-sm flex items-center gap-4 transition-all hover:shadow-md">
              <div className="w-12 h-12 rounded-xl bg-[#111111] text-white flex items-center justify-center shrink-0">
                <CustomerSupportIcon size={24} />
              </div>
              <div>
                <h4 className="font-bold text-sm text-[#1A1D2A]">
                  دعم فني وتوافق القطع
                </h4>
                <p className="text-xs text-[#64748B] mt-0.5">
                  استشارة مجانية من خبراء التجميع
                </p>
              </div>
            </div>
          </div>
        </section>

        {/* ============================================================
            FEATURED CATEGORIES (تصفح الأقسام)
            ============================================================ */}
        <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex items-end justify-between mb-8 pb-4 border-b border-black/5">
            <div>
              <span className="text-xs font-bold uppercase tracking-wider text-[#64748B] block mb-1">
                تسوّق حسب القسم
              </span>
              <h2 className="text-2xl sm:text-3xl font-black text-[#1A1D2A]">
                فئات المنتجات والعتاد
              </h2>
            </div>
            <Link
              href="/categories"
              className="text-xs sm:text-sm font-bold text-[#2B7BD4] hover:text-[#1F63B3] flex items-center gap-1.5 transition-colors"
            >
              <span>عرض كافة الفئات</span>
              <ArrowRight01Icon size={16} className="rotate-180" />
            </Link>
          </div>

          <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-5 gap-4">
            {catData.map((cat) => (
              <Link
                key={cat.category_id}
                href={`/products?category=${cat.category_id}`}
                className="group relative bg-white rounded-2xl p-4 border border-black/8 shadow-xs hover:border-black/30 hover:shadow-md transition-all duration-300 flex flex-col"
              >
                <div className="w-full aspect-square rounded-xl overflow-hidden bg-[#F1F5F9] mb-3 flex items-center justify-center p-2">
                  <img
                    src={cat.image_url}
                    alt={cat.category_name_ar || cat.category_name_en || ""}
                    className="w-full h-full object-cover rounded-lg group-hover:scale-105 transition-transform duration-500"
                  />
                </div>
                <div className="text-center mt-auto">
                  <h3 className="font-bold text-sm text-[#1A1D2A] group-hover:text-[#2B7BD4] transition-colors">
                    {cat.category_name_ar}
                  </h3>
                  <span className="text-[11px] text-[#94A3B8] block mt-0.5">
                    {cat.category_name_en}
                  </span>
                </div>
              </Link>
            ))}
          </div>
        </section>

        {/* ============================================================
            HOT DEALS & OFFERS (عروض حصرية وخصومات)
            ============================================================ */}
        <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex items-end justify-between mb-8 pb-4 border-b border-black/5">
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 rounded-xl bg-[#EF4444]/10 text-[#EF4444] flex items-center justify-center">
                <FlashIcon size={22} className="fill-[#EF4444]" />
              </div>
              <div>
                <span className="text-xs font-bold text-[#EF4444] uppercase tracking-wider block">
                  عروض حصرية وتخفيضات
                </span>
                <h2 className="text-2xl sm:text-3xl font-black text-[#1A1D2A]">
                  أحدث المنتجات والعروض 🔥
                </h2>
              </div>
            </div>
            <Link
              href="/products"
              className="text-xs sm:text-sm font-bold text-[#2B7BD4] hover:text-[#1F63B3] flex items-center gap-1.5 transition-colors"
            >
              <span>كافة المنتجات</span>
              <ArrowRight01Icon size={16} className="rotate-180" />
            </Link>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
            {newProducts.map((product) => (
              <ProductCard key={product.product_id} product={product} />
            ))}
          </div>
        </section>

        {/* ============================================================
            PROMOTIONAL COMMERCE BANNER (كوبون وتخفيض)
            ============================================================ */}
        <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="relative rounded-3xl overflow-hidden bg-[#111111] text-white p-8 sm:p-12 shadow-xl">
            <div
              className="absolute inset-0 opacity-10 pointer-events-none"
              style={{
                backgroundImage:
                  "radial-gradient(#ffffff 1px, transparent 1px)",
                backgroundSize: "24px 24px",
              }}
            />
            <div className="relative z-10 flex flex-col md:flex-row items-center justify-between gap-8">
              <div className="max-w-xl text-center md:text-start">
                <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-white/10 text-white text-xs font-bold mb-4 border border-white/15">
                  <span className="w-2 h-2 rounded-full bg-[#22C55E]" />
                  <span>تخفيضات الموسم الاحترافية</span>
                </div>
                <h3 className="text-2xl sm:text-4xl font-black leading-tight mb-3">
                  ترقية تجميعتك بأقوى العتاد وبأفضل الأسعار
                </h3>
                <p className="text-sm text-neutral-300 leading-relaxed mb-4">
                  احصل على خصم فوري عند استخدام رمز القسيمة. شحن سريع مع فحص
                  وضمان شامل لجميع المكونات.
                </p>
                <div className="inline-flex items-center gap-3 bg-white/10 border border-white/20 rounded-xl px-4 py-2 text-xs font-mono">
                  <span className="text-neutral-400 font-sans">كود الخصم:</span>
                  <span className="font-bold text-white text-sm tracking-wider">
                    PRO2026
                  </span>
                </div>
              </div>
              <div className="shrink-0 flex flex-col sm:flex-row gap-3 w-full md:w-auto">
                <Link
                  href="/products"
                  className="inline-flex items-center justify-center gap-2 bg-white text-[#111111] hover:bg-neutral-100 font-extrabold text-sm px-8 py-4 rounded-xl shadow-lg transition-colors"
                >
                  <span>تسوق العروض الآن</span>
                  <ArrowRight01Icon size={16} className="rotate-180" />
                </Link>
                <Link
                  href="/categories"
                  className="inline-flex items-center justify-center gap-2 bg-white/10 hover:bg-white/15 border border-white/20 text-white font-bold text-sm px-6 py-4 rounded-xl transition-colors"
                >
                  <span>تصفح الأقسام</span>
                </Link>
              </div>
            </div>
          </div>
        </section>

        {/* ============================================================
            TOP RATED & BEST SELLERS (الأكثر طلباً ومبيعاً)
            ============================================================ */}
        <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex items-end justify-between mb-8 pb-4 border-b border-black/5">
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 rounded-xl bg-[#F59E0B]/10 text-[#F59E0B] flex items-center justify-center">
                <StarIcon size={22} className="fill-[#F59E0B]" />
              </div>
              <div>
                <span className="text-xs font-bold text-[#F59E0B] uppercase tracking-wider block">
                  الأعلى تقييماً
                </span>
                <h2 className="text-2xl sm:text-3xl font-black text-[#1A1D2A]">
                  أفضل المنتجات مبيعاً وطلباً ⭐
                </h2>
              </div>
            </div>
            <Link
              href="/products"
              className="text-xs sm:text-sm font-bold text-[#2B7BD4] hover:text-[#1F63B3] flex items-center gap-1.5 transition-colors"
            >
              <span>مشاهدة الكل</span>
              <ArrowRight01Icon size={16} className="rotate-180" />
            </Link>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
            {featuredProducts.map((product) => (
              <ProductCard key={product.product_id} product={product} />
            ))}
          </div>
        </section>

        {/* ============================================================
            WHY CHOOSE PROSTORE (مزايا المتجر وخدمات العملاء)
            ============================================================ */}
        <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="bg-white rounded-3xl p-8 sm:p-12 border border-black/8 shadow-xs">
            <div className="text-center max-w-2xl mx-auto mb-10">
              <span className="text-xs font-bold text-[#64748B] uppercase tracking-wider block mb-2">
                لماذا يفضل المحترفون متجرنا
              </span>
              <h2 className="text-2xl sm:text-3xl font-black text-[#1A1D2A]">
                تجربة تسوق عتاد متكاملة ومضمونة
              </h2>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
              <div className="flex items-start gap-4">
                <div className="w-12 h-12 rounded-2xl bg-black/5 text-[#111111] flex items-center justify-center shrink-0">
                  <CheckmarkCircle02Icon size={24} />
                </div>
                <div>
                  <h3 className="font-bold text-base text-[#1A1D2A] mb-1">
                    فحص واختبار التجميعات
                  </h3>
                  <p className="text-xs text-[#64748B] leading-relaxed">
                    نقوم باختبار استقرار كل بطاقة ومعالج ومزود طاقة تحت أقصى ضغط
                    قبل التغليف والشحن.
                  </p>
                </div>
              </div>

              <div className="flex items-start gap-4">
                <div className="w-12 h-12 rounded-2xl bg-black/5 text-[#111111] flex items-center justify-center shrink-0">
                  <CreditCardIcon size={24} />
                </div>
                <div>
                  <h3 className="font-bold text-base text-[#1A1D2A] mb-1">
                    دفع إلكتروني محمي 100%
                  </h3>
                  <p className="text-xs text-[#64748B] leading-relaxed">
                    عمليات الدفع مشفرة عبر بوابات معتمدة عالمياً مع حماية كاملة
                    لحسابك وبياناتك.
                  </p>
                </div>
              </div>

              <div className="flex items-start gap-4">
                <div className="w-12 h-12 rounded-2xl bg-black/5 text-[#111111] flex items-center justify-center shrink-0">
                  <Shield01Icon size={24} />
                </div>
                <div>
                  <h3 className="font-bold text-base text-[#1A1D2A] mb-1">
                    استرجاع واستبدال مرن
                  </h3>
                  <p className="text-xs text-[#64748B] leading-relaxed">
                    إمكانية إرجاع أو استبدال المنتج خلال 14 يوماً بكل سهولة ووفق
                    السياسات المعتمدة.
                  </p>
                </div>
              </div>
            </div>
          </div>
        </section>

        {/* ============================================================
            OFFICIAL BRANDS & PARTNERS
            ============================================================ */}
        <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 text-center pb-8">
          <p className="text-xs font-bold text-[#94A3B8] uppercase tracking-wider mb-8">
            شركاء ووكلاء معتمدون لأكبر الشركات التقنية العالمية
          </p>
          <LogoLoop
            logos={partnerLogos}
            speed={100}
            direction="left"
            logoHeight={60}
            gap={60}
            hoverSpeed={0}
            scaleOnHover
            fadeOut
            fadeOutColor="#F8FAFC"
            ariaLabel="شعارات شركاء التقنية"
          />
        </section>
      </main>

      <Footer />
    </div>
  );
}
