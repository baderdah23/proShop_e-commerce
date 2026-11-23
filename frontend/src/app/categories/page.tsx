import Link from "next/link";
import { Navbar } from "@/shared/components/Navbar";
import { Footer } from "@/shared/components/Footer";
import { fetchOrFallback } from "@/lib/api/fetch-or-fallback";
import type { Category } from "@/shared/types";
import { ArrowRight01Icon, Folder01Icon } from "hugeicons-react";

interface CategoriesResponse {
  success: boolean;
  results: number;
  categories: Category[];
}

export default async function CategoriesPage() {
  // الباك-إند يعيد 10 تصنيفات افتراضياً، ونطلب 100 لعرض الكل
  const response = await fetchOrFallback<CategoriesResponse | null>(
    "categories?limit=100",
    null,
  );
  const categories = response?.categories ?? [];

  return (
    <div className="flex min-h-screen flex-col bg-paper">
      <Navbar />
      <main className="shell flex-1 py-12 sm:py-16">
        <header className="max-w-3xl">
          <div className="inline-flex items-center gap-2 rounded-full border border-line bg-surface px-3 py-1.5 text-[11px] font-bold text-ink">
            <Folder01Icon size={14} className="text-brand" />
            تصفح حسب الفئات والعتاد
          </div>
          <h1 className="mt-5 text-[30px] font-black leading-[1.15] tracking-[-0.03em] text-ink sm:text-[44px]">
            جميع أقسام وتصنيفات المتجر
          </h1>
          <div className="mt-5 flex flex-wrap items-center gap-x-5 gap-y-2 border-t border-line pt-5">
            <span className="text-[13px] leading-6 text-muted">
              مسارات واضحة توصلك إلى العتاد المناسب لكل مهمة.
            </span>
            <span className="flex items-center gap-2 font-latin text-[11px] font-bold tracking-[0.14em] text-brand">
              <span
                aria-hidden="true"
                className="size-1.5 rounded-full bg-signal"
              />
              {String(categories.length).padStart(2, "0")} / CATEGORIES
            </span>
          </div>
        </header>

        {categories.length === 0 ? (
          <div className="mt-10 rounded-xl border border-line bg-surface px-6 py-16 text-center">
            <span className="mx-auto mb-4 grid size-11 place-items-center rounded-xl bg-brand-soft text-brand">
              <Folder01Icon size={20} />
            </span>
            <p className="text-[14px] font-black text-ink">
              لا توجد تصنيفات لعرضها حالياً
            </p>
          </div>
        ) : (
          <div className="mt-10 grid grid-cols-2 gap-4 md:auto-rows-[210px] md:grid-cols-4">
            {categories.map((category, index) => {
              const isFeature = index === 0;
              const isWide = !isFeature && (index === 3 || index === 6);

              return (
                <Link
                  key={category.category_id}
                  href={`/products?category=${category.category_id}`}
                  className={`group relative flex min-h-[190px] flex-col justify-between overflow-hidden rounded-xl border border-line bg-surface transition-all duration-300 hover:-translate-y-1 hover:border-ink/25 hover:shadow-[0_18px_40px_rgba(10,11,10,0.08)] ${
                    isFeature ? "col-span-2 row-span-2" : ""
                  } ${isWide ? "md:col-span-2" : ""}`}
                >
                  <div className="absolute inset-0">
                    <img
                      src={category.image_url}
                      alt={
                        category.category_name_ar ||
                        category.category_name_en ||
                        ""
                      }
                      className="size-full object-cover opacity-50 grayscale transition-all duration-700 group-hover:scale-105 group-hover:opacity-60"
                    />
                    <div className="absolute inset-0 bg-gradient-to-t from-surface via-surface/80 to-surface/30" />
                  </div>

                  <div className="relative flex items-start justify-between p-5">
                    <span className="flex items-center gap-2 font-latin text-[11px] font-bold tracking-[0.18em] text-brand">
                      <span
                        aria-hidden="true"
                        className="size-1.5 rounded-full bg-signal"
                      />
                      {String(index + 1).padStart(2, "0")}
                    </span>
                    <span className="grid size-9 place-items-center rounded-lg border border-line bg-surface/90 text-ink transition-colors group-hover:border-signal group-hover:bg-signal group-hover:text-ink">
                      <ArrowRight01Icon size={16} className="rotate-180" />
                    </span>
                  </div>

                  <div className="relative mt-auto p-5 sm:p-6">
                    <span className="eyebrow block text-muted">
                      {category.category_name_en}
                    </span>
                    <h2
                      className={`mt-2 font-black leading-[1.2] tracking-tight text-ink transition-colors group-hover:text-brand ${
                        isFeature
                          ? "text-[24px] sm:text-[32px]"
                          : "text-[17px] sm:text-[20px]"
                      }`}
                    >
                      {category.category_name_ar || category.category_name_en}
                    </h2>
                    <span
                      aria-hidden="true"
                      className="mt-3 block h-0.5 w-8 rounded-full bg-signal"
                    />
                    <div className="mt-4 flex items-center justify-between gap-3 border-t border-line pt-4 text-[11px] font-bold text-muted">
                      <span>استعراض المنتجات</span>
                      <ArrowRight01Icon size={14} className="rotate-180" />
                    </div>
                  </div>
                </Link>
              );
            })}
          </div>
        )}
      </main>
      <Footer />
    </div>
  );
}
