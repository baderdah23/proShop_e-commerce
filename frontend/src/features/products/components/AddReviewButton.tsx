"use client";

import React, { useRef, useState } from "react";
import { Add01Icon } from "hugeicons-react";
import { Button } from "@/shared/components/Button";
import { ReviewDialog, type ReviewFormData } from "./ReviewDialog";
import { toast } from "@/shared/components/Toast";
import { clientFetch } from "@/lib/api/client";

export function AddReviewButton({
  product_id,
  customerName,
}: {
  product_id: string;
  customerName: string;
}) {
  const [isOpen, setIsOpen] = useState(false);
  const triggerRef = useRef<HTMLButtonElement>(null);

  function closeDialog() {
    setIsOpen(false);
    triggerRef.current?.focus();
  }

  return (
    <>
      <Button
        ref={triggerRef}
        variant="outline"
        size="md"
        onClick={() => setIsOpen(true)}
        className="gap-2 cursor-pointer self-start sm:self-auto"
      >
        <Add01Icon size={16} />
        <span>أضف تقييمك للمنتج</span>
      </Button>

      {isOpen && (
        <ReviewDialog
          onSubmit={submitReview}
          onClose={closeDialog}
          product_id={product_id}
          customerName={customerName}
        />
      )}
    </>
  );
}

async function submitReview(
  product_id: string,
  customerName: string,
  data: ReviewFormData,
): Promise<void> {
  try {
    await clientFetch("reviews", {
      method: "POST",
      credentials: "include",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({ product_id, customerName, ...data }),
    });

    toast.success("تم إضافة التقييم بنجاح");
  } catch (error) {
    if (error instanceof Error) {
      toast.error(error.message);
      return;
    }

    toast.error("تعذر إرسال التقييم، حاول مرة أخرى");
  }
}
