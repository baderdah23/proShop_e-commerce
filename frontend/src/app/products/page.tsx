import { Navbar } from "@/shared/components/Navbar";
import { Footer } from "@/shared/components/Footer";
import { ProductCard } from "@/features/products/components/ProductCard";
import {
  STATIC_BRANDS,
  STATIC_CATEGORIES,
  STATIC_PRODUCTS,
} from "@/shared/data/mock-data";
import { FilterIcon, Search01Icon } from "hugeicons-react";

export default function ProductsPage() {
  const products = STATIC_PRODUCTS;
  const categories = STATIC_CATEGORIES;
  const brands = STATIC_BRANDS;

  return (
    <div className="min-h-screen flex flex-col bg-[#F8FAFC]">
      <Navbar />
      <main className="flex-1 max-w-7xl w-full mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div className="mb-8">
          <h1 className="text-2xl sm:text-3xl font-black text-[#1A1D2A] mb-2">
            كافة المنتجات والعتاد
          </h1>
          <p className="text-xs sm:text-sm text-[#64748B]">
            استكشف {products.length} منتجاً متاحاً من أفضل المصنعين.
          </p>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-4 gap-8">
          <aside className="space-y-6">
            <div className="bg-white p-5 rounded-2xl border border-black/8 shadow-sm space-y-6">
              <div className="flex items-center justify-between pb-3 border-b border-black/5">
                <span className="font-bold text-sm text-[#1A1D2A] flex items-center gap-2">
                  <FilterIcon size={16} color="#6AABF0" />
                  تصفية النتائج
                </span>
                <button
                  type="button"
                  className="text-xs text-[#EF4444] hover:underline"
                >
                  إعادة ضبط
                </button>
              </div>
              <FilterList
                title="الفئات"
                items={categories.map((category) => ({
                  id: category.category_id,
                  label: category.name_ar || category.name_en || "",
                }))}
              />
              <FilterList
                title="الماركات"
                items={brands.map((brand) => ({
                  id: brand.brand_id,
                  label: brand.name || "",
                }))}
              />
            </div>
          </aside>

          <div className="lg:col-span-3 space-y-6">
            <div className="bg-white p-4 rounded-2xl border border-black/8 shadow-sm flex flex-col sm:flex-row items-center justify-between gap-4">
              <div className="relative w-full sm:w-72">
                <Search01Icon
                  size={16}
                  color="#94A3B8"
                  className="absolute start-3 top-1/2 -translate-y-1/2"
                />
                <input
                  type="search"
                  placeholder="ابحث بالاسم أو المواصفات..."
                  className="w-full ps-9 pe-3 py-2 bg-[#F8FAFC] border border-black/8 rounded-xl text-xs focus:outline-none focus:border-[#6AABF0]"
                />
              </div>
              <select
                className="bg-[#F8FAFC] border border-black/8 rounded-xl px-3 py-1.5 text-xs"
              >
                <option value="newest">الأحدث</option>
                <option value="price_asc">السعر: من الأقل للأعلى</option>
                <option value="price_desc">السعر: من الأعلى للأقل</option>
                <option value="oldest">الأقدم</option>
              </select>
            </div>

            {products.length > 0 ? (
              <div className="grid grid-cols-1 sm:grid-cols-2 xl:grid-cols-3 gap-6">
                {products.map((product) => (
                  <ProductCard key={product.product_id} product={product} />
                ))}
              </div>
            ) : (
              <div className="p-12 text-center bg-white rounded-2xl border border-black/8">
                <p className="text-sm font-bold text-[#1A1D2A]">
                  لم نجد منتجات مطابقة
                </p>
              </div>
            )}
          </div>
        </div>
      </main>
      <Footer />
    </div>
  );
}

function FilterList({
  title,
  items,
}: {
  title: string;
  items: { id: number; label: string }[];
}) {
  return (
    <div>
      <h4 className="font-bold text-xs text-[#475569] mb-3">{title}</h4>
      <div className="space-y-2">
        <button
          type="button"
          className="w-full text-start text-xs py-1.5 px-2.5 rounded-lg bg-[#6AABF0]/15 text-[#1F63B3] font-bold"
        >
          الكل
        </button>
        {items.map((item) => (
          <button
            type="button"
            key={item.id}
            className="w-full text-start text-xs py-1.5 px-2.5 rounded-lg text-[#64748B] hover:bg-[#F8FAFC]"
          >
            {item.label}
          </button>
        ))}
      </div>
    </div>
  );
}
