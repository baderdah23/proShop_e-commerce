"use client";

import React, { forwardRef, useImperativeHandle, useRef } from "react";
import { Cancel01Icon } from "hugeicons-react";
import type { Product } from "@/shared/types";
import SpinerLoader from "./SpinerLoader";
import { useRouter } from "next/navigation";

export interface SearchDialogRef {
  focusFirstItem: () => void;
  focusLastItem: () => void;
}

export interface SearchDialogProps {
  isOpen: boolean;
  isLoading: boolean;
  error: string | null;
  items: Product[];
  onClose: () => void;
  onReturnFocusToInput?: () => void;
}

export const SearchDialog = forwardRef<SearchDialogRef, SearchDialogProps>(
  ({ isOpen, isLoading, error, items, onClose, onReturnFocusToInput }, ref) => {
    const itemRefs = useRef<(HTMLButtonElement | null)[]>([]);
    const router = useRouter();

    useImperativeHandle(ref, () => ({
      focusFirstItem: () => {
        if (items.length > 0) {
          itemRefs.current[0]?.focus();
          itemRefs.current[0]?.scrollIntoView({ block: "nearest" });
        }
      },
      focusLastItem: () => {
        if (items.length > 0) {
          const lastIndex = items.length - 1;
          itemRefs.current[lastIndex]?.focus();
          itemRefs.current[lastIndex]?.scrollIntoView({ block: "nearest" });
        }
      },
    }));

    if (!isOpen) {
      return null;
    }

    const handleClick = (slug: string, id: string) => {
      router.push(`/products/${slug}?id=${id}`);
      onClose();
    };

    const handleItemKeyDown = (
      e: React.KeyboardEvent<HTMLButtonElement>,
      index: number,
    ) => {
      if (e.key === "ArrowDown") {
        e.preventDefault();
        const nextIndex = index + 1 < items.length ? index + 1 : 0;
        itemRefs.current[nextIndex]?.focus();
        itemRefs.current[nextIndex]?.scrollIntoView({ block: "nearest" });
      } else if (e.key === "ArrowUp") {
        e.preventDefault();
        if (index === 0) {
          onReturnFocusToInput?.();
        } else {
          const prevIndex = index - 1;
          itemRefs.current[prevIndex]?.focus();
          itemRefs.current[prevIndex]?.scrollIntoView({ block: "nearest" });
        }
      } else if (e.key === "Escape") {
        e.preventDefault();
        onClose();
        onReturnFocusToInput?.();
      }
    };

    return (
      <div className="absolute top-full start-0 end-0 z-50 mt-2 overflow-hidden rounded-2xl border border-line bg-surface shadow-[0_24px_60px_rgba(16,22,30,0.16)]">
        <div className="flex items-center justify-between border-b border-line bg-surface px-4 py-2.5">
          <span className="eyebrow text-muted">نتائج البحث</span>
          <button
            type="button"
            onClick={onClose}
            aria-label="إغلاق نتائج البحث"
            tabIndex={-1}
            className="grid size-6 place-items-center rounded-lg text-muted transition-colors hover:bg-paper hover:text-ink focus:outline-none"
          >
            <Cancel01Icon size={14} />
          </button>
        </div>

        {isLoading && (
          <div className="flex flex-col items-center justify-center gap-2 py-8 text-muted">
            <SpinerLoader className="size-6 border-brand" />
            <span className="text-xs font-medium">جاري البحث...</span>
          </div>
        )}

        {!isLoading && error && (
          <div className="px-4 py-6 text-center text-xs font-semibold text-sale">
            {error}
          </div>
        )}

        {!isLoading && !error && items.length === 0 && (
          <div className="px-4 py-6 text-center text-xs font-medium text-muted">
            لا توجد نتائج مطابقة للبحث
          </div>
        )}

        {!isLoading && !error && items.length > 0 && (
          <div
            id="search-results-listbox"
            role="listbox"
            aria-label="نتائج البحث"
            className="max-h-[320px] divide-y divide-line overflow-y-auto"
          >
            {items.map((product, index) => (
              <button
                key={product.product_id}
                ref={(el) => {
                  itemRefs.current[index] = el;
                }}
                type="button"
                role="option"
                aria-selected={false}
                onClick={() => handleClick(product.slug, product.product_id)}
                onKeyDown={(e) => handleItemKeyDown(e, index)}
                className="group flex w-full items-center gap-3 p-3 text-start transition-colors hover:bg-paper focus:bg-paper focus:outline-none focus-visible:ring-2 focus-visible:ring-brand/40 focus-visible:ring-inset"
              >
                <div className="grid size-12 shrink-0 place-items-center overflow-hidden rounded-xl border border-line bg-paper p-1">
                  {product.image_url ? (
                    <img
                      src={product.image_url}
                      alt={product.name}
                      className="size-full object-contain"
                    />
                  ) : (
                    <div className="size-full rounded-lg bg-line" />
                  )}
                </div>
                <div className="min-w-0 flex-1">
                  <p className="truncate text-[13px] font-bold text-ink transition-colors group-hover:text-brand group-focus:text-brand">
                    {product.name}
                  </p>
                </div>
              </button>
            ))}
          </div>
        )}
      </div>
    );
  },
);

SearchDialog.displayName = "SearchDialog";

export default SearchDialog;
