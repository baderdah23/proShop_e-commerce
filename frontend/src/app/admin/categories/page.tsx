"use client";

import React, { useEffect, useState } from "react";
import { Folder01Icon, Tag01Icon, Add01Icon, Delete01Icon } from "hugeicons-react";
import { Button } from "@/shared/components/Button";
import { Input } from "@/shared/components/Input";
import { Category, Brand } from "@/shared/types";
import { toast } from "sonner";
import { BrandsApi, CategoriesApi } from "@/lib/api-client";

export default function AdminCategoriesBrandsPage() {
  const [categories, setCategories] = useState<Category[]>([]);
  const [brands, setBrands] = useState<Brand[]>([]);

  useEffect(() => {
    Promise.all([CategoriesApi.getAll(), BrandsApi.getAll()])
      .then(([loadedCategories, loadedBrands]) => {
        setCategories(loadedCategories);
        setBrands(loadedBrands);
      })
      .catch((error) => toast.error(error instanceof Error ? error.message : "تعذر تحميل البيانات."));
  }, []);

  const [newCatNameAr, setNewCatNameAr] = useState("");
  const [newCatNameEn, setNewCatNameEn] = useState("");
  const [newCatSlug, setNewCatSlug] = useState("");

  const [newBrandName, setNewBrandName] = useState("");
  const [newBrandSlug, setNewBrandSlug] = useState("");

  const handleAddCategory = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!newCatNameAr || !newCatNameEn) return;
    try {
      const category = await CategoriesApi.create({
        name_ar: newCatNameAr,
        name_en: newCatNameEn,
        image_url: "",
      });
      setCategories((current) => [...current, category]);
      setNewCatNameAr("");
      setNewCatNameEn("");
      setNewCatSlug("");
      toast.success("تم إضافة الفئة بنجاح.");
    } catch (error) {
      toast.error(error instanceof Error ? error.message : "تعذر إضافة الفئة.");
    }
  };

  const handleAddBrand = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!newBrandName) return;
    try {
      const brand = await BrandsApi.create({ name: newBrandName, logo_url: "" });
      setBrands((current) => [...current, brand]);
      setNewBrandName("");
      setNewBrandSlug("");
      toast.success("تم إضافة الماركة بنجاح.");
    } catch (error) {
      toast.error(error instanceof Error ? error.message : "تعذر إضافة الماركة.");
    }
  };

  return (
    <div className="space-y-8">
      <div>
        <h2 className="text-xl font-black text-[#1A1D2A]">الفئات والماركات</h2>
        <p className="text-xs text-[#64748B] mt-0.5">
          إدارة تصنيفات المنتجات والشركات المصنعة المتوافقة مع جداول categories و brands
        </p>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
        {/* Categories Section */}
        <div className="bg-white p-6 rounded-2xl border border-black/8 shadow-sm space-y-4">
          <div className="flex items-center gap-2 pb-3 border-b border-black/5">
            <Folder01Icon size={20} color="#6AABF0" />
            <h3 className="font-bold text-base text-[#1A1D2A]">فئات المنتجات (Categories)</h3>
          </div>

          <form onSubmit={handleAddCategory} className="space-y-3 p-4 bg-[#F8FAFC] rounded-xl border border-black/5">
            <div className="grid grid-cols-2 gap-3">
              <Input
                label="الاسم بالعربي"
                placeholder="شاشات الألعاب"
                required
                value={newCatNameAr}
                onChange={(e) => setNewCatNameAr(e.target.value)}
              />
              <Input
                label="الاسم بالإنجليزي"
                placeholder="Gaming Monitors"
                required
                value={newCatNameEn}
                onChange={(e) => setNewCatNameEn(e.target.value)}
              />
            </div>
            <Input
              label="الرابط (Slug)"
              placeholder="gaming-monitors"
              value={newCatSlug}
              onChange={(e) => setNewCatSlug(e.target.value)}
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
                  onClick={async () => {
                    try {
                      await CategoriesApi.remove(c.category_id);
                      setCategories((current) => current.filter((cat) => cat.category_id !== c.category_id));
                    } catch (error) {
                      toast.error(error instanceof Error ? error.message : "تعذر حذف الفئة.");
                    }
                  }}
                  className="p-1.5 rounded-lg border border-black/8 text-[#EF4444] hover:bg-[#EF4444]/10"
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

          <form onSubmit={handleAddBrand} className="space-y-3 p-4 bg-[#F8FAFC] rounded-xl border border-black/5">
            <Input
              label="اسم الماركة"
              placeholder="Razer / Gigabyte"
              required
              value={newBrandName}
              onChange={(e) => setNewBrandName(e.target.value)}
            />
            <Input
              label="الرابط (Slug)"
              placeholder="razer"
              value={newBrandSlug}
              onChange={(e) => setNewBrandSlug(e.target.value)}
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
                  onClick={async () => {
                    try {
                      await BrandsApi.remove(b.brand_id);
                      setBrands((current) => current.filter((brand) => brand.brand_id !== b.brand_id));
                    } catch (error) {
                      toast.error(error instanceof Error ? error.message : "تعذر حذف الماركة.");
                    }
                  }}
                  className="p-1.5 rounded-lg border border-black/8 text-[#EF4444] hover:bg-[#EF4444]/10"
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
