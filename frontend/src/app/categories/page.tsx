import Link from "next/link";
import { Navbar } from "@/shared/components/Navbar";
import { Footer } from "@/shared/components/Footer";
import { SpotlightCard } from "@/shared/components/SpotlightCard";
import { STATIC_CATEGORIES, STATIC_PRODUCTS } from "@/shared/data/mock-data";
import { ArrowRight01Icon, Folder01Icon } from "hugeicons-react";

export default function CategoriesPage() {
  const categories = STATIC_CATEGORIES;
  const counts: Record<number, number> = {};
  categories.forEach((cat) => {
    counts[cat.category_id] = STATIC_PRODUCTS.filter(
      (p) => p.category_id === cat.category_id,
    ).length;
  });

  return (
    <div className="min-h-screen flex flex-col bg-[#F8FAFC]">
      <Navbar />
      <main className="flex-1 max-w-7xl w-full mx-auto px-4 sm:px-6 lg:px-8 py-10 space-y-10">
        <div className="text-start space-y-2">
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-blue-50 text-blue-700 text-xs font-bold border border-blue-100">
            <Folder01Icon size={14} />
            تصفح حسب الفئات والعتاد
          </div>
          <h1 className="text-2xl sm:text-3xl font-black text-slate-900">
            جميع أقسام وتصنيفات المتجر
          </h1>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {categories.map((category) => (
            <Link
              key={category.category_id}
              href={`/products?category=${category.category_id}`}
            >
              <SpotlightCard className="p-6 h-full flex flex-col justify-between group">
                <div className="space-y-4">
                  <div className="relative aspect-video rounded-2xl overflow-hidden bg-slate-100">
                    <img
                      src={category.image_url}
                      alt={category.name_ar || category.name_en || ""}
                      className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
                    />
                    <span className="absolute top-3 start-3 px-3 py-1 rounded-lg bg-black/60 text-white text-[11px] font-bold">
                      {counts[category.category_id] || 0} منتجات
                    </span>
                  </div>
                  <div>
                    <h2 className="text-lg font-black text-slate-900 group-hover:text-blue-600">
                      {category.name_ar || category.name_en}
                    </h2>
                    <p className="text-xs text-slate-400 font-medium">
                      {category.name_en}
                    </p>
                  </div>
                </div>
                <div className="pt-4 mt-4 border-t border-slate-100 flex items-center justify-between text-xs font-bold text-blue-600">
                  <span>استعراض المنتجات</span>
                  <ArrowRight01Icon size={16} className="rotate-180" />
                </div>
              </SpotlightCard>
            </Link>
          ))}
        </div>
      </main>
      <Footer />
    </div>
  );
}
