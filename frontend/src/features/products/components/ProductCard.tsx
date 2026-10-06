"use client";

import React, { useEffect, useState } from "react";
import Link from "next/link";
import { StarIcon, ShoppingBag01Icon, FavouriteIcon } from "hugeicons-react";
import { Product } from "@/shared/types";
import { formatPrice } from "@/shared/utils";
import { SpotlightCard } from "@/shared/components/SpotlightCard";
import { Button } from "@/shared/components/Button";
import { toast } from "sonner";
import { CartApi, WishlistApi } from "@/lib/api-client";
import { useAuth } from "@/features/auth";
import { getProductImageSources } from "@/shared/utils/product-images";

interface ProductCardProps {
  product: Product;
}

export function ProductCard({ product }: ProductCardProps) {
  const { user } = useAuth();
  const imageSources = getProductImageSources(product);
  const [imageIndex, setImageIndex] = useState(0);

  useEffect(() => {
    setImageIndex(0);
  }, [product.product_id]);

  const hasDiscount = product.discount_price < product.price;
  const discountPercent = hasDiscount
    ? Math.round(
        ((product.price - product.discount_price) / product.price) * 100,
      )
    : 0;

  const handleAddToCart = async (e: React.MouseEvent) => {
    e.preventDefault();
    if (!user) {
      toast.error("سجل الدخول لإضافة المنتجات إلى السلة.");
      return;
    }
    try {
      await CartApi.addItem(product.product_id, 1);
      toast.success("تمت إضافة المنتج إلى السلة.");
    } catch (error) {
      toast.error(error instanceof Error ? error.message : "تعذر إضافة المنتج.");
    }
  };

  const handleToggleWishlist = async (e: React.MouseEvent) => {
    e.preventDefault();
    if (!user) {
      toast.error("سجل الدخول لإضافة المنتجات إلى المفضلة.");
      return;
    }
    try {
      await WishlistApi.add(product.product_id);
      toast.success("تمت الإضافة إلى المفضلة.");
    } catch (error) {
      toast.error(error instanceof Error ? error.message : "تعذر إضافة المنتج.");
    }
  };

  return (
    <SpotlightCard className="h-full flex flex-col group p-4 border border-[#D9E6F2] hover:border-[#4F8FD8]/60 hover:-translate-y-1 transition-all duration-300 shadow-[0_8px_24px_rgba(20,32,51,0.04)]">
      {/* Product Image & Badges */}
      <div className="relative w-full aspect-square rounded-2xl overflow-hidden bg-[#F8FAFC] border border-[#EAF1F8] mb-4 p-2">
        {imageIndex < imageSources.length ? (
          <img
            src={imageSources[imageIndex]}
            alt={product.name}
            className="block w-full h-full object-contain object-center"
            onError={() => {
              setImageIndex((currentIndex) => currentIndex + 1);
            }}
          />
        ) : (
          <div className="w-full h-full flex items-center justify-center text-xs text-[#94A3B8]">
            صورة المنتج
          </div>
        )}

        {/* Discount Badge */}
        {hasDiscount && (
          <span className="absolute top-2.5 start-2.5 bg-[#EF4444] text-white text-[11px] font-bold px-2 py-0.5 rounded-lg shadow-sm">
            خصم {discountPercent}%
          </span>
        )}

        {/* Wishlist Button */}
        <button
          type="button"
          onClick={handleToggleWishlist}
          aria-label="إضافة للمفضلة"
          className="absolute top-2.5 end-2.5 w-8 h-8 rounded-lg bg-white/90 backdrop-blur-sm border border-black/8 flex items-center justify-center text-[#64748B] hover:text-[#EF4444] transition-colors shadow-sm"
        >
          <FavouriteIcon size={16} />
        </button>
      </div>

      {/* Product Category & Brand */}
      <div className="flex items-center justify-between text-xs text-[#64748B] mb-1.5 font-medium">
        <span>{product.category_name || "منتجات تقنية"}</span>
        <span className="text-[#2B7BD4] font-semibold">
          {product.brand_name}
        </span>
      </div>

      {/* Product Title */}
      <Link
        href={`/products/${encodeURIComponent(product.slug)}?id=${encodeURIComponent(product.product_id)}`}
        className="block mb-2 group-hover:text-[#6AABF0] transition-colors"
      >
        <h3 className="font-bold text-sm text-[#1A1D2A] line-clamp-2 leading-snug">
          {product.name}
        </h3>
      </Link>

      {/* Ratings */}
      <div className="flex items-center gap-1.5 mb-3 text-xs">
        <div className="flex items-center text-[#F59E0B]">
          <StarIcon size={14} color="#F59E0B" className="fill-[#F59E0B]" />
          <span className="ms-1 font-bold text-[#1A1D2A]">
            {product.rating_avg}
          </span>
        </div>
        <span className="text-[#94A3B8]">({product.rating_count} تقييم)</span>
      </div>

      {/* Price & Add to Cart */}
      <div className="mt-auto pt-3 border-t border-black/5 flex items-center justify-between gap-2">
        <div>
          <div className="font-extrabold text-base text-[#1A1D2A]">
            {formatPrice(product.discount_price || product.price)}
          </div>
          {hasDiscount && (
            <div className="text-xs text-[#94A3B8] line-through font-medium">
              {formatPrice(product.price)}
            </div>
          )}
        </div>

        <Button
          variant="secondary"
          size="sm"
          onClick={handleAddToCart}
          className="rounded-xl px-3 py-1.5 text-xs font-semibold gap-1.5 hover:bg-[#6AABF0] hover:text-white transition-all"
        >
          <ShoppingBag01Icon size={14} />
          <span>إضافة</span>
        </Button>
      </div>
    </SpotlightCard>
  );
}
