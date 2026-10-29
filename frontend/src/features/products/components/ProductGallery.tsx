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
      <div className="aspect-square rounded-2xl bg-[#F8FAFC] border border-black/5 flex items-center justify-center">
        <span className="text-xs font-bold text-[#94A3B8]">
          لا توجد صور لهذا المنتج
        </span>
      </div>
    );
  }

  const selectedImage = images[selectedIndex];

  return (
    <div className="space-y-4">
      <div className="relative aspect-square rounded-2xl overflow-hidden bg-[#F8FAFC] border border-black/5 flex items-center justify-center">
        <img
          src={selectedImage.image_url}
          alt={`${productName} - صورة ${selectedIndex + 1}`}
          width={720}
          height={720}
          fetchPriority="high"
          className="w-full h-full object-contain object-center p-3"
        />
        {badge}
      </div>

      <div
        className="grid grid-cols-3 gap-3"
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
              className={`relative aspect-square overflow-hidden rounded-xl border-2 bg-[#F8FAFC] transition-all cursor-pointer ${
                isSelected
                  ? "border-[#2B7BD4] ring-4 ring-[#2B7BD4]/15"
                  : "border-transparent hover:border-[#AACFF0]"
              }`}
            >
              <img
                src={image.image_url}
                alt=""
                width={180}
                height={180}
                loading={index === 0 ? "eager" : "lazy"}
                className="h-full w-full object-contain p-2"
              />
            </button>
          );
        })}
      </div>
    </div>
  );
}
