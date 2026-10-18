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
    <div className="min-h-screen flex flex-col bg-[#F8FAFC]">
      <Navbar />
      <main className="flex-1 max-w-7xl w-full mx-auto px-4 sm:px-6 lg:px-8 py-10">
        <div className="flex items-center gap-3 mb-8">
          <FavouriteIcon size={24} className="text-[#2B7BD4]" />
          <h1 className="text-2xl sm:text-3xl font-black">قائمة أمنياتي المفضلة</h1>
        </div>
        {items.length === 0 ? (
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
                    <img
                      src={product.image_url}
                      alt={product.name}
                      className="w-full h-full object-contain p-2"
                    />
                    <button type="button" className="absolute top-2 end-2 p-2 rounded-xl bg-white text-red-500" aria-label="إزالة من المفضلة">
                      <Delete01Icon size={16} />
                    </button>
                  </div>
                  <Link href={`/products/${encodeURIComponent(product.slug)}?id=${encodeURIComponent(product.product_id)}`} className="font-bold text-sm block line-clamp-2">{product.name}</Link>
                  <div className="flex items-center justify-between">
                    <strong>{formatPrice(Number(product.discount_price || product.price))}</strong>
                    <Button size="sm"><ShoppingBag01Icon size={14} />نقل للسلة</Button>
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
