"use client";

import { useEffect, useMemo, useState } from "react";
import Link from "next/link";
import { Navbar } from "@/shared/components/Navbar";
import { Footer } from "@/shared/components/Footer";
import { Button } from "@/shared/components/Button";
import { CartApi } from "@/lib/api-client";
import { useAuth } from "@/features/auth";
import { formatPrice } from "@/shared/utils";
import type { AppliedCoupon, CartItem } from "@/shared/types";
import { Delete01Icon, Ticket01Icon } from "hugeicons-react";
import { toast } from "sonner";
import { isExcludedProduct } from "@/shared/utils/product-images";

export default function CartPage() {
  const { user, isLoading: isAuthLoading } = useAuth();
  const [items, setItems] = useState<CartItem[]>([]);
  const [couponCode, setCouponCode] = useState("");
  const [coupon, setCoupon] = useState<AppliedCoupon | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const loadCart = () => {
    CartApi.get()
      .then((cart) => {
        setItems(
          cart.items.filter(
            (item) => !isExcludedProduct({ name: item.product_name, slug: "" }),
          ),
        );
        setCoupon(cart.applied_coupon);
      })
      .catch((requestError) =>
        setError(
          requestError instanceof Error
            ? requestError.message
            : "تعذر تحميل السلة.",
        ),
      )
      .finally(() => setIsLoading(false));
  };

  useEffect(() => {
    if (user) loadCart();
  }, [isAuthLoading, user]);

  const subtotal = useMemo(
    () => items.reduce((sum, item) => sum + Number(item.total_item_price), 0),
    [items],
  );
  const shipping = subtotal > 100 ? 0 : 15;
  const discount =
    coupon?.discount_type === "percentage"
      ? (subtotal * Number(coupon.discount_value)) / 100
      : Number(coupon?.discount_value || 0);
  const total = Math.max(0, subtotal - discount + shipping);

  const updateQuantity = async (item: CartItem, delta: number) => {
    const quantity = Math.max(1, item.quantity + delta);
    try {
      await CartApi.updateItem(item.cart_item_id, quantity);
      loadCart();
    } catch (requestError) {
      toast.error(
        requestError instanceof Error ? requestError.message : "تعذر تحديث الكمية.",
      );
    }
  };

  const removeItem = async (item: CartItem) => {
    try {
      await CartApi.removeItem(item.cart_item_id);
      setItems((currentItems) =>
        currentItems.filter(
          (currentItem) => currentItem.cart_item_id !== item.cart_item_id,
        ),
      );
      toast.success("تم إزالة المنتج من السلة.");
    } catch (requestError) {
      toast.error(
        requestError instanceof Error ? requestError.message : "تعذر حذف المنتج.",
      );
    }
  };

  const applyCoupon = async (event: React.FormEvent) => {
    event.preventDefault();
    try {
      const validatedCoupon = await CartApi.applyCoupon(couponCode.trim());
      setCoupon({
        coupon_id: validatedCoupon.coupon_id,
        code: validatedCoupon.code,
        discount_type: validatedCoupon.discount_type,
        discount_value: Number(validatedCoupon.discount_value),
      });
      setCouponCode("");
      toast.success("تم تطبيق الكوبون بنجاح.");
    } catch (requestError) {
      setCoupon(null);
      toast.error(
        requestError instanceof Error
          ? requestError.message
          : "كود الخصم غير صالح أو منتهي الصلاحية.",
      );
    }
  };

  const removeCoupon = async () => {
    try {
      await CartApi.removeCoupon();
      setCoupon(null);
      toast.success("تمت إزالة الكوبون.");
    } catch (requestError) {
      toast.error(
        requestError instanceof Error ? requestError.message : "تعذر إزالة الكوبون.",
      );
    }
  };

  if (isAuthLoading || (user && isLoading)) {
    return <PageShell><LoadingState /></PageShell>;
  }

  if (!user) {
    return (
      <PageShell>
        <EmptyState
          title="سجل الدخول لعرض سلتك"
          action={<Link href="/login" className="text-[#2B7BD4] underline">تسجيل الدخول</Link>}
        />
      </PageShell>
    );
  }

  return (
    <PageShell>
      <main className="flex-1 max-w-7xl w-full mx-auto px-4 sm:px-6 lg:px-8 py-10">
        <h1 className="text-2xl sm:text-3xl font-black text-[#1A1D2A] mb-8">
          سلة المشتريات ({items.length} منتجات)
        </h1>
        {error ? (
          <EmptyState title={error} action={<button onClick={loadCart} className="text-[#2B7BD4] underline">إعادة المحاولة</button>} />
        ) : items.length === 0 ? (
          <EmptyState title="سلة المشتريات فارغة" action={<Link href="/products" className="text-[#2B7BD4] underline">تصفح المنتجات</Link>} />
        ) : (
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">
            <div className="lg:col-span-8 bg-white p-6 rounded-3xl border border-black/8 shadow-sm divide-y divide-black/5">
              {items.map((item) => (
                <div key={item.cart_item_id} className="py-4 first:pt-0 last:pb-0 flex flex-wrap items-center gap-4">
                  <CartItemImage item={item} />
                  <div className="flex-1 min-w-40">
                    <h2 className="font-bold text-sm">{item.product_name}</h2>
                    <p className="text-xs text-[#64748B]">{formatPrice(Number(item.product_price))}</p>
                  </div>
                  <div className="flex items-center border rounded-xl overflow-hidden">
                    <button type="button" onClick={() => updateQuantity(item, -1)} className="w-8 h-8">−</button>
                    <span className="w-8 text-center text-xs">{item.quantity}</span>
                    <button type="button" onClick={() => updateQuantity(item, 1)} className="w-8 h-8">+</button>
                  </div>
                  <strong className="w-24 text-end text-sm">{formatPrice(Number(item.total_item_price))}</strong>
                  <button type="button" onClick={() => removeItem(item)} className="p-2 text-red-500" aria-label="حذف المنتج">
                    <Delete01Icon size={16} />
                  </button>
                </div>
              ))}
            </div>
            <aside className="lg:col-span-4 space-y-6">
              <div className="bg-white p-5 rounded-3xl border shadow-sm">
                {coupon ? (
                  <div className="space-y-2">
                    <p className="text-xs font-bold flex items-center gap-2 text-[#16A34A]">
                      <Ticket01Icon size={16} />الكوبون مفعّل: {coupon.code}
                    </p>
                    <button type="button" onClick={removeCoupon} className="text-xs text-[#2B7BD4] underline">إزالة الكوبون</button>
                  </div>
                ) : (
                  <form onSubmit={applyCoupon} className="space-y-3">
                    <label className="text-xs font-bold flex items-center gap-2"><Ticket01Icon size={16} />هل لديك كوبون؟</label>
                    <div className="flex gap-2">
                      <input value={couponCode} onChange={(event) => setCouponCode(event.target.value)} className="min-w-0 flex-1 px-3 py-2 border rounded-xl text-xs" placeholder="رمز الكوبون" />
                      <Button type="submit" variant="secondary" size="sm">تطبيق</Button>
                    </div>
                  </form>
                )}
              </div>
              <div className="bg-white p-6 rounded-3xl border shadow-sm space-y-3 text-sm">
                <h2 className="font-black">ملخص الطلب</h2>
                <div className="flex justify-between"><span>المجموع الفرعي</span><strong>{formatPrice(subtotal)}</strong></div>
                <div className="flex justify-between"><span>الشحن</span><strong>{shipping === 0 ? "مجاني" : formatPrice(shipping)}</strong></div>
                {discount > 0 && <div className="flex justify-between text-green-600"><span>الخصم</span><strong>-{formatPrice(discount)}</strong></div>}
                <div className="pt-3 border-t flex justify-between font-black"><span>الإجمالي</span><strong>{formatPrice(total)}</strong></div>
                <Link href="/checkout" className="block text-center bg-[#2B7BD4] text-white rounded-xl py-3 font-bold text-sm">متابعة الشراء</Link>
              </div>
            </aside>
          </div>
        )}
      </main>
    </PageShell>
  );
}

