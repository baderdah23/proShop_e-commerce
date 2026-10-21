import Link from "next/link";
import { Navbar } from "@/shared/components/Navbar";
import { Footer } from "@/shared/components/Footer";
import { ProductCard } from "@/features/products/components/ProductCard";
import { serverFetch } from "@/lib/api/server";
import type { Brand, Category, Product } from "@/shared/types";
import { ArrowRight01Icon, FilterIcon, Search01Icon } from "hugeicons-react";

const PAGE_SIZE = 18;

interface ProductsResponse {
  success: boolean;
  results: number;
  total?: number;
  page?: number;
  products: Product[];
}

type SearchParams = Record<string, string | string[] | undefined>;

export default async function ProductsPage({
  searchParams,
}: {
  searchParams: Promise<SearchParams>;
}) {
  const params = await searchParams;
  const rawPage = Array.isArray(params.page) ? params.page[0] : params.page;
  const page = Math.max(1, Number.parseInt(rawPage ?? "1", 10) || 1);

  const [productsRes, categoriesRes, brandsRes] = await Promise.all([
    fetchOrFallback<ProductsResponse | null>(
      `products?limit=${PAGE_SIZE}&page=${page}`,
      null,
    ),
    fetchOrFallback<{ categories: Category[] } | null>("categories", null),
    fetchOrFallback<{ brands: Brand[] } | null>("brands", null),
  ]);

  const products = productsRes?.products ?? [];
  const total = productsRes?.total ?? products.length;
  const totalPages = Math.max(1, Math.ceil(total / PAGE_SIZE));
  const categories = categoriesRes?.categories ?? [];
  const brands = brandsRes?.brands ?? [];

  return (
    <div className="min-h-screen flex flex-col bg-[#F8FAFC]">
      <Navbar />
      <main className="flex-1 max-w-7xl w-full mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div className="mb-8">
          <h1 className="text-2xl sm:text-3xl font-black text-[#1A1D2A] mb-2">
            كافة المنتجات والعتاد
          </h1>
          <p className="text-xs sm:text-sm text-[#64748B]">
            استكشف {total} منتجاً متاحاً من أفضل المصنعين.
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
                  label:
                    category.category_name_ar ||
                    category.category_name_en ||
                    "",
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
              <select className="bg-[#F8FAFC] border border-black/8 rounded-xl px-3 py-1.5 text-xs">
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

            <Pagination
              currentPage={page}
              totalPages={totalPages}
              params={params}
            />
          </div>
        </div>
      </main>
      <Footer />
    </div>
  );
}

async function fetchOrFallback<T>(path: string, fallback: T): Promise<T> {
  try {
    return await serverFetch<T>(path);
  } catch (error) {
    console.error(`Failed to fetch ${path}:`, error);
    return fallback;
  }
}

function buildPageHref(pageNumber: number, params: SearchParams): string {
  const query = new URLSearchParams();
  Object.entries(params).forEach(([key, value]) => {
    if (typeof value === "string") query.set(key, value);
  });
  query.set("page", String(pageNumber));
  return `/products?${query.toString()}`;
}

function visiblePages(currentPage: number, totalPages: number): number[] {
  const maxVisible = 5;
  const start = Math.max(
    1,
    Math.min(currentPage - 2, totalPages - maxVisible + 1),
  );
  const count = Math.min(maxVisible, totalPages);
  return Array.from({ length: count }, (_, index) => start + index);
}

function Pagination({
  currentPage,
  totalPages,
  params,
}: {
  currentPage: number;
  totalPages: number;
  params: SearchParams;
}) {
  if (totalPages <= 1) return null;

  return (
    <nav
      aria-label="التنقل بين صفحات المنتجات"
      className="flex items-center justify-center gap-1.5 pt-4"
    >
      {currentPage > 1 ? (
        <Link
          href={buildPageHref(currentPage - 1, params)}
          className="inline-flex items-center gap-1.5 h-9 px-3 rounded-xl bg-white border border-black/8 shadow-sm text-xs font-bold text-[#475569] hover:border-[#6AABF0] hover:text-[#1F63B3] transition-colors"
        >
          <ArrowRight01Icon size={14} />
          السابق
        </Link>
      ) : (
        <span
          aria-disabled="true"
          className="inline-flex items-center gap-1.5 h-9 px-3 rounded-xl bg-white border border-black/8 text-xs font-bold text-[#CBD5E1] opacity-60"
        >
          <ArrowRight01Icon size={14} />
          السابق
        </span>
      )}

      {visiblePages(currentPage, totalPages).map((pageNumber) =>
        pageNumber === currentPage ? (
          <span
            key={pageNumber}
            aria-current="page"
            className="inline-flex items-center justify-center min-w-9 h-9 px-2 rounded-xl bg-[#2B7BD4] text-white text-xs font-bold"
          >
            {pageNumber}
          </span>
        ) : (
          <Link
            key={pageNumber}
            href={buildPageHref(pageNumber, params)}
            className="inline-flex items-center justify-center min-w-9 h-9 px-2 rounded-xl bg-white border border-black/8 shadow-sm text-xs font-bold text-[#475569] hover:border-[#6AABF0] hover:text-[#1F63B3] transition-colors"
          >
            {pageNumber}
          </Link>
        ),
      )}

      {currentPage < totalPages ? (
        <Link
          href={buildPageHref(currentPage + 1, params)}
          className="inline-flex items-center gap-1.5 h-9 px-3 rounded-xl bg-white border border-black/8 shadow-sm text-xs font-bold text-[#475569] hover:border-[#6AABF0] hover:text-[#1F63B3] transition-colors"
        >
          التالي
          <ArrowRight01Icon size={14} className="rotate-180" />
        </Link>
      ) : (
        <span
          aria-disabled="true"
          className="inline-flex items-center gap-1.5 h-9 px-3 rounded-xl bg-white border border-black/8 text-xs font-bold text-[#CBD5E1] opacity-60"
        >
          التالي
          <ArrowRight01Icon size={14} className="rotate-180" />
        </span>
      )}
    </nav>
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
