"use client";

import React, { useEffect, useState } from "react";
import { Ticket01Icon, Add01Icon, Delete01Icon } from "hugeicons-react";
import { Button } from "@/shared/components/Button";
import { Input } from "@/shared/components/Input";
import { Badge } from "@/shared/components/Badge";
import { Coupon } from "@/shared/types";
import { toast } from "sonner";
import { CouponsApi } from "@/lib/api-client";

export default function AdminCouponsPage() {
  const [coupons, setCoupons] = useState<Coupon[]>([]);
  const [newCode, setNewCode] = useState("");
  const [discountValue, setDiscountValue] = useState("");
  const [discountType, setDiscountType] = useState<"percentage" | "fixed">("percentage");
  const [maxUses, setMaxUses] = useState("100");

  useEffect(() => {
    CouponsApi.getAll()
      .then(setCoupons)
      .catch((error) => toast.error(error instanceof Error ? error.message : "تعذر تحميل الكوبونات."));
  }, []);

  const handleCreateCoupon = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!newCode || !discountValue) return;

    try {
      const created = await CouponsApi.create({
        code: newCode.toUpperCase(),
        discount_type: discountType,
        discount_value: parseFloat(discountValue),
        max_uses: parseInt(maxUses, 10),
        valid_from: new Date().toISOString().split("T")[0],
        valid_until: "2026-12-31",
      });
      setCoupons((current) => [created, ...current]);
      setNewCode("");
      setDiscountValue("");
      toast.success("تم إنشاء الكوبون الجديد بنجاح.");
    } catch (error) {
      toast.error(error instanceof Error ? error.message : "تعذر إنشاء الكوبون.");
    }
  };

  const handleDeleteCoupon = async (id: string) => {
    try {
      await CouponsApi.remove(id);
      setCoupons((current) => current.filter((c) => c.coupon_id !== id));
      toast.success("تم حذف الكوبون.");
    } catch (error) {
      toast.error(error instanceof Error ? error.message : "تعذر حذف الكوبون.");
    }
  };

  return (
    <div className="space-y-6">
      {/* Page Header */}
      <div>
        <h2 className="text-xl font-black text-[#1A1D2A]">إدارة كوبونات الخصم</h2>
        <p className="text-xs text-[#64748B] mt-0.5">
          إنشاء وتفعيل كوبونات الخصم الثابتة والنسبية المتوافقة مع موديل coupons في الباك إند
        </p>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Create Coupon Form (Col Span 1) */}
        <div className="bg-white p-6 rounded-2xl border border-black/8 shadow-sm h-fit">
          <div className="flex items-center gap-2 mb-4 pb-3 border-b border-black/5">
            <Ticket01Icon size={18} color="#6AABF0" />
            <h3 className="font-bold text-sm text-[#1A1D2A]">إضافة كوبون جديد</h3>
          </div>

          <form onSubmit={handleCreateCoupon} className="space-y-4">
            <Input
              label="رمز الكوبون (Coupon Code)"
              placeholder="مثال: SUMMER25"
              required
              value={newCode}
              onChange={(e) => setNewCode(e.target.value)}
            />

            <div>
              <label className="text-xs font-semibold text-[#475569] block mb-1.5">
                نوع الخصم (Discount Type)
              </label>
              <div className="grid grid-cols-2 gap-2">
                <button
                  type="button"
                  onClick={() => setDiscountType("percentage")}
                  className={`py-2 text-xs font-bold rounded-xl border transition-all ${
                    discountType === "percentage"
                      ? "border-[#6AABF0] bg-[#EEF5FC] text-[#2B7BD4]"
                      : "border-black/10 text-[#64748B]"
                  }`}
                >
                  نسبة مئوية (%)
                </button>
                <button
                  type="button"
                  onClick={() => setDiscountType("fixed")}
                  className={`py-2 text-xs font-bold rounded-xl border transition-all ${
                    discountType === "fixed"
                      ? "border-[#6AABF0] bg-[#EEF5FC] text-[#2B7BD4]"
                      : "border-black/10 text-[#64748B]"
                  }`}
                >
                  مبلغ ثابت ($)
                </button>
              </div>
            </div>

            <Input
              label={discountType === "percentage" ? "قيمة الخصم (%)" : "قيمة الخصم ($)"}
              type="number"
              placeholder={discountType === "percentage" ? "15" : "50"}
              required
              value={discountValue}
              onChange={(e) => setDiscountValue(e.target.value)}
            />

            <Input
              label="الحد الأقصى للاستخدام (Max Uses)"
              type="number"
              value={maxUses}
              onChange={(e) => setMaxUses(e.target.value)}
            />

            <Button variant="primary" size="md" className="w-full gap-2 mt-2">
              <Add01Icon size={16} />
              <span>تفعيل الكوبون</span>
            </Button>
          </form>
        </div>

        {/* Coupons List (Col Span 2) */}
        <div className="lg:col-span-2 bg-white rounded-2xl border border-black/8 shadow-sm overflow-hidden">
          <div className="p-4 border-b border-black/5 flex items-center justify-between">
            <h3 className="font-bold text-sm text-[#1A1D2A]">الكوبونات المسجلة</h3>
            <span className="text-xs text-[#64748B]">{coupons.length} كوبون نشط</span>
          </div>

          <div className="overflow-x-auto">
            <table className="w-full text-start text-xs">
              <thead className="bg-[#F8FAFC] border-b border-black/8 text-[#64748B] font-semibold">
                <tr>
                  <th className="py-3 px-4 text-start">الكود</th>
                  <th className="py-3 px-4 text-start">النوع</th>
                  <th className="py-3 px-4 text-start">قيمة الخصم</th>
                  <th className="py-3 px-4 text-start">معدل الاستخدام</th>
                  <th className="py-3 px-4 text-start">الحالة</th>
                  <th className="py-3 px-4 text-end">حذف</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-black/5">
                {coupons.map((c) => (
                  <tr key={c.coupon_id} className="hover:bg-[#F8FAFC]">
                    <td className="py-3.5 px-4">
                      <span className="font-mono font-bold text-xs text-[#2B7BD4] bg-[#EEF5FC] px-2 py-0.5 rounded-md">
                        {c.code}
                      </span>
                    </td>
                    <td className="py-3.5 px-4 text-[#475569]">
                      {c.discount_type === "percentage" ? "نسبة مئوية" : "مبلغ ثابت"}
                    </td>
                    <td className="py-3.5 px-4 font-bold text-[#1A1D2A]">
                      {c.discount_type === "percentage" ? `${c.discount_value}%` : `$${c.discount_value}`}
                    </td>
                    <td className="py-3.5 px-4 text-[#64748B]">
                      {c.used_count} / {c.max_uses}
                    </td>
                    <td className="py-3.5 px-4">
                      {c.is_active ? <Badge variant="active">نشط</Badge> : <Badge variant="cancelled">معطل</Badge>}
                    </td>
                    <td className="py-3.5 px-4 text-end">
                      <button
                        onClick={() => handleDeleteCoupon(c.coupon_id)}
                        className="p-1.5 rounded-lg border border-black/8 text-[#EF4444] hover:bg-[#EF4444]/10"
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
