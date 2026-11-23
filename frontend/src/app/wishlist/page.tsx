import Link from "next/link";
import { Navbar } from "@/shared/components/Navbar";
import { Footer } from "@/shared/components/Footer";
import { Button } from "@/shared/components/Button";
import { STATIC_WISHLIST } from "@/shared/data/mock-data";
import { formatPrice } from "@/shared/utils";
import { Delete01Icon, FavouriteIcon, ShoppingBag01Icon } from "hugeicons-react";

export default function WishlistPage() {
  const items = STATIC_WISHLIST;

  return (
    <div className="flex min-h-screen flex-col bg-paper">
      <Navbar />
      <main className="shell flex-1 py-10 sm:py-14">
        <div className="mb-9 flex flex-wrap items-end gap-3">
          <span className="grid size-10 shrink-0 place-items-center rounded-2xl bg-brand-soft text-brand">
            <FavouriteIcon size={20} />
          </span>
          <div>
            <span className="eyebrow flex items-center gap-2 text-brand">
              <span className="size-1.5 rounded-full bg-signal" />
              WISHLIST / 01
            </span>
            <h1 className="mt-1.5 text-[28px] font-black leading-tight tracking-[-0.03em] text-ink sm:text-[36px]">قائمة أمنياتي المفضلة</h1>
          </div>
        </div>
        {items.length === 0 ? (
          <div className="surface p-12 text-center">
            <p className="mb-3 text-lg font-black text-ink">لا توجد عناصر في المفضلة</p>
            <Link href="/products" className="text-[13px] font-bold text-brand underline decoration-brand/40 underline-offset-4 hover:text-brand-deep">تصفح المنتجات</Link>
          </div>
        ) : (
          <div className="grid grid-cols-1 gap-5 sm:grid-cols-2 lg:grid-cols-3">
            {items.map((item) => {
              const product = item.product;
              if (!product) return null;
              return (
                <div key={item.wishlist_id} className="group overflow-hidden rounded-[24px] border border-line bg-surface p-3 shadow-[0_2px_14px_rgba(10,11,10,0.05)] transition-all duration-300 hover:-translate-y-1 hover:border-brand/30 hover:shadow-[0_18px_40px_rgba(10,11,10,0.08)]">
                  <div className="relative aspect-[4/3] overflow-hidden rounded-2xl bg-paper">
                    <img
                      src={product.image_url}
                      alt={product.name}
                      className="size-full object-contain p-4 transition-transform duration-500 group-hover:scale-105"
                    />
                    <button type="button" className="absolute end-3 top-3 grid size-9 place-items-center rounded-xl border border-line bg-surface/95 text-sale shadow-sm backdrop-blur transition-colors hover:bg-sale/10" aria-label="إزالة من المفضلة">
                      <Delete01Icon size={16} />
                    </button>
                  </div>
                  <div className="space-y-3 px-1 pb-1 pt-4">
                    <Link href={`/products/${encodeURIComponent(product.slug)}?id=${encodeURIComponent(product.product_id)}`} className="block line-clamp-2 text-[14px] font-black leading-6 text-ink transition-colors hover:text-brand">{product.name}</Link>
                    <div className="flex items-center justify-between gap-3">
                      <strong className="font-latin text-xl font-black tracking-tight text-brand-deep">{formatPrice(Number(product.discount_price || product.price))}</strong>
                      <Button size="sm"><ShoppingBag01Icon size={14} />نقل للسلة</Button>
                    </div>
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
