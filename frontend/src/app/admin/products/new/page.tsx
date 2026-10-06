"use client";

import React, { useEffect, useState } from "react";
import Link from "next/link";
import { ArrowRight01Icon, CheckmarkCircle01Icon } from "hugeicons-react";
import { Button } from "@/shared/components/Button";
import { Input } from "@/shared/components/Input";
import { Brand, Category } from "@/shared/types";
import { BrandsApi, CategoriesApi, ProductsApi } from "@/lib/api-client";
import { toast } from "sonner";
import { useRouter } from "next/navigation";

export default function NewProductPage() {
  const router = useRouter();
  const [loading, setLoading] = useState(false);
  const [categories, setCategories] = useState<Category[]>([]);
  const [brands, setBrands] = useState<Brand[]>([]);

  const [formData, setFormData] = useState({
    name: "",
    sku: "",
    slug: "",
    price: "",
    discount_price: "",
    category_id: "1",
    brand_id: "1",
    stock_quantity: "20",
    warranty_months: "36",
    is_featured: false,
    description_ar: "",
    description_en: "",
    specs_ar: "",
    specs_en: "",
    image_url: "",
  });

  useEffect(() => {
    Promise.all([CategoriesApi.getAll(), BrandsApi.getAll()])
      .then(([loadedCategories, loadedBrands]) => {
        setCategories(loadedCategories);
        setBrands(loadedBrands);
        setFormData((current) => ({
          ...current,
          category_id: String(loadedCategories[0]?.category_id || ""),
          brand_id: String(loadedBrands[0]?.brand_id || ""),
        }));
      })
      .catch((error) => toast.error(error instanceof Error ? error.message : "تعذر تحميل الفئات والماركات."));
  }, []);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);

    try {
      await ProductsApi.create({
        ...formData,
        category_id: Number(formData.category_id),
        brand_id: Number(formData.brand_id),
        price: Number(formData.price),
        discount_price: Number(formData.discount_price),
        stock_quantity: Number(formData.stock_quantity),
        warranty_months: Number(formData.warranty_months),
        images: formData.image_url
          ? [{ image_url: formData.image_url, is_primary: true, sort_order: 0 }]
          : [],
      } as Partial<import("@/shared/types").Product>);
      setLoading(false);
      toast.success("تم إنشاء المنتج بنجاح وتجهيزه للعرض.");
      router.push("/admin/products");
    } catch (error) {
      setLoading(false);
      toast.error(error instanceof Error ? error.message : "تعذر إنشاء المنتج.");
    }
  };

  return (
    <div className="max-w-4xl mx-auto space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-3">
          <Link
            href="/admin/products"
            className="w-9 h-9 rounded-xl border border-black/8 flex items-center justify-center text-[#64748B] hover:bg-white"
          >
            <ArrowRight01Icon size={18} />
          </Link>
          <div>
            <h2 className="text-xl font-black text-[#1A1D2A]">إضافة منتج جديد</h2>
            <p className="text-xs text-[#64748B]">
              إدخال تفاصيل المنتج والمواصفات باللغتين العربية والإنجليزية المتوافقة مع الـ Schema
            </p>
          </div>
        </div>
      </div>

      {/* Product Form */}
      <form onSubmit={handleSubmit} className="space-y-6">
        {/* Basic Information */}
        <div className="bg-white p-6 rounded-2xl border border-black/8 shadow-sm space-y-4">
          <h3 className="text-sm font-bold text-[#1A1D2A] pb-3 border-b border-black/5">
            البيانات الأساسية للمنتج
          </h3>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <Input
              label="اسم المنتج الكامل"
              placeholder="مثال: ASUS ROG Strix GeForce RTX 4090"
              required
              value={formData.name}
              onChange={(e) => setFormData({ ...formData, name: e.target.value })}
            />

            <Input
              label="رمز التخزين (SKU)"
              placeholder="مثال: GPU-RTX4090-OC"
              required
              value={formData.sku}
              onChange={(e) => setFormData({ ...formData, sku: e.target.value })}
            />

            <Input
              label="الرابط المخصص (Slug)"
              placeholder="asus-rog-rtx-4090-oc"
              required
              value={formData.slug}
              onChange={(e) => setFormData({ ...formData, slug: e.target.value })}
            />

            <Input
              label="رابط الصورة الأساسية (Image URL)"
              placeholder="https://images.unsplash.com/..."
              value={formData.image_url}
              onChange={(e) => setFormData({ ...formData, image_url: e.target.value })}
            />
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div>
              <label className="text-xs font-semibold text-[#475569] block mb-1.5">
                الفئة الأساسية (Category)
              </label>
              <select
                className="w-full px-4 py-2.5 rounded-xl text-sm bg-white border border-black/10 focus:border-[#6AABF0] focus:outline-none"
                value={formData.category_id}
                onChange={(e) => setFormData({ ...formData, category_id: e.target.value })}
              >
                {categories.map((c) => (
                  <option key={c.category_id} value={c.category_id}>
                    {c.name_ar} ({c.name_en})
                  </option>
                ))}
              </select>
            </div>

            <div>
              <label className="text-xs font-semibold text-[#475569] block mb-1.5">
                الماركة (Brand)
              </label>
              <select
                className="w-full px-4 py-2.5 rounded-xl text-sm bg-white border border-black/10 focus:border-[#6AABF0] focus:outline-none"
                value={formData.brand_id}
                onChange={(e) => setFormData({ ...formData, brand_id: e.target.value })}
              >
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
        <div className="bg-white p-6 rounded-2xl border border-black/8 shadow-sm space-y-4">
          <h3 className="text-sm font-bold text-[#1A1D2A] pb-3 border-b border-black/5">
            الأسعار والمخزون والضمان
          </h3>

          <div className="grid grid-cols-1 sm:grid-cols-4 gap-4">
            <Input
              label="السعر الأصلي ($)"
              type="number"
              step="0.01"
              placeholder="1999.00"
              required
              value={formData.price}
              onChange={(e) => setFormData({ ...formData, price: e.target.value })}
            />

            <Input
              label="سعر الخصم ($)"
              type="number"
              step="0.01"
              placeholder="1849.00"
              required
              value={formData.discount_price}
              onChange={(e) => setFormData({ ...formData, discount_price: e.target.value })}
            />

            <Input
              label="الكمية بالمخزن"
              type="number"
              placeholder="25"
              required
              value={formData.stock_quantity}
              onChange={(e) => setFormData({ ...formData, stock_quantity: e.target.value })}
            />

            <Input
              label="مدة الضمان (أشهر)"
              type="number"
              placeholder="36"
              required
              value={formData.warranty_months}
              onChange={(e) => setFormData({ ...formData, warranty_months: e.target.value })}
            />
          </div>
        </div>

        {/* Multilingual Descriptions & Specs */}
        <div className="bg-white p-6 rounded-2xl border border-black/8 shadow-sm space-y-4">
          <h3 className="text-sm font-bold text-[#1A1D2A] pb-3 border-b border-black/5">
            الوصف والمواصفات الفنية (عربي + إنجليزي)
          </h3>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div>
              <label className="text-xs font-semibold text-[#475569] block mb-1.5">
                الوصف بالعربية (description_ar)
              </label>
              <textarea
                rows={3}
                placeholder="اكتب وصفاً مفصلاً للمنتج باللغة العربية..."
                className="w-full p-3 rounded-xl text-sm border border-black/10 focus:border-[#6AABF0] focus:outline-none"
                value={formData.description_ar}
                onChange={(e) => setFormData({ ...formData, description_ar: e.target.value })}
              />
            </div>

            <div>
              <label className="text-xs font-semibold text-[#475569] block mb-1.5">
                الوصف بالإنجليزية (description_en)
              </label>
              <textarea
                rows={3}
                placeholder="Product detailed description in English..."
                className="w-full p-3 rounded-xl text-sm border border-black/10 focus:border-[#6AABF0] focus:outline-none"
                value={formData.description_en}
                onChange={(e) => setFormData({ ...formData, description_en: e.target.value })}
              />
            </div>

            <div>
              <label className="text-xs font-semibold text-[#475569] block mb-1.5">
                المواصفات بالعربية (specs_ar)
              </label>
              <textarea
                rows={2}
                placeholder="ذاكرة 24GB | تردد 2600MHz | استهلاك 450W"
                className="w-full p-3 rounded-xl text-sm border border-black/10 focus:border-[#6AABF0] focus:outline-none"
                value={formData.specs_ar}
                onChange={(e) => setFormData({ ...formData, specs_ar: e.target.value })}
              />
            </div>

            <div>
              <label className="text-xs font-semibold text-[#475569] block mb-1.5">
                المواصفات بالإنجليزية (specs_en)
              </label>
              <textarea
                rows={2}
                placeholder="24GB GDDR6X | 2600MHz Boost | 450W TDP"
                className="w-full p-3 rounded-xl text-sm border border-black/10 focus:border-[#6AABF0] focus:outline-none"
                value={formData.specs_en}
                onChange={(e) => setFormData({ ...formData, specs_en: e.target.value })}
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
          <Button variant="primary" size="md" isLoading={loading} className="gap-2">
            <CheckmarkCircle01Icon size={18} />
            <span>حفظ ونشر المنتج</span>
          </Button>
        </div>
      </form>
    </div>
  );
}
