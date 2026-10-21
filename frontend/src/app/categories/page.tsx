import Link from "next/link";
import { Navbar } from "@/shared/components/Navbar";
import { Footer } from "@/shared/components/Footer";
import { SpotlightCard } from "@/shared/components/SpotlightCard";
import { serverFetch } from "@/lib/api/server";
import type { Category } from "@/shared/types";
import { ArrowRight01Icon, Folder01Icon } from "hugeicons-react";

interface CategoriesResponse {
  success: boolean;
  results: number;
  categories: Category[];
}

export default async function CategoriesPage() {
  let categories: Category[] = [];

  try {
    const response = await serverFetch<CategoriesResponse>("categories");
    categories = response.categories ?? [];
  } catch (error) {
    console.error("Failed to fetch categories:", error);
  }

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

        {categories.length === 0 ? (
          <div className="p-12 text-center bg-white rounded-2xl border border-black/8">
            <p className="text-sm font-bold text-[#1A1D2A]">
              لا توجد تصنيفات لعرضها حالياً
            </p>
          </div>
        ) : (
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
                        alt={
                          category.category_name_ar ||
                          category.category_name_en ||
                          ""
                        }
                        className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
                      />
                    </div>
                    <div>
                      <h2 className="text-lg font-black text-slate-900 group-hover:text-blue-600">
                        {category.category_name_ar || category.category_name_en}
                      </h2>
                      <p className="text-xs text-slate-400 font-medium">
                        {category.category_name_en}
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
        )}
      </main>
      <Footer />
    </div>
  );
}
