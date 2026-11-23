import Link from "next/link";
import { Navbar } from "@/shared/components/Navbar";
import { Footer } from "@/shared/components/Footer";
import { ProductCard } from "@/features/products/components/ProductCard";
import { fetchOrFallback } from "@/lib/api/fetch-or-fallback";
import type { Brand, Category, Product } from "@/shared/types";
import {
  ArrowRight01Icon,
  FilterIcon,
  GridViewIcon,
  Search01Icon,
} from "hugeicons-react";

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
  const search = "";
  const sort = "";
  const filter = "";

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
    <div className="flex min-h-screen flex-col bg-paper">
      <Navbar />
      <main className="shell flex-1 py-10 sm:py-12">
        <header className="mb-9 flex flex-col gap-6 border-b border-line pb-8 sm:flex-row sm:items-end sm:justify-between">
          <div>
            <div className="mb-4 flex items-center gap-2.5">
              <span className="size-1.5 rounded-full bg-signal" />
              <span className="eyebrow text-brand">Catalogue / 01</span>
            </div>
            <h1 className="text-[30px] font-black leading-[1.15] tracking-[-0.03em] text-ink sm:text-[44px]">
              كافة المنتجات والعتاد
            </h1>
            <p className="mt-3 text-[13px] leading-6 text-muted">
              استكشف{" "}
              <span className="font-latin font-bold text-ink">{total}</span>{" "}
              منتجاً متاحاً من أفضل المصنعين.
            </p>
          </div>
          <div className="flex shrink-0 items-center gap-3 rounded-xl border border-line bg-surface px-4 py-3">
            <span className="grid size-10 place-items-center rounded-lg bg-ink text-white">
              <GridViewIcon size={18} />
            </span>
            <div>
              <span className="eyebrow block text-muted">PRO STORE</span>
              <span className="font-latin mt-1 block text-[12px] font-black text-ink">
                CURATED GEAR / 2026
              </span>
            </div>
          </div>
        </header>

        <div className="grid grid-cols-1 gap-6 lg:grid-cols-[260px_minmax(0,1fr)] lg:gap-8">
          <aside className="lg:sticky lg:top-6 lg:h-fit">
            <div className="relative overflow-hidden rounded-xl border border-line bg-surface p-5 shadow-[0_6px_24px_rgba(10,11,10,0.05)]">
              <span
                aria-hidden="true"
                className="absolute inset-x-0 top-0 h-0.5 bg-signal"
              />
              <div className="flex items-center justify-between border-b border-line pb-4">
                <span className="flex items-center gap-2.5 text-[13px] font-black text-ink">
                  <span className="grid size-8 place-items-center rounded-lg bg-ink text-white">
                    <FilterIcon size={15} />
                  </span>
                  تصفية النتائج
                </span>
                <button
                  type="button"
                  className="text-[11px] font-bold text-muted transition-colors hover:text-brand"
                >
                  إعادة ضبط
                </button>
              </div>
              <div className="mt-5 space-y-6">
                <FilterList
                  index="01"
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
                  index="02"
                  title="الماركات"
                  items={brands.map((brand) => ({
                    id: brand.brand_id,
                    label: brand.name || "",
                  }))}
                />
              </div>
            </div>
          </aside>

          <div className="min-w-0 space-y-6">
            <div className="flex flex-col gap-3 rounded-xl border border-line bg-surface p-3 shadow-[0_6px_24px_rgba(10,11,10,0.05)] sm:flex-row sm:items-center sm:justify-between">
              <div className="relative w-full sm:w-80">
                <Search01Icon
                  size={16}
                  className="absolute start-3 top-1/2 -translate-y-1/2 text-muted"
                />
                <input
                  type="search"
                  placeholder="ابحث بالاسم أو المواصفات..."
                  className="h-11 w-full rounded-xl border border-line bg-paper ps-9 pe-3 text-[12px] text-ink outline-none transition-all placeholder:text-muted/70 focus:border-brand focus:bg-surface focus:ring-4 focus:ring-brand/10"
                />
              </div>
              <select className="h-11 rounded-xl border border-line bg-paper px-3 text-[12px] font-bold text-ink outline-none transition-colors focus:border-brand focus:bg-surface">
                <option value="newest">الأحدث</option>
                <option value="price_asc">السعر: من الأقل للأعلى</option>
                <option value="price_desc">السعر: من الأعلى للأقل</option>
                <option value="oldest">الأقدم</option>
              </select>
            </div>

            {products.length > 0 ? (
              <div className="grid grid-cols-1 gap-5 sm:grid-cols-2 xl:grid-cols-3">
                {products.map((product) => (
                  <ProductCard key={product.product_id} product={product} />
                ))}
              </div>
            ) : (
              <div className="rounded-xl border border-line bg-surface px-6 py-16 text-center">
                <span className="mx-auto mb-4 grid size-11 place-items-center rounded-xl bg-brand-soft text-brand">
                  <Search01Icon size={20} />
                </span>
                <p className="text-[14px] font-black text-ink">
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
      className="flex flex-wrap items-center justify-center gap-2 pt-6"
    >
      {currentPage > 1 ? (
        <Link
          href={buildPageHref(currentPage - 1, params)}
          className="inline-flex h-10 items-center gap-1.5 rounded-lg border border-line bg-surface px-3 text-[12px] font-bold text-muted shadow-sm transition-colors hover:border-brand hover:text-brand"
        >
          <ArrowRight01Icon size={14} />
          السابق
        </Link>
      ) : (
        <span
          aria-disabled="true"
          className="inline-flex h-10 items-center gap-1.5 rounded-lg border border-line bg-paper px-3 text-[12px] font-bold text-muted/50"
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
            className="inline-flex h-10 min-w-10 items-center justify-center rounded-lg bg-ink px-2 font-latin text-[12px] font-bold text-white"
          >
            {pageNumber}
          </span>
        ) : (
          <Link
            key={pageNumber}
            href={buildPageHref(pageNumber, params)}
            className="inline-flex h-10 min-w-10 items-center justify-center rounded-lg border border-line bg-surface px-2 font-latin text-[12px] font-bold text-muted shadow-sm transition-colors hover:border-brand hover:text-brand"
          >
            {pageNumber}
          </Link>
        ),
      )}

      {currentPage < totalPages ? (
        <Link
          href={buildPageHref(currentPage + 1, params)}
          className="inline-flex h-10 items-center gap-1.5 rounded-lg border border-line bg-surface px-3 text-[12px] font-bold text-muted shadow-sm transition-colors hover:border-brand hover:text-brand"
        >
          التالي
          <ArrowRight01Icon size={14} className="rotate-180" />
        </Link>
      ) : (
        <span
          aria-disabled="true"
          className="inline-flex h-10 items-center gap-1.5 rounded-lg border border-line bg-paper px-3 text-[12px] font-bold text-muted/50"
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
  index,
}: {
  title: string;
  items: { id: number; label: string }[];
  index?: string;
}) {
  return (
    <div>
      <div className="mb-3 flex items-center gap-2.5">
        <span className="font-latin text-[10px] font-bold tracking-[0.16em] text-brand">
          {index}
        </span>
        <h4 className="text-[12px] font-black text-ink">{title}</h4>
        <span className="h-px flex-1 bg-line" />
        <span aria-hidden="true" className="size-1.5 rounded-full bg-signal" />
      </div>
      <div className="space-y-1.5">
        <button
          type="button"
          className="flex w-full items-center justify-between rounded-lg bg-ink px-3 py-2 text-start text-[12px] font-bold text-white"
        >
          <span>الكل</span>
          <span className="size-1.5 rounded-full bg-signal" />
        </button>
        {items.map((item) => (
          <button
            type="button"
            key={item.id}
            className="flex w-full items-center justify-between rounded-lg px-3 py-2 text-start text-[12px] font-medium text-muted transition-colors hover:bg-brand-soft hover:text-ink"
          >
            {item.label}
          </button>
        ))}
      </div>
    </div>
  );
}
