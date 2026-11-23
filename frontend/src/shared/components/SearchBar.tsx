"use client";

import React, { useEffect, useRef, useState } from "react";
import { Search01Icon, Cancel01Icon } from "hugeicons-react";
import { useDebounce } from "use-debounce";
import { clientFetch } from "@/lib/api/client";
import { Product } from "@/shared/types";
import SearchDialog, { SearchDialogRef } from "./SearchDialog";
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

  const inputRef = useRef<HTMLInputElement>(null);
  const searchDialogRef = useRef<SearchDialogRef>(null);

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
    inputRef.current?.focus();
  };

  const handleKeyDown = (e: React.KeyboardEvent<HTMLInputElement>) => {
    if (e.key === "ArrowDown") {
      if (isOpen && products.length > 0) {
        e.preventDefault();
        searchDialogRef.current?.focusFirstItem();
      }
    } else if (e.key === "ArrowUp") {
      if (isOpen && products.length > 0) {
        e.preventDefault();
        searchDialogRef.current?.focusLastItem();
      }
    } else if (e.key === "Escape") {
      handleClose();
    }
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
        className="pointer-events-none absolute start-4 top-1/2 -translate-y-1/2 text-muted"
      />
      <input
        ref={inputRef}
        type="text"
        name="search"
        role="combobox"
        aria-expanded={isOpen}
        aria-haspopup="listbox"
        aria-autocomplete="list"
        aria-controls="search-results-listbox"
        autoComplete="off"
        value={searchQuery}
        onChange={handleSearch}
        onKeyDown={handleKeyDown}
        onFocus={() => {
          if (searchQuery.trim()) {
            setIsDismissed(false);
          }
        }}
        placeholder="ابحث عن معالجات، كروت شاشة، تجميعات..."
        className="h-11 w-full rounded-xl border border-line bg-surface ps-11 pe-10 text-[13px] text-ink outline-none transition-all placeholder:text-muted/70 hover:border-ink/20 focus:border-brand focus:ring-4 focus:ring-brand/10"
      />

      {searchQuery && (
        <button
          type="button"
          onClick={handleClear}
          aria-label="مسح البحث وإغلاق النتائج"
          tabIndex={-1}
          className="absolute end-3.5 top-1/2 grid size-6 -translate-y-1/2 place-items-center rounded-lg text-muted transition-colors hover:bg-sale/10 hover:text-sale focus:outline-none"
        >
          <Cancel01Icon size={14} />
        </button>
      )}

      <SearchDialog
        ref={searchDialogRef}
        isOpen={isOpen}
        isLoading={isLoading}
        error={error}
        items={products}
        onClose={handleClose}
        onReturnFocusToInput={() => inputRef.current?.focus()}
      />
    </>
  );
};

export default SearchBar;
