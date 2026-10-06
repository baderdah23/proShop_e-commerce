"use client";

import React, { useEffect, useState } from "react";
import Link from "next/link";
import {
  Add01Icon,
  Search01Icon,
  Edit01Icon,
  Delete01Icon,
  Store01Icon,
} from "hugeicons-react";
import { Button } from "@/shared/components/Button";
import { Badge } from "@/shared/components/Badge";
import { formatPrice } from "@/shared/utils";
import { Product } from "@/shared/types";
import { ProductsApi } from "@/lib/api-client";
import { toast } from "sonner";

export default function AdminProductsPage() {
  const [products, setProducts] = useState<Product[]>([]);
  const [searchTerm, setSearchTerm] = useState("");
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    ProductsApi.getAll({ limit: 100 })
      .then((result) => setProducts(result.products))
      .catch((error) =>
        toast.error(error instanceof Error ? error.message : "تعذر تحميل المنتجات."),
      )
      .finally(() => setIsLoading(false));
  }, []);

  const handleDelete = async (id: string, name: string) => {
    if (confirm(`هل أنت متأكد من رغبتك في حذف المنتج: "${name}"؟`)) {
      try {
        await ProductsApi.remove(id);
        setProducts((current) => current.filter((p) => p.product_id !== id));
        toast.success("تم حذف المنتج بنجاح.");
      } catch (error) {
        toast.error(error instanceof Error ? error.message : "تعذر حذف المنتج.");
      }
    }
  };

  const filteredProducts = products.filter(
    (p) =>
      p.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
      p.sku.toLowerCase().includes(searchTerm.toLowerCase())
  );

  return (
    <div className="space-y-6">
      {/* Page Header */}
      <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
        <div>
          <h2 className="text-xl font-black text-[#1A1D2A]">إدارة المنتجات</h2>
          <p className="text-xs text-[#64748B] mt-0.5">
            عرض وتعديل وحذف منتجات المتجر والمخزون، مهيأ لمطابقة جدول products في الباك إند
          </p>
        </div>

        <Link href="/admin/products/new">
          <Button variant="primary" size="sm" className="gap-2">
            <Add01Icon size={16} />
            <span>إضافة منتج جديد</span>
          </Button>
        </Link>
      </div>

      {/* Filter and Search Bar */}
      <div className="bg-white p-4 rounded-2xl border border-black/8 shadow-sm flex flex-col sm:flex-row items-center justify-between gap-4">
        <div className="relative w-full sm:w-80">
          <Search01Icon
            size={18}
            color="#94A3B8"
            className="absolute start-3.5 top-1/2 -translate-y-1/2 pointer-events-none"
          />
          <input
            type="text"
            placeholder="ابحث بالاسم أو رمز SKU..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="w-full ps-10 pe-4 py-2 bg-[#F8FAFC] border border-black/8 rounded-xl text-xs focus:outline-none focus:border-[#6AABF0] focus:ring-2 focus:ring-[#6AABF0]/15"
          />
        </div>

        <div className="flex items-center gap-2 self-end sm:self-auto text-xs text-[#64748B]">
          <span>إجمالي المنتجات المعروضة: </span>
          <span className="font-bold text-[#1A1D2A]">{filteredProducts.length}</span>
        </div>
      </div>

      {/* Products Table */}
      <div className="bg-white rounded-2xl border border-black/8 shadow-sm overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full text-start text-xs">
            <thead className="bg-[#F8FAFC] border-b border-black/8 text-[#64748B] font-semibold">
              <tr>
                <th className="py-3 px-4 text-start">المنتج</th>
                <th className="py-3 px-4 text-start">رمز SKU</th>
                <th className="py-3 px-4 text-start">الفئة / الماركة</th>
                <th className="py-3 px-4 text-start">السعر الحالي</th>
                <th className="py-3 px-4 text-start">المخزون</th>
                <th className="py-3 px-4 text-start">الحالة</th>
                <th className="py-3 px-4 text-end">الإجراءات</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-black/5">
              {isLoading ? <tr><td colSpan={7} className="py-12 text-center">جارٍ التحميل...</td></tr> : filteredProducts.map((product) => (
                <tr key={product.product_id} className="hover:bg-[#F8FAFC]/80 transition-colors">
                  <td className="py-3.5 px-4">
                    <div className="flex items-center gap-3">
                      <div className="w-10 h-10 rounded-lg overflow-hidden bg-[#F1F5F9] shrink-0 border border-black/5">
                        {product.image_url ? (
                          <img
                            src={product.image_url}
                            alt={product.name}
                            className="w-full h-full object-cover"
                          />
                        ) : (
                          <div className="w-full h-full flex items-center justify-center text-[10px]">
                            صورة
                          </div>
                        )}
                      </div>
                      <div className="max-w-xs">
                        <p className="font-bold text-[#1A1D2A] line-clamp-1">{product.name}</p>
                        <p className="text-[11px] text-[#94A3B8]">{product.slug}</p>
                      </div>
                    </div>
                  </td>

                  <td className="py-3.5 px-4 font-mono font-medium text-[#64748B]">
                    {product.sku}
                  </td>

                  <td className="py-3.5 px-4">
                    <span className="font-medium text-[#1A1D2A]">{product.category_name}</span>
                    <span className="text-[11px] text-[#2B7BD4] block">{product.brand_name}</span>
                  </td>

                  <td className="py-3.5 px-4">
                    <div className="font-bold text-[#1A1D2A]">
                      {formatPrice(product.discount_price || product.price)}
                    </div>
                    {product.discount_price < product.price && (
                      <span className="text-[10px] text-[#EF4444] font-medium">خصم نشط</span>
                    )}
                  </td>

                  <td className="py-3.5 px-4">
                    <span
                      className={`font-bold ${
                        product.stock_quantity < 10 ? "text-[#EF4444]" : "text-[#16A34A]"
                      }`}
                    >
                      {product.stock_quantity} قطعة
                    </span>
                  </td>

                  <td className="py-3.5 px-4">
                    {product.stock_quantity > 0 ? (
                      <Badge variant="active">متوفر</Badge>
                    ) : (
                      <Badge variant="cancelled">نفد المخزون</Badge>
                    )}
                  </td>

                  <td className="py-3.5 px-4 text-end">
                    <div className="flex items-center justify-end gap-1.5">
                      <Link
                        href={`/products/${encodeURIComponent(product.slug)}?id=${encodeURIComponent(product.product_id)}`}
                        className="p-1.5 rounded-lg border border-black/8 text-[#64748B] hover:text-[#2B7BD4] hover:bg-[#EEF5FC]"
                        title="معاينة في المتجر"
                      >
                        <Store01Icon size={14} />
                      </Link>
                      <button
                        type="button"
                        onClick={() => toast.info("تعديل تفاصيل المنتج")}
                        className="p-1.5 rounded-lg border border-black/8 text-[#64748B] hover:text-[#2B7BD4] hover:bg-[#EEF5FC]"
                        title="تعديل"
                      >
                        <Edit01Icon size={14} />
                      </button>
                      <button
                        type="button"
                        onClick={() => handleDelete(product.product_id, product.name)}
                        className="p-1.5 rounded-lg border border-black/8 text-[#EF4444] hover:bg-[#EF4444]/10"
                        title="حذف"
                      >
                        <Delete01Icon size={14} />
                      </button>
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}
