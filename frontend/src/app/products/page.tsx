"use client";

import { useEffect, useState } from "react";
import { useSearchParams } from "next/navigation";
import { Navbar } from "@/shared/components/Navbar";
import { Footer } from "@/shared/components/Footer";
import { ProductCard } from "@/features/products/components/ProductCard";
import { isExcludedProduct } from "@/shared/utils/product-images";
import { CategoriesApi, BrandsApi, ProductsApi } from "@/lib/api-client";
import type { Brand, Category, Product } from "@/shared/types";
import { FilterIcon, Search01Icon } from "hugeicons-react";

export default function ProductsPage() {
  const searchParams = useSearchParams();
  const [products, setProducts] = useState<Product[]>([]);
  const [categories, setCategories] = useState<Category[]>([]);
  const [brands, setBrands] = useState<Brand[]>([]);
  const [selectedCategory, setSelectedCategory] = useState<number | null>(
    Number(searchParams.get("category")) || null,
  );
  const [selectedBrand, setSelectedBrand] = useState<number | null>(null);
  const [searchTerm, setSearchTerm] = useState(searchParams.get("search") || "");
  const [sortBy, setSortBy] = useState("newest");
  const [page, setPage] = useState(1);
  const [total, setTotal] = useState(0);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    Promise.all([CategoriesApi.getAll(), BrandsApi.getAll()])
      .then(([loadedCategories, loadedBrands]) => {
        setCategories(loadedCategories);
        setBrands(loadedBrands);
      })
      .catch((requestError) => {
        setError(
          requestError instanceof Error
            ? requestError.message
            : "تعذر تحميل الفلاتر.",
        );
      });
  }, []);

  useEffect(() => {
    ProductsApi.getAll({
      categoryId: selectedCategory || undefined,
      brandId: selectedBrand || undefined,
      search: searchTerm || undefined,
      sort: sortBy,
      page,
      limit: 12,
    })
      .then((result) => {
        setProducts(result.products.filter((product) => !isExcludedProduct(product)));
        setTotal(result.total);
      })
      .catch((requestError) => {
        setError(
          requestError instanceof Error
            ? requestError.message
            : "تعذر تحميل المنتجات.",
        );
      })
      .finally(() => setIsLoading(false));
  }, [page, searchTerm, selectedBrand, selectedCategory, sortBy]);

  const resetFilters = () => {
    setSelectedCategory(null);
    setSelectedBrand(null);
    setSearchTerm("");
    setPage(1);
  };

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
                  onClick={resetFilters}
                  className="text-xs text-[#EF4444] hover:underline"
                >
                  إعادة ضبط
                </button>
              </div>
              <FilterList
                title="الفئات"
                items={categories.map((category) => ({
                  id: category.category_id,
                  label: category.name_ar || category.category_name_ar || "",
                }))}
                selected={selectedCategory}
                onSelect={(id) => {
                  setSelectedCategory(id);
                  setPage(1);
                }}
              />
              <FilterList
                title="الماركات"
                items={brands.map((brand) => ({
                  id: brand.brand_id,
                  label: brand.name || "",
                }))}
                selected={selectedBrand}
                onSelect={(id) => {
                  setSelectedBrand(id);
                  setPage(1);
                }}
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
                  value={searchTerm}
                  onChange={(event) => {
                    setSearchTerm(event.target.value);
                    setPage(1);
                  }}
                  className="w-full ps-9 pe-3 py-2 bg-[#F8FAFC] border border-black/8 rounded-xl text-xs focus:outline-none focus:border-[#6AABF0]"
                />
              </div>
              <select
                value={sortBy}
                onChange={(event) => {
                  setSortBy(event.target.value);
                  setPage(1);
                }}
                className="bg-[#F8FAFC] border border-black/8 rounded-xl px-3 py-1.5 text-xs"
              >
                <option value="newest">الأحدث</option>
                <option value="price_asc">السعر: من الأقل للأعلى</option>
                <option value="price_desc">السعر: من الأعلى للأقل</option>
                <option value="oldest">الأقدم</option>
              </select>
            </div>

            {error ? (
              <div className="p-8 text-center bg-white rounded-2xl border border-red-200">
                <p className="text-sm font-bold text-red-700">{error}</p>
                <button
                  type="button"
                  onClick={() => setPage((currentPage) => currentPage)}
                  className="mt-3 text-xs text-[#2B7BD4] underline"
                >
                  حاول مرة أخرى
                </button>
              </div>
            ) : isLoading ? (
              <div className="grid grid-cols-1 sm:grid-cols-2 xl:grid-cols-3 gap-6">
                {Array.from({ length: 6 }).map((_, index) => (
                  <div
                    key={index}
                    className="h-96 rounded-2xl bg-white border border-black/5 animate-pulse"
                  />
                ))}
              </div>
            ) : products.length > 0 ? (
              <>
                <div className="grid grid-cols-1 sm:grid-cols-2 xl:grid-cols-3 gap-6">
                  {products.map((product) => (
                    <ProductCard key={product.product_id} product={product} />
                  ))}
                </div>
                <Pagination
                  page={page}
                  total={total}
                  onChange={setPage}
                />
              </>
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
  selected,
  onSelect,
}: {
  title: string;
  items: { id: number; label: string }[];
  selected: number | null;
  onSelect: (id: number | null) => void;
}) {
  return (
    <div>
      <h4 className="font-bold text-xs text-[#475569] mb-3">{title}</h4>
      <div className="space-y-2">
        <button
          type="button"
          onClick={() => onSelect(null)}
          className={`w-full text-start text-xs py-1.5 px-2.5 rounded-lg ${
            selected === null
              ? "bg-[#6AABF0]/15 text-[#1F63B3] font-bold"
              : "text-[#64748B] hover:bg-[#F8FAFC]"
          }`}
        >
          الكل
        </button>
        {items.map((item) => (
          <button
            type="button"
            key={item.id}
            onClick={() => onSelect(item.id)}
            className={`w-full text-start text-xs py-1.5 px-2.5 rounded-lg ${
              selected === item.id
                ? "bg-[#6AABF0]/15 text-[#1F63B3] font-bold"
                : "text-[#64748B] hover:bg-[#F8FAFC]"
            }`}
          >
            {item.label}
          </button>
        ))}
      </div>
    </div>
  );
}

function Pagination({
  page,
  total,
  onChange,
}: {
  page: number;
  total: number;
  onChange: (page: number) => void;
}) {
  const totalPages = Math.ceil(total / 12);
  if (totalPages <= 1) return null;

  return (
    <div className="flex items-center justify-center gap-2">
      <button
        type="button"
        disabled={page === 1}
        onClick={() => onChange(page - 1)}
        className="px-3 py-2 rounded-lg border text-xs disabled:opacity-40"
      >
        السابق
      </button>
      <span className="text-xs text-[#64748B]">
        صفحة {page} من {totalPages}
      </span>
      <button
        type="button"
        disabled={page === totalPages}
        onClick={() => onChange(page + 1)}
        className="px-3 py-2 rounded-lg border text-xs disabled:opacity-40"
      >
        التالي
      </button>
    </div>
  );
}
