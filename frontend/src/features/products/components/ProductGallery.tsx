"use client";

import React, { useState } from "react";
import type { ProductImage } from "@/shared/types";

interface ProductGalleryProps {
  images: ProductImage[];
  productName: string;
  badge?: React.ReactNode;
}

export function ProductGallery({
  images,
  productName,
  badge,
}: ProductGalleryProps) {
  const [selectedIndex, setSelectedIndex] = useState(0);

  if (images.length === 0) {
    return (
      <div className="grid aspect-square place-items-center rounded-xl border border-dashed border-line bg-paper">
        <span className="text-[12px] font-bold text-muted">
          لا توجد صور لهذا المنتج
        </span>
      </div>
    );
  }

  const selectedImage = images[selectedIndex];

  return (
    <div className="space-y-3.5">
      <div className="relative flex aspect-square items-center justify-center overflow-hidden rounded-xl border border-line bg-paper p-5">
        <img
          src={selectedImage.image_url}
          alt={`${productName} - صورة ${selectedIndex + 1}`}
          width={720}
          height={720}
          fetchPriority="high"
          className="size-full object-contain object-center"
        />
        {badge}
        <span className="font-latin absolute bottom-4 end-4 flex items-center gap-2 rounded-lg border border-line bg-surface/90 px-2.5 py-1 text-[10px] font-bold tracking-[0.14em] text-muted shadow-sm backdrop-blur-sm">
          <span
            aria-hidden="true"
            className="size-1.5 rounded-full bg-signal"
          />
          {String(selectedIndex + 1).padStart(2, "0")} /{" "}
          {String(images.length).padStart(2, "0")}
        </span>
      </div>

      <div
        className="grid grid-cols-4 gap-2.5 sm:grid-cols-5"
        role="list"
        aria-label="صور المنتج"
      >
        {images.map((image, index) => {
          const isSelected = index === selectedIndex;

          return (
            <button
              key={image.image_id}
              type="button"
              role="listitem"
              aria-label={`عرض صورة المنتج ${index + 1}`}
              aria-current={isSelected}
              onClick={() => setSelectedIndex(index)}
              className={`relative aspect-square cursor-pointer overflow-hidden rounded-lg border-2 bg-paper transition-all duration-200 ${
                isSelected
                  ? "border-brand ring-1 ring-signal"
                  : "border-transparent hover:border-ink/30"
              }`}
            >
              <img
                src={image.image_url}
                alt=""
                width={180}
                height={180}
                loading={index === 0 ? "eager" : "lazy"}
                className="size-full object-contain p-2"
              />
            </button>
          );
        })}
      </div>
    </div>
  );
}
