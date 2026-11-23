import React from "react";
import { Folder01Icon, Tag01Icon, Add01Icon, Delete01Icon } from "hugeicons-react";
import { Button } from "@/shared/components/Button";
import { Input } from "@/shared/components/Input";
import { STATIC_BRANDS, STATIC_CATEGORIES } from "@/shared/data/mock-data";

export default function AdminCategoriesBrandsPage() {
  const categories = STATIC_CATEGORIES;
  const brands = STATIC_BRANDS;

  return (
    <div className="space-y-8">
      <div>
        <h2 className="text-2xl font-black tracking-[-0.02em] text-ink">الفئات والماركات</h2>
        <p className="mt-1 text-sm text-muted">
          إدارة تصنيفات المنتجات والشركات المصنعة
        </p>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
        {/* Categories Section */}
        <div className="bg-surface p-6 rounded-2xl border border-line shadow-[0_2px_10px_rgba(10,11,10,0.04)] space-y-4">
          <div className="flex items-center gap-2 pb-3 border-b border-line">
            <span className="grid size-9 place-items-center rounded-xl bg-brand-soft text-brand">
              <Folder01Icon size={20} />
            </span>
            <h3 className="font-black text-base text-ink">فئات المنتجات (Categories)</h3>
          </div>

          <form className="space-y-3 p-4 bg-paper rounded-xl border border-line">
            <div className="grid grid-cols-2 gap-3">
              <Input
                label="الاسم بالعربي"
                placeholder="شاشات الألعاب"
                required
              />
              <Input
                label="الاسم بالإنجليزي"
                placeholder="Gaming Monitors"
                required
              />
            </div>
            <Input
              label="الرابط (Slug)"
              placeholder="gaming-monitors"
            />
            <Button variant="primary" size="sm" className="w-full gap-2">
              <Add01Icon size={16} />
              <span>إضافة فئة جديدة</span>
            </Button>
          </form>

          <div className="divide-y divide-line">
            {categories.map((c) => (
              <div key={c.category_id} className="py-3 flex items-center justify-between gap-3">
                <div>
                  <h4 className="font-bold text-sm text-ink">{c.name_ar}</h4>
                  <span className="font-latin text-[11px] text-muted">{c.name_en} • slug: {c.slug}</span>
                </div>
                <button
                  className="grid size-8 shrink-0 place-items-center rounded-lg border border-sale/20 text-sale hover:bg-sale/10 transition-colors cursor-pointer"
                >
                  <Delete01Icon size={14} />
                </button>
              </div>
            ))}
          </div>
        </div>

        {/* Brands Section */}
        <div className="bg-surface p-6 rounded-2xl border border-line shadow-[0_2px_10px_rgba(10,11,10,0.04)] space-y-4">
          <div className="flex items-center gap-2 pb-3 border-b border-line">
            <span className="grid size-9 place-items-center rounded-xl bg-brand-soft text-brand">
              <Tag01Icon size={20} />
            </span>
            <h3 className="font-black text-base text-ink">الماركات والشركات (Brands)</h3>
          </div>

          <form className="space-y-3 p-4 bg-paper rounded-xl border border-line">
            <Input
              label="اسم الماركة"
              placeholder="Razer / Gigabyte"
              required
            />
            <Input
              label="الرابط (Slug)"
              placeholder="razer"
            />
            <Button variant="secondary" size="sm" className="w-full gap-2 hover:bg-brand hover:text-white">
              <Add01Icon size={16} />
              <span>إضافة ماركة جديدة</span>
            </Button>
          </form>

          <div className="divide-y divide-line">
            {brands.map((b) => (
              <div key={b.brand_id} className="py-3 flex items-center justify-between gap-3">
                <div>
                  <h4 className="font-bold text-sm text-ink">{b.name}</h4>
                  <span className="font-latin text-[11px] text-muted">slug: {b.slug}</span>
                </div>
                <button
                  className="grid size-8 shrink-0 place-items-center rounded-lg border border-sale/20 text-sale hover:bg-sale/10 transition-colors cursor-pointer"
                >
                  <Delete01Icon size={14} />
                </button>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}
