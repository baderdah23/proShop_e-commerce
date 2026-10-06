"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import { Navbar } from "@/shared/components/Navbar";
import { Footer } from "@/shared/components/Footer";
import { SpotlightCard } from "@/shared/components/SpotlightCard";
import { CategoriesApi, ProductsApi } from "@/lib/api-client";
import type { Category } from "@/shared/types";
import { ArrowRight01Icon, Folder01Icon } from "hugeicons-react";
import {
  getCategoryFallbackImage,
  getCategoryImage,
} from "@/shared/utils/product-images";

export default function CategoriesPage() {
  const [categories, setCategories] = useState<Category[]>([]);
  const [counts, setCounts] = useState<Record<number, number>>({});
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    CategoriesApi.getAll()
      .then(async (loadedCategories) => {
        setCategories(loadedCategories);
        const countEntries = await Promise.all(
          loadedCategories.map(async (category) => {
            const result = await ProductsApi.getAll({
              categoryId: category.category_id,
              limit: 1,
            });
            return [category.category_id, result.total] as const;
          }),
        );
        setCounts(Object.fromEntries(countEntries));
      })
      .catch((requestError) => {
        setError(
          requestError instanceof Error
            ? requestError.message
            : "تعذر تحميل التصنيفات.",
        );
      })
      .finally(() => setIsLoading(false));
  }, []);

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

        {error ? (
          <div className="p-8 rounded-2xl bg-white border border-red-200 text-red-700 text-sm font-bold">
            {error}
          </div>
        ) : isLoading ? (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {Array.from({ length: 6 }).map((_, index) => (
              <div
                key={index}
                className="h-80 rounded-2xl bg-white animate-pulse"
              />
            ))}
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
                        src={getCategoryImage(category)}
                        alt={category.name_ar || category.category_name_ar || ""}
                        onError={(event) => {
                          event.currentTarget.src = getCategoryFallbackImage(category);
                        }}
                        className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
                      />
                      <span className="absolute top-3 start-3 px-3 py-1 rounded-lg bg-black/60 text-white text-[11px] font-bold">
                        {counts[category.category_id] || 0} منتجات
                      </span>
                    </div>
                    <div>
                      <h2 className="text-lg font-black text-slate-900 group-hover:text-blue-600">
                        {category.name_ar || category.category_name_ar}
                      </h2>
                      <p className="text-xs text-slate-400 font-medium">
                        {category.name_en || category.category_name_en}
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
