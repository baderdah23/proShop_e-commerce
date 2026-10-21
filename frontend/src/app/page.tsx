import React from "react";
import Link from "next/link";
import {
  Shield01Icon,
  DeliveryTruck01Icon,
  CustomerSupportIcon,
  ArrowRight01Icon,
  DiamondIcon,
} from "hugeicons-react";
import { Navbar } from "@/shared/components/Navbar";
import { Footer } from "@/shared/components/Footer";
import { SpotlightCard } from "@/shared/components/SpotlightCard";
import { ProductCard } from "@/features/products/components/ProductCard";
import { HeroSlider } from "@/features/home";
import { STATIC_PRODUCTS } from "@/shared/data/mock-data";
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
import { serverFetch } from "@/lib/api/server";

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

export default async function HomePage() {
  const featuredProductsResponse = await serverFetch(
    "products?sort=rating_desc&page=1&limit=4",
  );
  const featuredProducts = featuredProductsResponse?.products || [];

  const newProductsResponse = await serverFetch(
    "products?sort=newest&page=1&limit=4",
  );
  const newProducts = newProductsResponse?.products || [];

  const categories = await serverFetch("categories?limit=5");
  const catData: Category[] = categories?.categories || [];

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
        <HeroSlider />

        {/* ============================================================
            VALUE PROPOSITIONS
            ============================================================ */}
        <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
            <div className="flex items-center gap-4 p-5 rounded-2xl bg-white border border-black/8 shadow-xs">
              <div className="w-12 h-12 rounded-xl bg-[#EEF5FC] text-[#2B7BD4] flex items-center justify-center shrink-0">
                <DeliveryTruck01Icon size={24} color="#2B7BD4" />
              </div>
              <div>
                <h4 className="font-bold text-sm text-[#1A1D2A]">
                  شحن مجاني وسريع
                </h4>
                <p className="text-xs text-[#64748B]">
                  توصيل للباب خلال 24 - 48 ساعة
                </p>
              </div>
            </div>

            <div className="flex items-center gap-4 p-5 rounded-2xl bg-white border border-black/8 shadow-xs">
              <div className="w-12 h-12 rounded-xl bg-[#F0FDF4] text-[#22C55E] flex items-center justify-center shrink-0">
                <Shield01Icon size={24} color="#22C55E" />
              </div>
              <div>
                <h4 className="font-bold text-sm text-[#1A1D2A]">
                  ضمان رسمي 3 سنوات
                </h4>
                <p className="text-xs text-[#64748B]">
                  استبدال مباشر ضد عيوب الصناعة
                </p>
              </div>
            </div>

            <div className="flex items-center gap-4 p-5 rounded-2xl bg-white border border-black/8 shadow-xs">
              <div className="w-12 h-12 rounded-xl bg-[#EEF5FC] text-[#2B7BD4] flex items-center justify-center shrink-0">
                <DiamondIcon size={24} color="#2B7BD4" />
              </div>
              <div>
                <h4 className="font-bold text-sm text-[#1A1D2A]">
                  قطع أصلية 100%
                </h4>
                <p className="text-xs text-[#64748B]">
                  مستوردة مباشرة من الوكلاء المعتمدين
                </p>
              </div>
            </div>

            <div className="flex items-center gap-4 p-5 rounded-2xl bg-white border border-black/8 shadow-xs">
              <div className="w-12 h-12 rounded-xl bg-[#EEF5FC] text-[#2B7BD4] flex items-center justify-center shrink-0">
                <CustomerSupportIcon size={24} color="#2B7BD4" />
              </div>
              <div>
                <h4 className="font-bold text-sm text-[#1A1D2A]">
                  دعم واستشارات تقنية
                </h4>
                <p className="text-xs text-[#64748B]">
                  مساعدة في اختيار وتوافق القطع
                </p>
              </div>
            </div>
          </div>
        </section>

        {/* ============================================================
            FEATURED CATEGORIES
            ============================================================ */}
        <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex items-end justify-between mb-8">
            <div>
              <span className="text-xs font-bold text-[#6AABF0] uppercase tracking-wider block mb-1">
                تصفح حسب الفئة
              </span>
              <h2 className="text-2xl sm:text-3xl font-black text-[#1A1D2A]">
                فئات المنتجات والعتاد
              </h2>
            </div>
            <Link
              href="/categories"
              className="text-xs sm:text-sm font-bold text-[#2B7BD4] hover:text-[#1F63B3] flex items-center gap-1"
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
              >
                <SpotlightCard className="p-4 text-center group cursor-pointer hover:border-[#6AABF0] transition-all">
                  <div className="w-full aspect-video rounded-xl overflow-hidden bg-[#F1F5F9] mb-3">
                    <img
                      src={cat.image_url}
                      alt={cat.category_name_ar || cat.category_name_en || ""}
                      className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
                    />
                  </div>
                  <h3 className="font-bold text-sm text-[#1A1D2A] group-hover:text-[#6AABF0] transition-colors">
                    {cat.category_name_ar}
                  </h3>
                  <span className="text-[11px] text-[#94A3B8]">
                    {cat.category_name_en}
                  </span>
                </SpotlightCard>
              </Link>
            ))}
          </div>
        </section>

        {/* ============================================================
            HOT DEALS & OFFERS SECTION (أفضل العروض والخصومات)
            ============================================================ */}
        <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex items-end justify-between mb-8">
            <div>
              <span className="text-xs font-bold text-[#EF4444] uppercase tracking-wider block mb-1">
                توفير فوري
              </span>
              <h2 className="text-2xl sm:text-3xl font-black text-[#1A1D2A]">
                احدث المنتجات لدينا 🔥
              </h2>
            </div>
            <Link
              href="/products"
              className="text-xs sm:text-sm font-bold text-[#2B7BD4] hover:text-[#1F63B3] flex items-center gap-1"
            >
              <span>كل التخفيضات</span>
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
            FEATURED BEST-SELLING PRODUCTS (أفضل المنتجات مبيعاً)
            ============================================================ */}
        <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex items-end justify-between mb-8">
            <div>
              <span className="text-xs font-bold text-[#6AABF0] uppercase tracking-wider block mb-1">
                الأكثر طلباً
              </span>
              <h2 className="text-2xl sm:text-3xl font-black text-[#1A1D2A]">
                أفضل المنتجات مبيعاً وتقييماً ⭐
              </h2>
            </div>
            <Link
              href="/products"
              className="text-xs sm:text-sm font-bold text-[#2B7BD4] hover:text-[#1F63B3] flex items-center gap-1"
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
            OFFICIAL BRANDS PARTNERS
            ============================================================ */}
        <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 text-center pb-8">
          <h3 className="text-xs font-bold text-[#94A3B8] uppercase tracking-wider mb-8">
            شركاء ووكلاء معتمدون لأكبر الشركات التقنية العالمية
          </h3>
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
