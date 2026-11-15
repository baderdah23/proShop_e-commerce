"use client";

import { Cancel01Icon } from "hugeicons-react";
import { Product } from "@/shared/types";
import SpinerLoader from "./SpinerLoader";

export interface SearchDialogProps {
  isOpen: boolean;
  isLoading: boolean;
  error: string | null;
  items: Product[];
  onClose: () => void;
}

export const SearchDialog = ({
  isOpen,
  isLoading,
  error,
  items,
  onClose,
}: SearchDialogProps) => {
  if (!isOpen) {
    return null;
  }

  return (
    <div className="absolute top-full start-0 end-0 mt-2 bg-white border border-[#D9E6F2] rounded-2xl shadow-xl z-50 overflow-hidden">
      <div className="flex items-center justify-between px-3.5 py-2 border-b border-[#F1F5F9] bg-[#F8FAFC]">
        <span className="text-xs font-semibold text-[#64748B]">
          نتائج البحث
        </span>
        <button
          type="button"
          onClick={onClose}
          aria-label="إغلاق نتائج البحث"
          className="w-6 h-6 rounded-lg flex items-center justify-center text-[#94A3B8] hover:text-[#EF4444] hover:bg-[#FEE2E2] transition-colors cursor-pointer"
        >
          <Cancel01Icon size={14} />
        </button>
      </div>

      {isLoading && (
        <div className="py-8 flex flex-col items-center justify-center gap-2 text-[#64748B]">
          <SpinerLoader className="w-6 h-6 border-[#2B7BD4]" />
          <span className="text-xs font-medium">جاري البحث...</span>
        </div>
      )}

      {!isLoading && error && (
        <div className="py-6 px-4 text-center text-xs text-[#EF4444] font-medium">
          {error}
        </div>
      )}

      {!isLoading && !error && items.length === 0 && (
        <div className="py-6 px-4 text-center text-xs text-[#94A3B8] font-medium">
          لا توجد نتائج مطابقة للبحث
        </div>
      )}

      {!isLoading && !error && items.length > 0 && (
        <div className="max-h-[320px] overflow-y-auto divide-y divide-[#F1F5F9]">
          {items.map((product) => (
            <button
              key={product.product_id}
              type="button"
              onClick={() => {
                // ناطر: لا يتم الانتقال لصفحة المنتج حالياً حسب طلب المستخدم
              }}
              className="w-full flex items-center gap-3 p-3 text-start hover:bg-[#F8FAFC] transition-colors cursor-pointer group"
            >
              <div className="w-12 h-12 rounded-xl bg-[#F8FAFC] border border-[#EAF1F8] p-1 flex items-center justify-center shrink-0 overflow-hidden">
                {product.image_url ? (
                  <img
                    src={product.image_url}
                    alt={product.name}
                    className="w-full h-full object-contain"
                  />
                ) : (
                  <div className="w-full h-full bg-[#E2E8F0] rounded-lg" />
                )}
              </div>
              <div className="flex-1 min-w-0">
                <p className="text-sm font-semibold text-[#1A1D2A] truncate group-hover:text-[#2B7BD4] transition-colors">
                  {product.name}
                </p>
              </div>
            </button>
          ))}
        </div>
      )}
    </div>
  );
};

export default SearchDialog;
