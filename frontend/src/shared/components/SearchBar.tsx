"use client";

import React, { useEffect, useState } from "react";
import { Search01Icon, Cancel01Icon } from "hugeicons-react";
import { useDebounce } from "use-debounce";
import { clientFetch } from "@/lib/api/client";
import { Product } from "@/shared/types";
import SearchDialog from "./SearchDialog";
import { toast } from "./Toast";

interface ProductsResponse {
  success: boolean;
  products: Product[];
  results?: number;
}

const SearchBar = () => {
  const [searchQuery, setSearchQuery] = useState<string>("");
  const [products, setProducts] = useState<Product[]>([]);
  const [isLoading, setIsLoading] = useState<boolean>(false);
  const [error, setError] = useState<string | null>(null);
  const [isDismissed, setIsDismissed] = useState<boolean>(false);
  const [debouncedSearch] = useDebounce(searchQuery, 500);

  const handleSearch = (e: React.ChangeEvent<HTMLInputElement>) => {
    const query = e.target.value;
    setSearchQuery(query);
    setIsDismissed(false);
    if (!query.trim()) {
      setProducts([]);
      setError(null);
      setIsLoading(false);
    }
  };

  const handleClose = () => {
    setIsDismissed(true);
  };

  const handleClear = () => {
    setSearchQuery("");
    setProducts([]);
    setError(null);
    setIsLoading(false);
    setIsDismissed(true);
  };

  const searchReq = async (query: string): Promise<Product[]> => {
    try {
      const data = await clientFetch<ProductsResponse>(
        `/products?search=${encodeURIComponent(query)}`,
      );
      return data.products || [];
    } catch (err: unknown) {
      const message =
        err instanceof Error ? err.message : "حدث خطأ أثناء البحث";

      if (
        message.toLowerCase().includes("no products found") ||
        message.includes("404")
      ) {
        return [];
      }

      toast.error(message);
      return [];
    }
  };

  useEffect(() => {
    const trimmedQuery = debouncedSearch.trim();

    if (!trimmedQuery) {
      return;
    }

    let ignore = true;

    const performSearch = async () => {
      setIsLoading(true);
      setError(null);
      try {
        const data = await searchReq(trimmedQuery);
        if (ignore) setProducts(data);
      } catch (err: unknown) {
        if (ignore) {
          setProducts([]);
          if (err instanceof Error) {
            setError(err.message);
            toast.error(err.message);
          } else {
            toast.error("حدث خطأ أثناء البحث");
          }
        }
      } finally {
        if (ignore) setIsLoading(false);
      }
    };

    performSearch();

    return () => {
      ignore = false;
    };
  }, [debouncedSearch]);

  const isOpen = Boolean(searchQuery.trim()) && !isDismissed;

  return (
    <>
      <Search01Icon
        size={18}
        color="#94A3B8"
        className="absolute start-3.5 top-1/2 -translate-y-1/2 pointer-events-none"
      />
      <input
        type="text"
        name="search"
        autoComplete="off"
        value={searchQuery}
        onChange={handleSearch}
        onFocus={() => {
          if (searchQuery.trim()) {
            setIsDismissed(false);
          }
        }}
        placeholder="ابحث عن معالجات، كروت شاشة، تجميعات..."
        className="w-full ps-10 pe-10 py-3 bg-white border border-[#D9E6F2] rounded-2xl text-sm focus:border-[#4F8FD8] focus:ring-4 focus:ring-[#4F8FD8]/10 transition-all placeholder:text-[#94A3B8]"
      />

      {searchQuery && (
        <button
          type="button"
          onClick={handleClear}
          aria-label="مسح البحث وإغلاق النتائج"
          className="absolute end-3.5 top-1/2 -translate-y-1/2 w-6 h-6 rounded-lg flex items-center justify-center text-[#94A3B8] hover:text-[#EF4444] hover:bg-[#FEE2E2] transition-colors cursor-pointer"
        >
          <Cancel01Icon size={14} />
        </button>
      )}

      <SearchDialog
        isOpen={isOpen}
        isLoading={isLoading}
        error={error}
        items={products}
        onClose={handleClose}
      />
    </>
  );
};

export default SearchBar;
