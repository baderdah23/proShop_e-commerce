import React from "react";
import Link from "next/link";
import { ArrowRight01Icon, CheckmarkCircle01Icon } from "hugeicons-react";
import { Button } from "@/shared/components/Button";
import { Input } from "@/shared/components/Input";
import { STATIC_BRANDS, STATIC_CATEGORIES } from "@/shared/data/mock-data";

export default function NewProductPage() {
  const categories = STATIC_CATEGORIES;
  const brands = STATIC_BRANDS;

  return (
    <div className="max-w-4xl mx-auto space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-3">
          <Link
            href="/admin/products"
            className="grid size-9 place-items-center rounded-xl border border-line text-muted hover:bg-surface hover:text-brand transition-colors"
          >
            <ArrowRight01Icon size={18} />
          </Link>
          <div>
            <h2 className="text-2xl font-black tracking-[-0.02em] text-ink">إضافة منتج جديد</h2>
            <p className="mt-1 text-sm text-muted">
              إدخال تفاصيل المنتج والمواصفات باللغتين العربية والإنجليزية المتوافقة مع الـ Schema
            </p>
          </div>
        </div>
      </div>

      {/* Product Form */}
      <form className="space-y-6">
        {/* Basic Information */}
        <div className="bg-surface p-6 rounded-2xl border border-line shadow-[0_2px_10px_rgba(10,11,10,0.04)] space-y-4">
          <h3 className="text-sm font-black text-ink pb-3 border-b border-line">
            البيانات الأساسية للمنتج
          </h3>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <Input
              label="اسم المنتج الكامل"
              placeholder="مثال: ASUS ROG Strix GeForce RTX 4090"
              required
            />

            <Input
              label="رمز التخزين (SKU)"
              placeholder="مثال: GPU-RTX4090-OC"
              className="font-latin"
              required
            />

            <Input
              label="الرابط المخصص (Slug)"
              placeholder="asus-rog-rtx-4090-oc"
              className="font-latin"
              required
            />

            <Input
              label="رابط الصورة الأساسية (Image URL)"
              placeholder="https://images.unsplash.com/..."
              className="font-latin"
            />
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div>
              <label className="text-xs font-bold text-muted block mb-1.5">
                الفئة الأساسية (Category)
              </label>
              <select className="w-full px-4 py-2.5 rounded-xl text-sm bg-paper text-ink border border-line focus:border-brand focus:ring-4 focus:ring-brand/10 focus:outline-none transition-all">
                {categories.map((c) => (
                  <option key={c.category_id} value={c.category_id}>
                    {c.name_ar} ({c.name_en})
                  </option>
                ))}
              </select>
            </div>

            <div>
              <label className="text-xs font-bold text-muted block mb-1.5">
                الماركة (Brand)
              </label>
              <select className="w-full px-4 py-2.5 rounded-xl text-sm bg-paper text-ink border border-line focus:border-brand focus:ring-4 focus:ring-brand/10 focus:outline-none transition-all">
                {brands.map((b) => (
                  <option key={b.brand_id} value={b.brand_id}>
                    {b.name}
                  </option>
                ))}
              </select>
            </div>
          </div>
        </div>

        {/* Pricing & Inventory */}
        <div className="bg-surface p-6 rounded-2xl border border-line shadow-[0_2px_10px_rgba(10,11,10,0.04)] space-y-4">
          <h3 className="text-sm font-black text-ink pb-3 border-b border-line">
            الأسعار والمخزون والضمان
          </h3>

          <div className="grid grid-cols-1 sm:grid-cols-4 gap-4">
            <Input
              label="السعر الأصلي ($)"
              type="number"
              step="0.01"
              placeholder="1999.00"
              className="font-latin"
              required
            />

            <Input
              label="سعر الخصم ($)"
              type="number"
              step="0.01"
              placeholder="1849.00"
              className="font-latin"
              required
            />

            <Input
              label="الكمية بالمخزن"
              type="number"
              placeholder="25"
              className="font-latin"
              required
            />

            <Input
              label="مدة الضمان (أشهر)"
              type="number"
              placeholder="36"
              className="font-latin"
              required
            />
          </div>
        </div>

        {/* Multilingual Descriptions & Specs */}
        <div className="bg-surface p-6 rounded-2xl border border-line shadow-[0_2px_10px_rgba(10,11,10,0.04)] space-y-4">
          <h3 className="text-sm font-black text-ink pb-3 border-b border-line">
            الوصف والمواصفات الفنية (عربي + إنجليزي)
          </h3>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div>
              <label className="text-xs font-bold text-muted block mb-1.5">
                الوصف بالعربية (description_ar)
              </label>
              <textarea
                rows={3}
                placeholder="اكتب وصفاً مفصلاً للمنتج باللغة العربية..."
                className="w-full p-3 rounded-xl text-sm bg-paper text-ink border border-line placeholder:text-muted/70 focus:border-brand focus:ring-4 focus:ring-brand/10 focus:outline-none transition-all"
              />
            </div>

            <div>
              <label className="text-xs font-bold text-muted block mb-1.5">
                الوصف بالإنجليزية (description_en)
              </label>
              <textarea
                rows={3}
                placeholder="Product detailed description in English..."
                className="w-full p-3 rounded-xl text-sm bg-paper text-ink border border-line placeholder:text-muted/70 focus:border-brand focus:ring-4 focus:ring-brand/10 focus:outline-none transition-all"
              />
            </div>

            <div>
              <label className="text-xs font-bold text-muted block mb-1.5">
                المواصفات بالعربية (specs_ar)
              </label>
              <textarea
                rows={2}
                placeholder="ذاكرة 24GB | تردد 2600MHz | استهلاك 450W"
                className="w-full p-3 rounded-xl text-sm bg-paper text-ink border border-line placeholder:text-muted/70 focus:border-brand focus:ring-4 focus:ring-brand/10 focus:outline-none transition-all"
              />
            </div>

            <div>
              <label className="text-xs font-bold text-muted block mb-1.5">
                المواصفات بالإنجليزية (specs_en)
              </label>
              <textarea
                rows={2}
                placeholder="24GB GDDR6X | 2600MHz Boost | 450W TDP"
                className="w-full p-3 rounded-xl text-sm bg-paper text-ink border border-line placeholder:text-muted/70 focus:border-brand focus:ring-4 focus:ring-brand/10 focus:outline-none transition-all"
              />
            </div>
          </div>
        </div>

        {/* Submit Actions */}
        <div className="flex items-center justify-end gap-3 pt-2">
          <Link href="/admin/products">
            <Button variant="ghost" size="md">
              إلغاء
            </Button>
          </Link>
          <Button variant="primary" size="md" className="gap-2">
            <CheckmarkCircle01Icon size={18} />
            <span>حفظ ونشر المنتج</span>
          </Button>
        </div>
      </form>
    </div>
  );
}
