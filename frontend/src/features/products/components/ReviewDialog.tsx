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
        className="absolute inset-0 bg-ink/50 backdrop-blur-sm"
      />

      <div
        ref={panelRef}
        role="dialog"
        aria-modal="true"
        aria-labelledby="review-dialog-title"
        tabIndex={-1}
        className="relative w-full max-w-lg rounded-2xl border border-line bg-surface p-6 shadow-[0_30px_80px_rgba(10,11,10,0.22)] outline-none focus-visible:border-brand/40 focus-visible:ring-4 focus-visible:ring-brand/15 sm:p-8"
      >
        <div className="mb-6 flex items-start justify-between gap-4 border-b border-line pb-5">
          <div>
            <span className="eyebrow flex items-center gap-2 text-brand">
              <span
                aria-hidden="true"
                className="size-1.5 rounded-full bg-signal"
              />
              CUSTOMER VOICE / 01
            </span>
            <h2
              id="review-dialog-title"
              className="mt-2.5 text-[21px] font-black leading-tight tracking-tight text-ink"
            >
              أضف تقييمك للمنتج
            </h2>
            <p className="mt-1.5 text-[12px] leading-6 text-muted">
              رأيك يساعد الآخرين على اختيار العتاد المناسب.
            </p>
          </div>
          <button
            type="button"
            onClick={onClose}
            aria-label="إغلاق النافذة"
            className="grid size-9 shrink-0 place-items-center rounded-lg border border-line text-muted transition-colors hover:border-brand hover:bg-brand-soft hover:text-ink"
          >
            <Cancel01Icon size={18} />
          </button>
        </div>

        <form onSubmit={handleSubmit} noValidate className="space-y-6">
          <fieldset>
            <legend className="mb-3 text-[12px] font-bold text-ink">
              تقييمك <span className="text-sale">*</span>
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
                    className="cursor-pointer rounded-lg p-1.5 transition-transform hover:scale-110 focus-visible:ring-4 focus-visible:ring-brand/15"
                  >
                    <StarIcon
                      size={28}
                      className={
                        isFilled ? "fill-brand text-brand" : "text-line"
                      }
                    />
                  </button>
                );
              })}
              {rating > 0 && (
                <span className="font-latin ms-2 text-[12px] font-bold text-muted">
                  {rating} من 5
                </span>
              )}
            </div>
          </fieldset>

          <div>
            <label
              htmlFor="review-comment"
              className="mb-2.5 block text-[12px] font-bold text-ink"
            >
              تعليقك <span className="text-sale">*</span>
            </label>
            <textarea
              id="review-comment"
              value={comment}
              onChange={(event) => setComment(event.target.value)}
              maxLength={500}
              rows={4}
              required
              placeholder="شاركنا تجربتك مع هذا المنتج..."
              className="w-full resize-none rounded-xl border border-line bg-paper px-4 py-3 text-[13px] leading-7 text-ink outline-none transition-all placeholder:text-muted/70 focus:border-brand focus:bg-surface focus:ring-4 focus:ring-brand/10"
            />
            <span className="font-latin mt-1 block text-end text-[11px] text-muted">
              {comment.length}/500
            </span>
          </div>

          {error && (
            <p
              role="alert"
              className="rounded-xl border border-sale/20 bg-sale/5 px-3 py-2 text-[12px] font-bold text-sale"
            >
              {error}
            </p>
          )}

          <div className="flex items-center gap-3 border-t border-line pt-5">
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
