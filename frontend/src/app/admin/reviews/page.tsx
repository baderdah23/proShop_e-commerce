import React from "react";
import { StarIcon, Delete01Icon } from "hugeicons-react";
import { formatDate } from "@/shared/utils";
import { STATIC_REVIEWS } from "@/shared/data/mock-data";

export default function AdminReviewsPage() {
  const reviews = STATIC_REVIEWS;

  return (
    <div className="space-y-6">
      <div>
        <h2 className="text-2xl font-black tracking-[-0.02em] text-ink">مراجعة التقييمات والآراء</h2>
        <p className="mt-1 text-sm text-muted">
          التحكم بتقييمات العملاء وحذف التعليقات غير اللائقة المتطابقة مع موديل reviews
        </p>
      </div>

      <div className="bg-surface rounded-2xl border border-line shadow-[0_2px_10px_rgba(10,11,10,0.04)] overflow-hidden">
        <div className="divide-y divide-line">
          {reviews.map((rev) => (
            <div key={rev.review_id} className="p-6 flex flex-col sm:flex-row items-start justify-between gap-4">
              <div className="space-y-2">
                <div className="flex items-center gap-3">
                  <span className="font-bold text-sm text-ink">{rev.customer_name}</span>
                  <div className="flex items-center text-ink">
                    {Array.from({ length: rev.rating }).map((_, i) => (
                      <StarIcon key={i} size={14} className="fill-ink" />
                    ))}
                  </div>
                  <span className="font-latin text-xs text-muted">{formatDate(rev.review_date)}</span>
                </div>
                <p className="text-sm leading-relaxed text-muted max-w-2xl bg-paper p-4 rounded-xl border border-line">
                  &ldquo;{rev.comment}&rdquo;
                </p>
                <div className="font-latin text-[11px] font-semibold text-brand">معرف المنتج: {rev.product_id}</div>
              </div>

              <div className="flex items-center gap-2 self-end sm:self-center">
                <button
                  type="button"
                  className="flex items-center gap-1.5 px-3 py-2 rounded-xl border border-sale/20 text-sale hover:bg-sale/10 text-xs font-semibold transition-colors"
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
