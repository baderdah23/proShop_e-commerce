import Link from "next/link";
import { Navbar } from "@/shared/components/Navbar";
import { Footer } from "@/shared/components/Footer";
import { Button } from "@/shared/components/Button";
import { SectionHeading } from "@/shared/components/SectionHeading";
import { ProductCard } from "@/features/products/components/ProductCard";
import { ProductGallery } from "@/features/products/components/ProductGallery";
import { AddReviewButton } from "@/features/products/components/AddReviewButton";
import { formatPrice } from "@/shared/utils";
import type { Product, Review } from "@/shared/types";
import {
  StarIcon,
  Shield01Icon,
  DeliveryTruck01Icon,
  ShoppingBag01Icon,
  CheckmarkCircle01Icon,
  FavouriteIcon,
} from "hugeicons-react";
import { fetchOrFallback } from "@/lib/api/fetch-or-fallback";

type ProductResponse = { success: boolean; product: Product };
type ReviewsResponse = { success: boolean; data: Review[] };
type ProductsListResponse = { success: boolean; products: Product[] };

export default async function ProductDetailPage({
  searchParams,
}: {
  searchParams: Promise<{ id?: string }>;
}) {
  const { id: productId } = await searchParams;

  // المنتج والمراجعات مستقلتان — تُجلبان معاً. المنتجات المرتبطة تعتمد
  // على category_id فلابد تنتظر اكتمال المنتج أولاً (طابور مائي لو عكّستها).
  const [productRes, reviewsRes] = await Promise.all([
    fetchOrFallback<ProductResponse | null>(`products/${productId}`, null),
    fetchOrFallback<ReviewsResponse | null>(
      `reviews/product/${productId}`,
      null,
    ),
  ]);

  const product = productRes?.product;
  const reviews = reviewsRes?.data ?? [];

  if (!product) {
    return (
      <div className="flex min-h-screen flex-col bg-paper">
        <Navbar />
        <main className="flex flex-1 items-center justify-center px-4">
          <div className="w-full max-w-md rounded-[24px] border border-line bg-surface px-6 py-14 text-center shadow-[0_6px_24px_rgba(10,11,10,0.05)]">
            <span className="mx-auto mb-4 grid size-11 place-items-center rounded-2xl bg-brand-soft text-brand">
              <ShoppingBag01Icon size={20} />
            </span>
            <p className="text-[15px] font-black text-ink">
              لم نجد هذا المنتج
            </p>
          </div>
        </main>
        <Footer />
      </div>
    );
  }

  const relatedProductsRes = await fetchOrFallback<ProductsListResponse | null>(
    `products?category=${product.category_id}&limit=4`,
    null,
  );
  const relatedProducts = relatedProductsRes?.products ?? [];

  return (
    <div className="flex min-h-screen flex-col bg-paper">
      <Navbar />

      <main className="shell flex-1 py-10 sm:py-12">
        <nav
          aria-label="مسار التنقل"
          className="mb-8 flex flex-wrap items-center gap-2 text-[12px] font-medium text-muted"
        >
          <Link href="/" className="transition-colors hover:text-brand">
            الرئيسية
          </Link>
          <span className="text-line" aria-hidden="true">
            /
          </span>
          <Link
            href="/products"
            className="transition-colors hover:text-brand"
          >
            المنتجات
          </Link>
          <span className="text-line" aria-hidden="true">
            /
          </span>
          <Link
            href={`/products?category=${product.category_id}`}
            className="transition-colors hover:text-brand"
          >
            {product.category_name}
          </Link>
          <span className="text-line" aria-hidden="true">
            /
          </span>
          <span
            aria-current="page"
            className="max-w-xs truncate font-bold text-ink"
          >
            {product.name}
          </span>
        </nav>

        <div className="grid grid-cols-1 gap-8 rounded-2xl border border-line bg-surface p-6 shadow-[0_8px_30px_rgba(10,11,10,0.05)] sm:p-10 lg:grid-cols-12 lg:gap-12">
          <div className="lg:col-span-5">
            <ProductGallery
              images={product.images ?? []}
              productName={product.name}
              badge={
                product.discount_price ? (
                  <span className="absolute start-4 top-4 rounded-xl bg-sale px-3.5 py-1.5 text-[11px] font-black text-white shadow-lg">
                    خصم خاص
                  </span>
                ) : undefined
              }
            />

            <div className="mt-4 grid grid-cols-3 gap-2.5 text-center">
              <div className="rounded-lg border border-line bg-paper p-3">
                <Shield01Icon size={18} className="mx-auto mb-1.5 text-brand" />
                <span className="block text-[10px] font-bold leading-4 text-ink">
                  ضمان {product.warranty_months} شهراً
                </span>
              </div>
              <div className="rounded-lg border border-line bg-paper p-3">
                <DeliveryTruck01Icon
                  size={18}
                  className="mx-auto mb-1.5 text-brand"
                />
                <span className="block text-[10px] font-bold leading-4 text-ink">
                  شحن فوري
                </span>
              </div>
              <div className="rounded-lg border border-line bg-brand-soft p-3">
                <CheckmarkCircle01Icon
                  size={18}
                  className="mx-auto mb-1.5 text-brand"
                />
                <span className="block text-[10px] font-bold leading-4 text-ink">
                  أصلي 100%
                </span>
              </div>
            </div>
          </div>

          <div className="flex flex-col justify-between gap-8 lg:col-span-7">
            <div className="space-y-5">
              <div className="flex flex-wrap items-center gap-3">
                <span className="inline-flex items-center gap-2 rounded-full border border-line bg-brand-soft px-3 py-1 text-[11px] font-bold text-ink">
                  <span
                    aria-hidden="true"
                    className="size-1.5 rounded-full bg-signal"
                  />
                  {product.category_name}
                </span>
                <span className="text-[12px] text-muted">
                  الماركة:{" "}
                  <strong className="font-bold text-ink">
                    {product.brand_name}
                  </strong>
                </span>
                <span className="font-latin text-[11px] font-medium text-muted">
                  SKU: {product.sku}
                </span>
              </div>

              <h1 className="text-[28px] font-black leading-[1.15] tracking-[-0.03em] text-ink sm:text-[38px]">
                {product.name}
              </h1>

              <div className="flex flex-wrap items-center gap-3 text-[12px]">
                <div className="flex items-center text-brand">
                  <StarIcon size={16} className="fill-brand text-brand" />
                  <span className="font-latin ms-1.5 text-[14px] font-black text-ink">
                    {product.rating_avg}
                  </span>
                </div>
                <span className="text-muted">
                  ({product.rating_count} تقييم)
                </span>
                <span className="text-line" aria-hidden="true">
                  •
                </span>
                <span className="inline-flex items-center gap-1 rounded-full border border-line bg-brand-soft px-2.5 py-1 font-bold text-ink">
                  <CheckmarkCircle01Icon size={14} className="text-brand" />
                  <span>متوفر بالمخزون ({product.stock_quantity} قطعة)</span>
                </span>
              </div>

              <div className="relative overflow-hidden rounded-xl border border-line bg-paper p-5 sm:p-6">
                <span
                  aria-hidden="true"
                  className="absolute inset-x-0 top-0 h-0.5 bg-signal"
                />
                <div className="flex flex-wrap items-baseline gap-4">
                  <span className="font-latin text-[32px] font-black tracking-tight text-ink sm:text-[42px]">
                    {formatPrice(product.discount_price || product.price)}
                  </span>
                  {product.discount_price && (
                    <span className="font-latin text-[15px] font-semibold text-muted line-through">
                      {formatPrice(product.price)}
                    </span>
                  )}
                  <span className="ms-auto rounded-lg border border-line bg-surface px-3 py-1.5 text-[11px] font-bold text-muted shadow-sm">
                    شامل ضريبة القيمة المضافة
                  </span>
                </div>
              </div>

              <div>
                <div className="mb-2.5 flex items-center gap-2 text-[12px] font-black text-muted">
                  <span className="h-0.5 w-6 rounded-full bg-signal" />
                  نظرة عامة عن المنتج
                </div>
                <p className="text-[13px] leading-7 text-ink/75">
                  {product.description_ar}
                </p>
              </div>

              <div className="rounded-xl border border-line bg-brand-soft p-5">
                <h4 className="mb-2.5 flex items-center gap-2 text-[12px] font-black text-ink">
                  <span className="size-1.5 rounded-full bg-signal" />
                  المواصفات الفنية المعتمدة
                </h4>
                <p className="text-[12px] leading-7 text-ink/80">
                  {product.specs_ar}
                </p>
              </div>
            </div>

            <div className="space-y-4 border-t border-line pt-6">
              <div className="flex flex-col gap-3 sm:flex-row sm:items-center">
                <div className="flex items-center justify-between rounded-xl border border-line bg-paper p-1 sm:justify-start">
                  <button
                    type="button"
                    className="flex size-10 items-center justify-center rounded-lg text-[14px] font-bold text-muted transition-colors hover:bg-surface hover:text-ink"
                  >
                    -
                  </button>
                  <span className="font-latin w-12 text-center text-[14px] font-black text-ink">
                    1
                  </span>
                  <button
                    type="button"
                    className="flex size-10 items-center justify-center rounded-lg text-[14px] font-bold text-muted transition-colors hover:bg-surface hover:text-ink"
                  >
                    +
                  </button>
                </div>

                <Button
                  variant="outline"
                  size="lg"
                  aria-label="إضافة إلى المفضلة"
                  title="إضافة إلى المفضلة"
                  className="gap-2 px-4 cursor-pointer text-muted hover:text-brand"
                >
                  <FavouriteIcon size={20} />
                </Button>

                <Button
                  variant="primary"
                  size="lg"
                  className="flex-1 gap-2.5 py-3.5 text-[15px] cursor-pointer"
                >
                  <ShoppingBag01Icon size={20} />
                  <span>إضافة إلى سلة المشتريات</span>
                </Button>
              </div>
            </div>
          </div>
        </div>

        <section className="mt-12 rounded-2xl border border-line bg-surface p-6 shadow-[0_8px_30px_rgba(10,11,10,0.05)] sm:p-10">
          <div className="flex flex-col gap-5 border-b border-line pb-6 sm:flex-row sm:items-end sm:justify-between">
            <div>
              <div className="mb-2.5 flex items-center gap-2">
                <span className="size-1.5 rounded-full bg-signal" />
                <span className="eyebrow text-brand">REVIEWS / 02</span>
              </div>
              <h2 className="text-[22px] font-black leading-tight tracking-tight text-ink sm:text-[28px]">
                تقييمات وآراء المشترين ({product.rating_count})
              </h2>
              <p className="mt-2 text-[12px] leading-6 text-muted">
                تجارب حقيقية لعملاء قاموا باقتناء هذا المنتج واستخدامه
              </p>
            </div>
            <AddReviewButton
              product_id={product.product_id}
              customerName="ahmed"
            />
          </div>

          <div className="mt-7 grid grid-cols-1 gap-4 md:grid-cols-2">
            {reviews.map((rev) => (
              <div
                key={rev.review_id}
                className="space-y-3 rounded-xl border border-line bg-paper p-5"
              >
                <div className="flex items-center justify-between gap-3">
                  <div className="flex items-center gap-2.5">
                    <span className="grid size-9 place-items-center rounded-lg bg-ink text-[12px] font-black text-white">
                      {rev.customer_name.charAt(0)}
                    </span>
                    <span className="text-[12px] font-bold text-ink">
                      {rev.customer_name}
                    </span>
                  </div>
                  <div className="flex items-center text-brand">
                    {Array.from({ length: rev.rating }).map((_, i) => (
                      <StarIcon
                        key={i}
                        size={14}
                        className="fill-brand text-brand"
                      />
                    ))}
                  </div>
                </div>
                <p className="text-[13px] leading-7 text-ink/75">
                  &ldquo;{rev.comment}&rdquo;
                </p>
              </div>
            ))}
          </div>
        </section>

        {relatedProducts.length > 0 && (
          <section className="mt-16 space-y-8">
            <SectionHeading
              index="03 /"
              eyebrow="اقتراحات مماثلة"
              title="منتجات ذات صلة من نفس الفئة"
              action={{ label: "مشاهدة الكل", href: "/products" }}
            />

            <div className="grid grid-cols-1 gap-5 sm:grid-cols-2 lg:grid-cols-4">
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