function PageShell({ children }: { children: React.ReactNode }) {
  return <div className="min-h-screen flex flex-col bg-[#F8FAFC]"><Navbar />{children}<Footer /></div>;
}

function LoadingState() {
  return <div className="flex-1 flex items-center justify-center"><div className="w-8 h-8 border-2 border-[#6AABF0] border-t-transparent rounded-full animate-spin" /></div>;
}

function CartItemImage({ item }: { item: CartItem }) {
  const sources = [
    item.product_image,
    ...(item.product_images || [])
      .slice()
      .sort((first, second) => {
        if (first.is_primary !== second.is_primary) {
          return Number(second.is_primary) - Number(first.is_primary);
        }
        return first.sort_order - second.sort_order;
      })
      .map((image) => image.image_url),
  ].filter((source, index, allSources) => Boolean(source) && allSources.indexOf(source) === index);
  const [sourceIndex, setSourceIndex] = useState(0);

  if (sources.length === 0 || sourceIndex >= sources.length) {
    return (
      <div className="w-20 h-20 rounded-xl bg-[#F1F5F9] flex items-center justify-center text-[10px] text-[#94A3B8]">
        لا توجد صورة
      </div>
    );
  }

  return (
    <img
      src={sources[sourceIndex]}
      alt={item.product_name}
      onError={() => setSourceIndex((current) => current + 1)}
      className="w-20 h-20 rounded-xl object-contain p-1 bg-[#F1F5F9]"
    />
  );
}

function EmptyState({ title, action }: { title: string; action: React.ReactNode }) {
  return <div className="flex-1 max-w-7xl w-full mx-auto px-4 py-20 text-center"><p className="font-bold text-[#1A1D2A] mb-3">{title}</p>{action}</div>;
}
