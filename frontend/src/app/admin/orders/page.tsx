import React from "react";
import { Badge } from "@/shared/components/Badge";
import { formatPrice, formatDate } from "@/shared/utils";
import { STATIC_ORDERS } from "@/shared/data/mock-data";

export default function AdminOrdersPage() {
  const orders = STATIC_ORDERS;

  return (
    <div className="space-y-6">
      {/* Page Header */}
      <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
        <div>
          <h2 className="text-2xl font-black tracking-[-0.02em] text-ink">إدارة الطلبات والمبيعات</h2>
          <p className="mt-1 text-sm text-muted">
            متابعة حالة شحن وتوصيل الطلبات وتحديثها في قاعدة البيانات
          </p>
        </div>
      </div>

      {/* Filter Tabs */}
      <div className="flex flex-wrap items-center gap-2 border-b border-line pb-3">
        {[
          { label: "كافة الطلبات", active: true },
          { label: "قيد الانتظار (Pending)", active: false },
          { label: "قيد التجهيز (Processing)", active: false },
          { label: "تم الشحن (Shipped)", active: false },
          { label: "تم التوصيل (Delivered)", active: false },
          { label: "ملغية (Cancelled)", active: false },
        ].map((tab) => (
          <button
            key={tab.label}
            type="button"
            className={`px-3.5 py-1.5 rounded-xl text-xs font-semibold transition-all ${
              tab.active
                ? "bg-brand text-white shadow-[0_6px_16px_rgba(10,11,10,0.16)]"
                : "bg-surface text-muted border border-line hover:bg-paper hover:text-ink"
            }`}
          >
            {tab.label}
          </button>
        ))}
      </div>

      {/* Orders Table */}
      <div className="bg-surface rounded-2xl border border-line shadow-[0_2px_10px_rgba(10,11,10,0.04)] overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full text-start text-xs">
            <thead className="bg-paper border-b border-line text-muted font-semibold">
              <tr>
                <th className="py-3 px-4 text-start">رقم الطلب</th>
                <th className="py-3 px-4 text-start">العميل</th>
                <th className="py-3 px-4 text-start">العناصر المشتراة</th>
                <th className="py-3 px-4 text-start">الإجمالي الكلي</th>
                <th className="py-3 px-4 text-start">الحالة الحالية</th>
                <th className="py-3 px-4 text-start">التاريخ</th>
                <th className="py-3 px-4 text-end">تغيير الحالة</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-line">
              {orders.map((order) => (
                <tr key={order.order_id} className="hover:bg-paper/70 transition-colors">
                  <td className="py-4 px-4 font-latin font-bold text-ink">
                    {order.order_number}
                  </td>

                  <td className="py-4 px-4">
                    <div className="font-bold text-ink">{order.customer_name}</div>
                    <div className="text-[11px] text-muted">{order.customer_email}</div>
                  </td>

                  <td className="py-4 px-4">
                    <span className="font-semibold tabular-nums text-ink">
                      {order.items?.length || 1} منتجات
                    </span>
                    <span className="text-[11px] text-muted block truncate max-w-xs">
                      {order.items?.[0]?.product_name}
                    </span>
                  </td>

                  <td className="py-4 px-4 font-extrabold tabular-nums text-ink">
                    {formatPrice(order.total_amount)}
                  </td>

                  <td className="py-4 px-4">
                    {order.status === "delivered" && <Badge variant="active" className="bg-brand-soft text-ink [&>span]:bg-brand">تم التوصيل</Badge>}
                    {order.status === "processing" && <Badge variant="completed" className="bg-brand-soft text-ink [&>span]:bg-brand">قيد التجهيز</Badge>}
                    {order.status === "pending" && <Badge variant="pending" className="bg-brand-soft text-ink [&>span]:bg-signal">في الانتظار</Badge>}
                    {order.status === "shipped" && <Badge variant="completed" className="bg-brand-soft text-ink [&>span]:bg-brand">تم الشحن</Badge>}
                    {order.status === "cancelled" && <Badge variant="cancelled" className="bg-paper text-sale [&>span]:bg-sale">ملغي</Badge>}
                  </td>

                  <td className="py-4 px-4 text-muted">
                    {formatDate(order.created_at)}
                  </td>

                  <td className="py-4 px-4 text-end">
                    <div className="flex items-center justify-end gap-1.5">
                      <button
                        type="button"
                        className="px-2 py-1 rounded-lg border border-line text-[11px] text-muted hover:bg-paper hover:text-ink transition-colors"
                        title="قيد التجهيز"
                      >
                        تجهيز
                      </button>
                      <button
                        type="button"
                        className="px-2 py-1 rounded-lg bg-brand-soft text-brand text-[11px] font-semibold hover:bg-brand hover:text-white transition-colors"
                        title="تم الشحن"
                      >
                        شحن
                      </button>
                      <button
                        type="button"
                        className="px-2 py-1 rounded-lg bg-brand-soft text-brand text-[11px] font-semibold hover:bg-brand hover:text-white transition-colors"
                        title="تم التوصيل"
                      >
                        توصيل
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
