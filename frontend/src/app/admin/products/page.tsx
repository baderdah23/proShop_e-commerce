import React from "react";
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
import { STATIC_PRODUCTS } from "@/shared/data/mock-data";

export default function AdminProductsPage() {
  const products = STATIC_PRODUCTS;

  return (
    <div className="space-y-6">
      {/* Page Header */}
      <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
        <div>
          <h2 className="text-2xl font-black tracking-[-0.02em] text-ink">إدارة المنتجات</h2>
          <p className="mt-1 text-sm text-muted">
            عرض وتعديل وحذف منتجات المتجر والمخزون
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
      <div className="bg-surface p-4 rounded-2xl border border-line shadow-[0_2px_10px_rgba(10,11,10,0.04)] flex flex-col sm:flex-row items-center justify-between gap-4">
        <div className="relative w-full sm:w-80">
          <Search01Icon
            size={18}
            className="absolute start-3.5 top-1/2 -translate-y-1/2 pointer-events-none text-muted"
          />
          <input
            type="text"
            placeholder="ابحث بالاسم أو رمز SKU..."
            className="w-full ps-10 pe-4 py-2.5 bg-paper border border-line rounded-xl text-xs text-ink placeholder:text-muted/70 focus:outline-none focus:border-brand focus:ring-4 focus:ring-brand/10 transition-all"
          />
        </div>

        <div className="flex items-center gap-2 self-end sm:self-auto text-xs text-muted">
          <span>إجمالي المنتجات المعروضة: </span>
          <span className="font-bold tabular-nums text-ink">{products.length}</span>
        </div>
      </div>

      {/* Products Table */}
      <div className="bg-surface rounded-2xl border border-line shadow-[0_2px_10px_rgba(10,11,10,0.04)] overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full text-start text-xs">
            <thead className="bg-paper border-b border-line text-muted font-semibold">
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
            <tbody className="divide-y divide-line">
              {products.map((product) => (
                <tr key={product.product_id} className="hover:bg-paper/70 transition-colors">
                  <td className="py-3.5 px-4">
                    <div className="flex items-center gap-3">
                      <div className="size-10 rounded-xl overflow-hidden bg-paper shrink-0 border border-line">
                        {product.image_url ? (
                          <img
                            src={product.image_url}
                            alt={product.name}
                            className="size-full object-cover"
                          />
                        ) : (
                          <div className="size-full flex items-center justify-center text-[10px] text-muted">
                            صورة
                          </div>
                        )}
                      </div>
                      <div className="max-w-xs">
                        <p className="font-bold text-ink line-clamp-1">{product.name}</p>
                        <p className="font-latin text-[11px] text-muted">{product.slug}</p>
                      </div>
                    </div>
                  </td>

                  <td className="py-3.5 px-4 font-latin font-medium text-muted">
                    {product.sku}
                  </td>

                  <td className="py-3.5 px-4">
                    <span className="font-medium text-ink">{product.category_name}</span>
                    <span className="text-[11px] text-brand block">{product.brand_name}</span>
                  </td>

                  <td className="py-3.5 px-4">
                    <div className="font-black tabular-nums text-ink">
                      {formatPrice(product.discount_price || product.price)}
                    </div>
                    {product.discount_price < product.price && (
                      <span className="text-[10px] font-semibold text-sale">خصم نشط</span>
                    )}
                  </td>

                  <td className="py-3.5 px-4">
                    <span
                      className={`font-latin font-bold tabular-nums ${
                        product.stock_quantity < 10 ? "text-sale" : "text-brand"
                      }`}
                    >
                      {product.stock_quantity} قطعة
                    </span>
                  </td>

                  <td className="py-3.5 px-4">
                    {product.stock_quantity > 0 ? (
                      <Badge variant="active" className="bg-brand-soft text-ink [&>span]:bg-brand">متوفر</Badge>
                    ) : (
                      <Badge variant="cancelled" className="bg-paper text-sale [&>span]:bg-sale">نفد المخزون</Badge>
                    )}
                  </td>

                  <td className="py-3.5 px-4 text-end">
                    <div className="flex items-center justify-end gap-1.5">
                      <Link
                        href={`/products/${encodeURIComponent(product.slug)}?id=${encodeURIComponent(product.product_id)}`}
                        className="grid size-8 place-items-center rounded-lg border border-line text-muted hover:text-brand hover:bg-brand-soft transition-colors"
                        title="معاينة في المتجر"
                      >
                        <Store01Icon size={14} />
                      </Link>
                      <button
                        type="button"
                        className="grid size-8 place-items-center rounded-lg border border-line text-muted hover:text-brand hover:bg-brand-soft transition-colors"
                        title="تعديل"
                      >
                        <Edit01Icon size={14} />
                      </button>
                      <button
                        type="button"
                        className="grid size-8 place-items-center rounded-lg border border-sale/20 text-sale hover:bg-sale/10 transition-colors"
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
