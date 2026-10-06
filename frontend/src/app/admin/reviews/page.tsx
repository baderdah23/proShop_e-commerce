"use client";

import React, { useEffect, useState } from "react";
import { StarIcon, Delete01Icon } from "hugeicons-react";
import { formatDate } from "@/shared/utils";
import { Review } from "@/shared/types";
import { toast } from "sonner";
import { ReviewsApi } from "@/lib/api-client";

export default function AdminReviewsPage() {
  const [reviews, setReviews] = useState<Review[]>([]);

  useEffect(() => {
    ReviewsApi.getAll()
      .then(setReviews)
      .catch((error) => toast.error(error instanceof Error ? error.message : "تعذر تحميل التقييمات."));
  }, []);

  const handleDelete = async (id: string) => {
    try {
      await ReviewsApi.remove(id);
      setReviews((current) => current.filter((r) => r.review_id !== id));
      toast.success("تم حذف التقييم بنجاح.");
    } catch (error) {
      toast.error(error instanceof Error ? error.message : "تعذر حذف التقييم.");
    }
  };

  return (
    <div className="space-y-6">
      <div>
        <h2 className="text-xl font-black text-[#1A1D2A]">مراجعة التقييمات والآراء</h2>
        <p className="text-xs text-[#64748B] mt-0.5">
          التحكم بتقييمات العملاء وحذف التعليقات غير اللائقة المتطابقة مع موديل reviews
        </p>
      </div>

      <div className="bg-white rounded-2xl border border-black/8 shadow-sm overflow-hidden">
        <div className="divide-y divide-black/5">
          {reviews.map((rev) => (
            <div key={rev.review_id} className="p-6 flex flex-col sm:flex-row items-start justify-between gap-4">
              <div className="space-y-2">
                <div className="flex items-center gap-3">
                  <span className="font-bold text-sm text-[#1A1D2A]">{rev.customer_name}</span>
                  <div className="flex items-center text-[#F59E0B]">
                    {Array.from({ length: rev.rating }).map((_, i) => (
                      <StarIcon key={i} size={14} color="#F59E0B" className="fill-[#F59E0B]" />
                    ))}
                  </div>
                  <span className="text-xs text-[#94A3B8]">{formatDate(rev.review_date)}</span>
                </div>
                <p className="text-xs text-[#475569] leading-relaxed max-w-2xl bg-[#F8FAFC] p-3 rounded-xl border border-black/5">
                  &ldquo;{rev.comment}&rdquo;
                </p>
                <div className="text-[11px] text-[#6AABF0] font-mono">
                  معرف المنتج: {rev.product_id}
                </div>
              </div>

              <div className="flex items-center gap-2 self-end sm:self-center">
                <button
                  onClick={() => handleDelete(rev.review_id)}
                  className="px-3 py-1.5 rounded-xl border border-[#EF4444]/20 text-[#EF4444] hover:bg-[#EF4444]/10 text-xs font-semibold transition-colors flex items-center gap-1.5"
                >
                  <Delete01Icon size={14} />
                  <span>حذف التقييم</span>
                </button>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
