"use client";

import React, { useEffect, useRef, useState } from "react";
import { StarIcon, Cancel01Icon } from "hugeicons-react";
import { Button } from "@/shared/components/Button";

export interface ReviewFormData {
  rating: number;
  comment: string;
}

interface ReviewDialogProps {
  onSubmit: (
    product_id: string,
    customerName: string,
    data: ReviewFormData,
  ) => void | Promise<void>;
  onClose: () => void;
  product_id: string;
  customerName: string;
}

export function ReviewDialog({
  onSubmit,
  onClose,
  product_id,
  customerName,
}: ReviewDialogProps) {
  const [rating, setRating] = useState(0);
  const [hoveredRating, setHoveredRating] = useState(0);
  const [comment, setComment] = useState("");
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const panelRef = useRef<HTMLDivElement>(null);

  const displayedRating = hoveredRating || rating;
  const canSubmit = rating > 0 && comment.trim().length > 0 && !isSubmitting;

  useEffect(() => {
    function handleKeyDown(event: KeyboardEvent) {
      if (event.key === "Escape") onClose();
    }

    document.addEventListener("keydown", handleKeyDown);
    document.body.style.overflow = "hidden";
    panelRef.current?.focus();

    return () => {
      document.removeEventListener("keydown", handleKeyDown);
      document.body.style.overflow = "";
    };
  }, [onClose]);

  async function handleSubmit(event: React.FormEvent<HTMLFormElement>) {
    event.preventDefault();
    if (!canSubmit) return;

    setError(null);
    setIsSubmitting(true);

    try {
      await onSubmit(product_id, customerName, {
        rating,
        comment: comment.trim(),
      });
      onClose();
    } catch {
      setError("تعذر إرسال التقييم، حاول مرة أخرى");
    } finally {
      setIsSubmitting(false);
    }
  }

  return (
    <div className="fixed inset-0 z-[90] flex items-center justify-center p-4">
      <div
        aria-hidden="true"
        onClick={onClose}
        className="absolute inset-0 bg-black/50 backdrop-blur-sm"
      />

      <div
        ref={panelRef}
        role="dialog"
        aria-modal="true"
        aria-labelledby="review-dialog-title"
        tabIndex={-1}
        className="relative w-full max-w-md bg-white rounded-3xl p-6 shadow-2xl outline-none"
      >
        <div className="flex items-center justify-between mb-5">
          <h2
            id="review-dialog-title"
            className="text-lg font-black text-[#1A1D2A]"
          >
            أضف تقييمك للمنتج
          </h2>
          <button
            type="button"
            onClick={onClose}
            aria-label="إغلاق النافذة"
            className="w-8 h-8 rounded-lg flex items-center justify-center text-[#94A3B8] hover:text-[#1A1D2A] hover:bg-[#F1F5F9] transition-colors"
          >
            <Cancel01Icon size={18} />
          </button>
        </div>

        <form onSubmit={handleSubmit} noValidate className="space-y-5">
          <fieldset>
            <legend className="text-xs font-bold text-[#475569] mb-2">
              تقييمك <span className="text-[#EF4444]">*</span>
            </legend>
            <div
              className="flex items-center gap-1"
              onMouseLeave={() => setHoveredRating(0)}
            >
              {Array.from({ length: 5 }).map((_, index) => {
                const starValue = index + 1;
                const isFilled = starValue <= displayedRating;

                return (
                  <button
                    key={starValue}
                    type="button"
                    aria-label={`تقييم ${starValue} من 5`}
                    onClick={() => setRating(starValue)}
                    onMouseEnter={() => setHoveredRating(starValue)}
                    className="p-1 cursor-pointer"
                  >
                    <StarIcon
                      size={28}
                      color={isFilled ? "#F59E0B" : "#CBD5E1"}
                      className={isFilled ? "fill-[#F59E0B]" : ""}
                    />
                  </button>
                );
              })}
              {rating > 0 && (
                <span className="ms-2 text-xs font-bold text-[#64748B]">
                  {rating} من 5
                </span>
              )}
            </div>
          </fieldset>

          <div>
            <label
              htmlFor="review-comment"
              className="block text-xs font-bold text-[#475569] mb-2"
            >
              تعليقك <span className="text-[#EF4444]">*</span>
            </label>
            <textarea
              id="review-comment"
              value={comment}
              onChange={(event) => setComment(event.target.value)}
              maxLength={500}
              rows={4}
              required
              placeholder="شاركنا تجربتك مع هذا المنتج..."
              className="w-full px-3 py-2.5 bg-[#F8FAFC] border border-black/10 rounded-xl text-sm leading-relaxed resize-none focus:outline-none focus:border-[#6AABF0]"
            />
            <span className="block mt-1 text-[11px] text-[#94A3B8] text-end">
              {comment.length}/500
            </span>
          </div>

          {error && (
            <p role="alert" className="text-xs font-bold text-[#DC2626]">
              {error}
            </p>
          )}

          <div className="flex items-center gap-3 pt-2">
            <Button
              type="button"
              variant="ghost"
              size="md"
              onClick={onClose}
              className="flex-1"
            >
              إلغاء
            </Button>
            <Button
              type="submit"
              variant="primary"
              size="md"
              disabled={!canSubmit}
              isLoading={isSubmitting}
              className="flex-1"
            >
              إرسال التقييم
            </Button>
          </div>
        </form>
      </div>
    </div>
  );
}
