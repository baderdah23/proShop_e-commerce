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
        <h2 className="text-xl font-black text-[#1A1D2A]">الفئات والماركات</h2>
        <p className="text-xs text-[#64748B] mt-0.5">
          إدارة تصنيفات المنتجات والشركات المصنعة
        </p>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
        {/* Categories Section */}
        <div className="bg-white p-6 rounded-2xl border border-black/8 shadow-sm space-y-4">
          <div className="flex items-center gap-2 pb-3 border-b border-black/5">
            <Folder01Icon size={20} color="#6AABF0" />
            <h3 className="font-bold text-base text-[#1A1D2A]">فئات المنتجات (Categories)</h3>
          </div>

          <form className="space-y-3 p-4 bg-[#F8FAFC] rounded-xl border border-black/5">
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

          <div className="divide-y divide-black/5">
            {categories.map((c) => (
              <div key={c.category_id} className="py-3 flex items-center justify-between">
                <div>
                  <h4 className="font-bold text-xs text-[#1A1D2A]">{c.name_ar}</h4>
                  <span className="text-[11px] text-[#64748B]">{c.name_en} • slug: {c.slug}</span>
                </div>
                <button
                  className="p-1.5 rounded-lg border border-black/8 text-[#EF4444] hover:bg-[#EF4444]/10 cursor-pointer"
                >
                  <Delete01Icon size={14} />
                </button>
              </div>
            ))}
          </div>
        </div>

        {/* Brands Section */}
        <div className="bg-white p-6 rounded-2xl border border-black/8 shadow-sm space-y-4">
          <div className="flex items-center gap-2 pb-3 border-b border-black/5">
            <Tag01Icon size={20} color="#2B7BD4" />
            <h3 className="font-bold text-base text-[#1A1D2A]">الماركات والشركات (Brands)</h3>
          </div>

          <form className="space-y-3 p-4 bg-[#F8FAFC] rounded-xl border border-black/5">
            <Input
              label="اسم الماركة"
              placeholder="Razer / Gigabyte"
              required
            />
            <Input
              label="الرابط (Slug)"
              placeholder="razer"
            />
            <Button variant="secondary" size="sm" className="w-full gap-2">
              <Add01Icon size={16} />
              <span>إضافة ماركة جديدة</span>
            </Button>
          </form>

          <div className="divide-y divide-black/5">
            {brands.map((b) => (
              <div key={b.brand_id} className="py-3 flex items-center justify-between">
                <div>
                  <h4 className="font-bold text-xs text-[#1A1D2A]">{b.name}</h4>
                  <span className="text-[11px] text-[#64748B]">slug: {b.slug}</span>
                </div>
                <button
                  className="p-1.5 rounded-lg border border-black/8 text-[#EF4444] hover:bg-[#EF4444]/10 cursor-pointer"
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
