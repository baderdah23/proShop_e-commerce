import React, { use } from "react";
import Link from "next/link";
import { Navbar } from "@/shared/components/Navbar";
import { Footer } from "@/shared/components/Footer";
import { Button } from "@/shared/components/Button";
import { ProductCard } from "@/features/products/components/ProductCard";
import { formatPrice } from "@/shared/utils";
import { STATIC_PRODUCTS, STATIC_REVIEWS } from "@/shared/data/mock-data";
import {
  StarIcon,
  Shield01Icon,
  DeliveryTruck01Icon,
  ShoppingBag01Icon,
  CheckmarkCircle01Icon,
  ArrowRight01Icon,
  Add01Icon,
  FavouriteIcon,
} from "hugeicons-react";

export default function ProductDetailPage({
  searchParams,
}: {
  searchParams: Promise<{ id?: string }>;
}) {
  const resolvedSearchParams = use(searchParams);
  const productId = resolvedSearchParams.id;

  const product =
    STATIC_PRODUCTS.find((p) => p.product_id === productId || p.slug === productId) ||
    STATIC_PRODUCTS[0];
  const reviews = STATIC_REVIEWS.filter(
    (review) => review.product_id === product.product_id,
  );
  const relatedProducts = STATIC_PRODUCTS.filter(
    (item) =>
      item.product_id !== product.product_id &&
      (item.category_id === product.category_id ||
        item.brand_id === product.brand_id),
  );
  const galleryImages = [
    product.image_url,
    ...(product.images?.map((image) => image.image_url) ?? []),
  ].filter(
    (source, index, all): source is string =>
      Boolean(source) && all.indexOf(source) === index,
  );
  const activeImage = galleryImages[0] ?? "";
  const hasDiscount = product.discount_price < product.price;

  return (
    <div className="min-h-screen flex flex-col bg-[#F8FAFC]">
      <Navbar />

      <main className="flex-1 max-w-7xl w-full mx-auto px-4 sm:px-6 lg:px-8 py-10 space-y-12">
        {/* Breadcrumb Navigation */}
        <nav className="flex items-center gap-2 text-xs text-[#64748B] font-medium">
          <Link href="/" className="hover:text-[#2B7BD4] transition-colors">
            الرئيسية
          </Link>
          <span>/</span>
          <Link href="/products" className="hover:text-[#2B7BD4] transition-colors">
            المنتجات
          </Link>
          <span>/</span>
          <Link
            href={`/products?category=${product.category_id}`}
            className="hover:text-[#2B7BD4] transition-colors"
          >
            {product.category_name}
          </Link>
          <span>/</span>
          <span className="text-[#1A1D2A] font-bold truncate max-w-xs">{product.name}</span>
        </nav>

        {/* Product Showcase Card */}
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-10 bg-white p-6 sm:p-10 rounded-3xl border border-black/8 shadow-sm">
          {/* Product Gallery (5 Cols) */}
          <div className="lg:col-span-5 space-y-4">
            <div className="relative aspect-square rounded-2xl overflow-hidden bg-[#F8FAFC] border border-black/5 flex items-center justify-center group">
              <img
                src={activeImage}
                alt={`${product.name} - صورة 1`}
                width={720}
                height={720}
                fetchPriority="high"
                className="w-full h-full object-contain object-center p-3"
              />
              {hasDiscount && (
                <span className="absolute top-4 start-4 bg-[#EF4444] text-white text-xs font-black px-3.5 py-1.5 rounded-xl shadow-md">
                  خصم خاص
                </span>
              )}
            </div>
            <div className="grid grid-cols-3 gap-3" role="list" aria-label="صور المنتج">
              {galleryImages.map((image, index) => (
                <button
                  key={image}
                  type="button"
                  aria-label={`عرض صورة المنتج ${index + 1}`}
                  aria-current={activeImage === image}
                  className={`relative aspect-square overflow-hidden rounded-xl border-2 bg-[#F8FAFC] transition-all ${
                    activeImage === image
                      ? "border-[#2B7BD4] ring-4 ring-[#2B7BD4]/15"
                      : "border-transparent hover:border-[#AACFF0]"
                  }`}
                >
                  <img
                    src={image}
                    alt=""
                    width={180}
                    height={180}
                    loading={index === 0 ? "eager" : "lazy"}
                    className="h-full w-full object-contain p-2"
                  />
                </button>
              ))}
            </div>

            {/* Quality badges */}
            <div className="grid grid-cols-3 gap-2.5 pt-2 text-center">
              <div className="p-3 rounded-xl bg-[#EEF5FC] border border-[#AACFF0]/40 text-[#1F63B3]">
                <Shield01Icon size={18} className="mx-auto mb-1 text-[#2B7BD4]" />
                <span className="text-[11px] font-bold block">ضمان {product.warranty_months} شهراً</span>
              </div>
              <div className="p-3 rounded-xl bg-[#EEF5FC] border border-[#AACFF0]/40 text-[#1F63B3]">
                <DeliveryTruck01Icon size={18} className="mx-auto mb-1 text-[#2B7BD4]" />
                <span className="text-[11px] font-bold block">شحن فوري</span>
              </div>
              <div className="p-3 rounded-xl bg-[#F0FDF4] border border-[#22C55E]/20 text-[#16A34A]">
                <CheckmarkCircle01Icon size={18} className="mx-auto mb-1 text-[#22C55E]" />
                <span className="text-[11px] font-bold block">أصلي 100%</span>
              </div>
            </div>
          </div>

          {/* Product Info & Actions (7 Cols) */}
          <div className="lg:col-span-7 flex flex-col justify-between space-y-6">
            <div className="space-y-4">
              {/* Category, Brand, SKU */}
              <div className="flex flex-wrap items-center gap-3">
                <span className="text-xs font-bold text-[#1F63B3] bg-[#EEF5FC] px-3 py-1 rounded-full border border-[#AACFF0]/40">
                  {product.category_name}
                </span>
                <span className="text-xs font-semibold text-[#64748B]">
                  الماركة: <strong className="text-[#1A1D2A]">{product.brand_name}</strong>
                </span>
                <span className="text-xs font-mono text-[#94A3B8]">SKU: {product.sku}</span>
              </div>

              {/* Title */}
              <h1 className="text-2xl sm:text-3xl font-black text-[#1A1D2A] leading-tight">
                {product.name}
              </h1>

              {/* Rating and Stock */}
              <div className="flex items-center gap-3 text-xs">
                <div className="flex items-center text-[#F59E0B]">
                  <StarIcon size={16} color="#F59E0B" className="fill-[#F59E0B]" />
                  <span className="ms-1.5 font-bold text-[#1A1D2A] text-sm">
                    {product.rating_avg}
                  </span>
                </div>
                <span className="text-[#94A3B8]">({reviews.length} تقييم)</span>
                <span className="text-[#CBD5E1]">•</span>
                <span className="text-[#16A34A] font-bold bg-[#22C55E]/10 px-2.5 py-0.5 rounded-full flex items-center gap-1">
                  <CheckmarkCircle01Icon size={14} color="#22C55E" />
                  <span>متوفر بالمخزون ({product.stock_quantity} قطعة)</span>
                </span>
              </div>

              {/* Price Banner */}
              <div className="p-5 rounded-2xl bg-[#F8FAFC] border border-black/5 flex items-baseline gap-4">
                <span className="text-3xl sm:text-4xl font-black text-[#1A1D2A] tracking-tight">
                  {formatPrice(product.discount_price || product.price)}
                </span>
                {hasDiscount && (
                  <span className="text-base text-[#94A3B8] line-through font-semibold">
                    {formatPrice(product.price)}
                  </span>
                )}
                <span className="text-xs text-[#2B7BD4] font-semibold ms-auto bg-white px-3 py-1 rounded-lg border border-[#AACFF0]/40 shadow-xs">
                  شامل ضريبة القيمة المضافة
                </span>
              </div>

              {/* Description */}
              <div>
                <h3 className="text-xs font-bold text-[#64748B] uppercase tracking-wider mb-2">
                  نظرة عامة عن المنتج:
                </h3>
                <p className="text-sm text-[#475569] leading-relaxed">
                  {product.description_ar}
                </p>
              </div>

              {/* Technical Specifications */}
              <div className="p-4 rounded-2xl bg-[#EEF5FC]/60 border border-[#AACFF0]/30 space-y-1.5">
                <h4 className="text-xs font-bold text-[#164A88] flex items-center gap-1.5">
                  <span className="w-1.5 h-1.5 rounded-full bg-[#6AABF0]" />
                  <span>المواصفات الفنية المعتمدة:</span>
                </h4>
                <p className="text-xs font-mono text-[#1F63B3] leading-relaxed">
                  {product.specs_ar}
                </p>
              </div>
            </div>

            {/* Quantity and Cart Actions */}
            <div className="pt-6 border-t border-black/8 space-y-4">
              <div className="flex flex-col sm:flex-row items-stretch sm:items-center gap-4">
                <div className="flex items-center justify-between sm:justify-start border border-black/10 rounded-xl overflow-hidden bg-white p-1">
                  <button
                    type="button"
                    className="w-10 h-10 flex items-center justify-center text-sm font-bold text-[#64748B] hover:bg-[#F8FAFC] rounded-lg transition-colors cursor-pointer"
                  >
                    -
                  </button>
                  <span className="w-12 text-center text-sm font-bold text-[#1A1D2A]">
                    1
                  </span>
                  <button
                    type="button"
                    className="w-10 h-10 flex items-center justify-center text-sm font-bold text-[#64748B] hover:bg-[#F8FAFC] rounded-lg transition-colors cursor-pointer"
                  >
                    +
                  </button>
                </div>

                <Button
                  variant="outline"
                  size="lg"
                  aria-label="إضافة إلى المفضلة"
                  title="إضافة إلى المفضلة"
                  className="gap-2 px-4 cursor-pointer"
                >
                  <FavouriteIcon size={20} color="#475569" />
                </Button>

                <Button
                  variant="primary"
                  size="lg"
                  className="flex-1 gap-2.5 text-base py-3.5 shadow-lg shadow-[#6AABF0]/30 cursor-pointer"
                >
                  <ShoppingBag01Icon size={20} />
                  <span>إضافة إلى سلة المشتريات</span>
                </Button>
              </div>
            </div>
          </div>
        </div>

        {/* Customer Reviews Section */}
        <section className="bg-white p-6 sm:p-10 rounded-3xl border border-black/8 shadow-sm space-y-8">
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pb-6 border-b border-black/5">
            <div>
              <h2 className="text-xl sm:text-2xl font-black text-[#1A1D2A]">
                تقييمات وآراء المشترين ({reviews.length})
              </h2>
              <p className="text-xs text-[#64748B] mt-1">
                تجارب حقيقية لعملاء قاموا باقتناء هذا المنتج واستخدامه
              </p>
            </div>
            <Button
              variant="outline"
              size="md"
              className="gap-2 cursor-pointer self-start sm:self-auto"
            >
              <Add01Icon size={16} />
              <span>أضف تقييمك للمنتج</span>
            </Button>
          </div>

          {/* Reviews Grid */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
            {reviews.map((rev) => (
              <div
                key={rev.review_id}
                className="p-5 rounded-2xl bg-[#F8FAFC] border border-black/5 space-y-2.5"
              >
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-2.5">
                    <div className="w-8 h-8 rounded-full bg-[#EEF5FC] text-[#2B7BD4] flex items-center justify-center font-bold text-xs">
                      {rev.customer_name.charAt(0)}
                    </div>
                    <span className="font-bold text-xs text-[#1A1D2A]">{rev.customer_name}</span>
                  </div>
                  <div className="flex items-center text-[#F59E0B]">
                    {Array.from({ length: rev.rating }).map((_, i) => (
                      <StarIcon key={i} size={14} color="#F59E0B" className="fill-[#F59E0B]" />
                    ))}
                  </div>
                </div>
                <p className="text-xs text-[#475569] leading-relaxed">&ldquo;{rev.comment}&rdquo;</p>
              </div>
            ))}
          </div>
        </section>

        {/* Similar / Related Products Section */}
        {relatedProducts.length > 0 && (
          <section className="space-y-6">
            <div className="flex items-end justify-between">
              <div>
                <span className="text-xs font-bold text-[#6AABF0] uppercase tracking-wider block mb-1">
                  اقتراحات مماثلة
                </span>
                <h2 className="text-xl sm:text-2xl font-black text-[#1A1D2A]">
                  منتجات ذات صلة من نفس الفئة
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
              {relatedProducts.slice(0, 4).map((p) => (
                <ProductCard key={p.product_id} product={p} />
              ))}
            </div>
          </section>
        )}
      </main>

      <Footer />
    </div>
  );
}
