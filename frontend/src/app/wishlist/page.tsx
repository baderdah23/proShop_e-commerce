"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import { Navbar } from "@/shared/components/Navbar";
import { Footer } from "@/shared/components/Footer";
import { Button } from "@/shared/components/Button";
import { CartApi, WishlistApi } from "@/lib/api-client";
import { useAuth } from "@/features/auth";
import type { Product, WishlistItem } from "@/shared/types";
import { formatPrice } from "@/shared/utils";
import { Delete01Icon, FavouriteIcon, ShoppingBag01Icon } from "hugeicons-react";
import { toast } from "sonner";
import { getProductImageSources } from "@/shared/utils/product-images";
import { isExcludedProduct } from "@/shared/utils/product-images";

export default function WishlistPage() {
  const { user, isLoading: isAuthLoading } = useAuth();
  const [items, setItems] = useState<WishlistItem[]>([]);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    if (!user) {
      return;
    }
    WishlistApi.getAll()
      .then((wishlist) =>
        setItems(
          wishlist.filter(
            (item) => item.product && !isExcludedProduct(item.product),
          ),
        ),
      )
      .catch((error) =>
        toast.error(error instanceof Error ? error.message : "تعذر تحميل المفضلة."),
      )
      .finally(() => setIsLoading(false));
  }, [isAuthLoading, user]);

  const remove = async (productId: string) => {
    try {
      await WishlistApi.remove(productId);
      setItems((current) =>
        current.filter((item) => item.product_id !== productId),
      );
      toast.success("تمت إزالة المنتج من المفضلة.");
    } catch (error) {
      toast.error(error instanceof Error ? error.message : "تعذر حذف المنتج.");
    }
  };

  const moveToCart = async (product: Product) => {
    try {
      await CartApi.addItem(product.product_id, 1);
      toast.success("تمت إضافة المنتج إلى السلة.");
    } catch (error) {
      toast.error(error instanceof Error ? error.message : "تعذر إضافة المنتج.");
    }
  };

  return (
    <div className="min-h-screen flex flex-col bg-[#F8FAFC]">
      <Navbar />
      <main className="flex-1 max-w-7xl w-full mx-auto px-4 sm:px-6 lg:px-8 py-10">
        <div className="flex items-center gap-3 mb-8">
          <FavouriteIcon size={24} className="text-[#2B7BD4]" />
          <h1 className="text-2xl sm:text-3xl font-black">قائمة أمنياتي المفضلة</h1>
        </div>
        {isAuthLoading || (user && isLoading) ? (
          <div className="flex justify-center py-20"><div className="w-8 h-8 border-2 border-[#6AABF0] border-t-transparent rounded-full animate-spin" /></div>
        ) : !user ? (
          <div className="text-center py-20 bg-white rounded-3xl border">
            <p className="font-bold mb-3">سجل الدخول لعرض المفضلة</p>
            <Link href="/login" className="text-[#2B7BD4] underline">تسجيل الدخول</Link>
          </div>
        ) : items.length === 0 ? (
          <div className="text-center py-20 bg-white rounded-3xl border">
            <p className="font-bold mb-3">لا توجد عناصر في المفضلة</p>
            <Link href="/products" className="text-[#2B7BD4] underline">تصفح المنتجات</Link>
          </div>
        ) : (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
            {items.map((item) => {
              const product = item.product;
              if (!product) return null;
              return (
                <div key={item.wishlist_id} className="bg-white p-5 rounded-3xl border shadow-sm space-y-4">
                  <div className="relative aspect-video rounded-2xl overflow-hidden bg-[#F1F5F9]">
                    <WishlistImage product={product} />
                    <button type="button" onClick={() => remove(product.product_id)} className="absolute top-2 end-2 p-2 rounded-xl bg-white text-red-500" aria-label="إزالة من المفضلة">
                      <Delete01Icon size={16} />
                    </button>
                  </div>
                  <Link href={`/products/${encodeURIComponent(product.slug)}?id=${encodeURIComponent(product.product_id)}`} className="font-bold text-sm block line-clamp-2">{product.name}</Link>
                  <div className="flex items-center justify-between">
                    <strong>{formatPrice(Number(product.discount_price || product.price))}</strong>
                    <Button size="sm" onClick={() => moveToCart(product)}><ShoppingBag01Icon size={14} />نقل للسلة</Button>
                  </div>
                </div>
              );
            })}
          </div>
        )}
      </main>
      <Footer />
    </div>
  );
}

function WishlistImage({ product }: { product: Product }) {
  const [imageIndex, setImageIndex] = useState(0);
  const imageSources = getProductImageSources(product);
  const source = imageSources[imageIndex];

  if (!source) {
    return (
      <div className="w-full h-full flex items-center justify-center text-xs text-[#94A3B8]">
        لا توجد صورة
      </div>
    );
  }

  return (
    <img
      src={source}
      alt={product.name}
      onError={() => setImageIndex((current) => current + 1)}
      className="w-full h-full object-contain p-2"
    />
  );
}
