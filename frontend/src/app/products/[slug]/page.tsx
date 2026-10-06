"use client";

import React, { use, useEffect, useMemo, useState } from "react";
import Link from "next/link";
import { Navbar } from "@/shared/components/Navbar";
import { Footer } from "@/shared/components/Footer";
import { Button } from "@/shared/components/Button";
import { ProductCard } from "@/features/products/components/ProductCard";
import { formatPrice } from "@/shared/utils";
import { Product, Review } from "@/shared/types";
import { CartApi, ProductsApi, ReviewsApi, WishlistApi } from "@/lib/api-client";
import { useAuth } from "@/features/auth";
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
import { toast } from "sonner";
import {
  getProductImageSources,
  isExcludedProduct,
} from "@/shared/utils/product-images";

export default function ProductDetailPage({
  searchParams,
}: {
  searchParams: Promise<{ id?: string }>;
}) {
  const resolvedSearchParams = use(searchParams);
  const productId = resolvedSearchParams.id;

  const { user } = useAuth();
  const [product, setProduct] = useState<Product | null>(null);
  const [relatedProducts, setRelatedProducts] = useState<Product[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [loadError, setLoadError] = useState<string | null>(null);
  const [quantity, setQuantity] = useState(1);
  const [reviews, setReviews] = useState<Review[]>([]);
  const [selectedImage, setSelectedImage] = useState("");
  const [showReviewModal, setShowReviewModal] = useState(false);
  const [authorName, setAuthorName] = useState("");
  const [ratingVal, setRatingVal] = useState(5);
  const [commentText, setCommentText] = useState("");
  const [failedImages, setFailedImages] = useState<string[]>([]);
  const [isInWishlist, setIsInWishlist] = useState(false);

  useEffect(() => {
    if (!productId) {
      return;
    }
    Promise.all([
      ProductsApi.getById(productId),
      ProductsApi.getAll({ limit: 100 }),
      ReviewsApi.getByProductId(productId),
      WishlistApi.getAll().catch(() => []),
    ])
      .then(([loadedProduct, productResult, loadedReviews, wishlist]) => {
        if (!loadedProduct) {
          setLoadError("المنتج غير موجود.");
          return;
        }
        if (isExcludedProduct(loadedProduct)) {
          setLoadError("هذا المنتج غير متاح للعرض.");
          return;
        }
        setProduct(loadedProduct);
        setReviews(loadedReviews);
        setIsInWishlist(
          wishlist.some(
            (wishlistItem) => wishlistItem.product_id === loadedProduct.product_id,
          ),
        );
        setRelatedProducts(
          productResult.products.filter(
            (item) =>
              item.product_id !== loadedProduct.product_id &&
              !isExcludedProduct(item) &&
              (item.category_id === loadedProduct.category_id ||
                item.brand_id === loadedProduct.brand_id),
          ),
        );
      })
      .catch((error) =>
        setLoadError(error instanceof Error ? error.message : "تعذر تحميل المنتج."),
      )
      .finally(() => setIsLoading(false));
  }, [productId]);

  const galleryImages = useMemo(() => {
    if (!product) return [];
    return getProductImageSources(product).filter(
      (image) => !failedImages.includes(image),
    );
  }, [failedImages, product]);

  if (isLoading || !product) {
    return (
      <div className="min-h-screen flex flex-col bg-[#F8FAFC]">
        <Navbar />
        <div className="flex-1 flex items-center justify-center text-sm font-bold">
          {loadError || (!productId ? "رابط المنتج غير صالح." : "جارٍ تحميل المنتج...")}
        </div>
        <Footer />
      </div>
    );
  }
  const activeImage = galleryImages.includes(selectedImage)
    ? selectedImage
    : galleryImages[0] ?? "";
  const handleAddReview = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!authorName.trim() || !commentText.trim()) {
      toast.error("يرجى كتابة الاسم والتعليق.");
      return;
    }

    if (!user) {
      toast.error("يجب تسجيل الدخول لإضافة تقييم.");
      return;
    }
    try {
      const newReview = await ReviewsApi.create({
        product_id: product.product_id,
        customerName: authorName,
        rating: ratingVal,
        comment: commentText,
      });
      setReviews((currentReviews) => [newReview, ...currentReviews]);
      setShowReviewModal(false);
      setAuthorName("");
      setCommentText("");
      toast.success("شكراً لك! تم إضافة تقييمك للمنتج بنجاح.");
    } catch (error) {
      toast.error(error instanceof Error ? error.message : "تعذر إضافة التقييم.");
    }
  };

  const toggleWishlist = async () => {
    if (!user) {
      toast.error("يجب تسجيل الدخول لإضافة المنتجات إلى المفضلة.");
      return;
    }
    try {
      if (isInWishlist) {
        await WishlistApi.remove(product.product_id);
        setIsInWishlist(false);
        toast.success("تمت الإزالة من المفضلة.");
      } else {
        await WishlistApi.add(product.product_id);
        setIsInWishlist(true);
        toast.success("تمت الإضافة إلى المفضلة.");
      }
    } catch (error) {
      toast.error(error instanceof Error ? error.message : "تعذر تحديث المفضلة.");
    }
  };

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
                alt={`${product.name} - صورة ${galleryImages.indexOf(activeImage) + 1}`}
                width={720}
                height={720}
                fetchPriority="high"
                className="w-full h-full object-contain object-center p-3"
                onError={() => {
                  if (activeImage) {
                    setFailedImages((current) =>
                      current.includes(activeImage)
                        ? current
                        : [...current, activeImage],
                    );
                  }
                }}
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
                  onClick={() => setSelectedImage(image)}
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
                    onError={() => {
                      setFailedImages((current) =>
                        current.includes(image) ? current : [...current, image],
                      );
                    }}
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
                    onClick={() => setQuantity(Math.max(1, quantity - 1))}
                    className="w-10 h-10 flex items-center justify-center text-sm font-bold text-[#64748B] hover:bg-[#F8FAFC] rounded-lg transition-colors cursor-pointer"
                  >
                    -
                  </button>
                  <span className="w-12 text-center text-sm font-bold text-[#1A1D2A]">
                    {quantity}
                  </span>
                  <button
                    onClick={() => setQuantity(quantity + 1)}
                    className="w-10 h-10 flex items-center justify-center text-sm font-bold text-[#64748B] hover:bg-[#F8FAFC] rounded-lg transition-colors cursor-pointer"
                  >
                    +
                  </button>
                </div>

                <Button
                  variant="outline"
                  size="lg"
                  onClick={toggleWishlist}
                  aria-label={isInWishlist ? "إزالة من المفضلة" : "إضافة إلى المفضلة"}
                  aria-pressed={isInWishlist}
                  title={isInWishlist ? "إزالة من المفضلة" : "إضافة إلى المفضلة"}
                  className="gap-2 px-4 cursor-pointer"
                >
                  <FavouriteIcon
                    size={20}
                    color={isInWishlist ? "#EF4444" : "#475569"}
                    className={isInWishlist ? "fill-[#EF4444]" : ""}
                  />
                </Button>

                <Button
                  variant="primary"
                  size="lg"
                  className="flex-1 gap-2.5 text-base py-3.5 shadow-lg shadow-[#6AABF0]/30 cursor-pointer"
                  onClick={async () => {
                    if (!user) {
                      toast.error("يجب تسجيل الدخول لإضافة المنتج إلى السلة.");
                      return;
                    }
                    try {
                      await CartApi.addItem(product.product_id, quantity);
                      toast.success(`تمت إضافة ${quantity} قطع إلى سلة المشتريات بنجاح.`);
                    } catch (error) {
                      toast.error(error instanceof Error ? error.message : "تعذر إضافة المنتج.");
                    }
                  }}
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
              onClick={() => setShowReviewModal(true)}
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

          {/* Add Review Modal */}
          {showReviewModal && (
            <form
              onSubmit={handleAddReview}
              className="p-6 rounded-2xl bg-[#EEF5FC]/60 border border-[#AACFF0]/60 space-y-4 max-w-xl"
            >
              <h3 className="font-bold text-sm text-[#1A1D2A]">كتابة تقييم جديد</h3>

              <div>
                <label className="text-xs font-semibold text-[#475569] block mb-1">اسمك الكريم</label>
                <input
                  type="text"
                  required
                  placeholder="مثال: عبد الرحمن خالد"
                  value={authorName}
                  onChange={(e) => setAuthorName(e.target.value)}
                  className="w-full px-3.5 py-2 rounded-xl bg-white border border-black/10 text-xs focus:outline-none focus:border-[#6AABF0]"
                />
              </div>

              <div>
                <label className="text-xs font-semibold text-[#475569] block mb-1">التقييم العام</label>
                <div className="flex gap-2">
                  {[5, 4, 3, 2, 1].map((r) => (
                    <button
                      key={r}
                      type="button"
                      onClick={() => setRatingVal(r)}
                      className={`px-3 py-1.5 rounded-lg text-xs font-bold cursor-pointer ${
                        ratingVal === r
                          ? "bg-[#F59E0B] text-white"
                          : "bg-white text-[#475569] border border-black/10"
                      }`}
                    >
                      {r} ★
                    </button>
                  ))}
                </div>
              </div>

              <div>
                <label className="text-xs font-semibold text-[#475569] block mb-1">رأيك وتجربتك</label>
                <textarea
                  required
                  rows={3}
                  placeholder="شارك تفاصيل أداء المنتج وملاحظاتك..."
                  value={commentText}
                  onChange={(e) => setCommentText(e.target.value)}
                  className="w-full px-3.5 py-2 rounded-xl bg-white border border-black/10 text-xs focus:outline-none focus:border-[#6AABF0]"
                />
              </div>

              <div className="flex items-center gap-3">
                <Button variant="primary" size="sm" type="submit" className="cursor-pointer">
                  نشر التقييم
                </Button>
                <Button
                  variant="ghost"
                  size="sm"
                  type="button"
                  onClick={() => setShowReviewModal(false)}
                  className="cursor-pointer"
                >
                  إلغاء
                </Button>
              </div>
            </form>
          )}
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
