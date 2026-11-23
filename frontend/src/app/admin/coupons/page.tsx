import React from "react";
import { Ticket01Icon, Add01Icon, Delete01Icon } from "hugeicons-react";
import { Button } from "@/shared/components/Button";
import { Input } from "@/shared/components/Input";
import { Badge } from "@/shared/components/Badge";
import { STATIC_COUPONS } from "@/shared/data/mock-data";

export default function AdminCouponsPage() {
  const coupons = STATIC_COUPONS;

  return (
    <div className="space-y-6">
      {/* Page Header */}
      <div>
        <h2 className="text-2xl font-black tracking-[-0.02em] text-ink">إدارة كوبونات الخصم</h2>
        <p className="mt-1 text-sm text-muted">
          إنشاء وتفعيل كوبونات الخصم الثابتة والنسبية المتوافقة مع موديل coupons في الباك إند
        </p>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Create Coupon Form (Col Span 1) */}
        <div className="bg-surface p-6 rounded-2xl border border-line shadow-[0_2px_10px_rgba(10,11,10,0.04)] h-fit">
          <div className="flex items-center gap-2 mb-4 pb-3 border-b border-line">
            <span className="grid size-9 place-items-center rounded-xl bg-brand-soft text-brand">
              <Ticket01Icon size={18} />
            </span>
            <h3 className="font-black text-sm text-ink">إضافة كوبون جديد</h3>
          </div>

          <form className="space-y-4">
            <Input
              label="رمز الكوبون (Coupon Code)"
              placeholder="مثال: SUMMER25"
              className="font-latin"
              required
            />

            <div>
              <label className="text-xs font-bold text-muted block mb-1.5">
                نوع الخصم (Discount Type)
              </label>
              <div className="grid grid-cols-2 gap-2">
                <button
                  type="button"
                  className="py-2.5 text-xs font-bold rounded-xl border border-brand bg-brand-soft text-brand-deep transition-all"
                >
                  نسبة مئوية (%)
                </button>
                <button
                  type="button"
                  className="py-2.5 text-xs font-bold rounded-xl border border-line text-muted hover:border-brand/40 hover:text-brand transition-all"
                >
                  مبلغ ثابت ($)
                </button>
              </div>
            </div>

            <Input
              label="قيمة الخصم (%)"
              type="number"
              placeholder="15"
              className="font-latin"
              required
            />

            <Input
              label="الحد الأقصى للاستخدام (Max Uses)"
              type="number"
              defaultValue="100"
              className="font-latin"
            />

            <Button variant="primary" size="md" className="w-full gap-2 mt-2">
              <Add01Icon size={16} />
              <span>تفعيل الكوبون</span>
            </Button>
          </form>
        </div>

        {/* Coupons List (Col Span 2) */}
        <div className="lg:col-span-2 bg-surface rounded-2xl border border-line shadow-[0_2px_10px_rgba(10,11,10,0.04)] overflow-hidden">
          <div className="p-4 border-b border-line flex items-center justify-between gap-4">
            <h3 className="font-black text-sm text-ink">الكوبونات المسجلة</h3>
            <span className="text-xs text-muted tabular-nums">{coupons.length} كوبون نشط</span>
          </div>

          <div className="overflow-x-auto">
            <table className="w-full text-start text-xs">
              <thead className="bg-paper border-b border-line text-muted font-semibold">
                <tr>
                  <th className="py-3 px-4 text-start">الكود</th>
                  <th className="py-3 px-4 text-start">النوع</th>
                  <th className="py-3 px-4 text-start">قيمة الخصم</th>
                  <th className="py-3 px-4 text-start">معدل الاستخدام</th>
                  <th className="py-3 px-4 text-start">الحالة</th>
                  <th className="py-3 px-4 text-end">حذف</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-line">
                {coupons.map((c) => (
                  <tr key={c.coupon_id} className="hover:bg-paper/70 transition-colors">
                    <td className="py-3.5 px-4">
                      <span className="font-latin font-bold text-xs text-brand-deep bg-brand-soft px-2 py-0.5 rounded-md">
                        {c.code}
                      </span>
                    </td>
                    <td className="py-3.5 px-4 text-muted">
                      {c.discount_type === "percentage" ? "نسبة مئوية" : "مبلغ ثابت"}
                    </td>
                    <td className="py-3.5 px-4 font-black tabular-nums text-ink">
                      {c.discount_type === "percentage" ? `${c.discount_value}%` : `$${c.discount_value}`}
                    </td>
                    <td className="py-3.5 px-4 text-muted tabular-nums">
                      {c.used_count} / {c.max_uses}
                    </td>
                    <td className="py-3.5 px-4">
                      {c.is_active ? <Badge variant="active" className="bg-brand-soft text-ink [&>span]:bg-brand">نشط</Badge> : <Badge variant="cancelled" className="bg-paper text-sale [&>span]:bg-sale">معطل</Badge>}
                    </td>
                    <td className="py-3.5 px-4 text-end">
                      <button
                        type="button"
                        className="grid size-8 place-items-center rounded-lg border border-sale/20 text-sale hover:bg-sale/10 transition-colors"
                      >
                        <Delete01Icon size={14} />
                      </button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      </div>
    </div>
  );
}
