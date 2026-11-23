import React from "react";
import { Shield01Icon } from "hugeicons-react";
import { Badge } from "@/shared/components/Badge";
import { formatDate } from "@/shared/utils";
import { STATIC_USERS } from "@/shared/data/mock-data";

interface MockCustomer {
  id: string;
  name: string;
  email: string;
  phone: string;
  role: "admin" | "customer";
  ordersCount: number;
  totalSpent: number;
  isActive: boolean;
  joinedDate: string;
}

export default function AdminCustomersPage() {
  const customers: MockCustomer[] = STATIC_USERS.map((user) => ({
    id: user.user_id,
    name: user.full_name,
    email: user.email,
    phone: user.phone,
    role: user.role,
    ordersCount: user.role === "admin" ? 0 : 2,
    totalSpent: user.role === "admin" ? 0 : 1869,
    isActive: user.is_active,
    joinedDate: user.created_at,
  }));

  return (
    <div className="space-y-6">
      <div>
        <h2 className="text-2xl font-black tracking-[-0.02em] text-ink">إدارة العملاء والمستخدمين</h2>
        <p className="mt-1 text-sm text-muted">
          عرض قائمة المستخدمين المسجلين، أدوارهم ومشترياتهم
        </p>
      </div>

      <div className="bg-surface rounded-2xl border border-line shadow-[0_2px_10px_rgba(10,11,10,0.04)] overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full text-start text-xs">
            <thead className="bg-paper border-b border-line text-muted font-semibold">
              <tr>
                <th className="py-3 px-4 text-start">العميل</th>
                <th className="py-3 px-4 text-start">رقم الهاتف</th>
                <th className="py-3 px-4 text-start">الدور (Role)</th>
                <th className="py-3 px-4 text-start">عدد الطلبات</th>
                <th className="py-3 px-4 text-start">إجمالي الإنفاق</th>
                <th className="py-3 px-4 text-start">الحالة</th>
                <th className="py-3 px-4 text-start">تاريخ الانضمام</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-line">
              {customers.map((c) => (
                <tr key={c.id} className="hover:bg-paper/70 transition-colors">
                  <td className="py-3.5 px-4">
                    <div className="flex items-center gap-3">
                      <div className="grid size-9 shrink-0 place-items-center rounded-xl bg-brand-soft text-brand font-bold">
                        {c.name.charAt(0)}
                      </div>
                      <div>
                        <p className="font-bold text-ink">{c.name}</p>
                        <p className="text-[11px] text-muted">{c.email}</p>
                      </div>
                    </div>
                  </td>

                  <td className="py-3.5 px-4 font-latin text-muted tabular-nums" dir="ltr">
                    {c.phone}
                  </td>

                  <td className="py-3.5 px-4">
                    {c.role === "admin" ? (
                      <span className="inline-flex items-center gap-1 text-[11px] font-bold text-brand-deep bg-brand-soft px-2 py-0.5 rounded-md">
                        <Shield01Icon size={12} />
                        <span>مدير (Admin)</span>
                      </span>
                    ) : (
                      <span className="text-[11px] text-muted">عميل عادي</span>
                    )}
                  </td>

                  <td className="py-3.5 px-4 font-latin font-semibold tabular-nums text-ink">{c.ordersCount} طلبات</td>

                  <td className="py-3.5 px-4 font-latin font-bold tabular-nums text-ink">${c.totalSpent}</td>

                  <td className="py-3.5 px-4">
                    {c.isActive ? <Badge variant="active" className="bg-brand-soft text-ink [&>span]:bg-brand">نشط</Badge> : <Badge variant="cancelled" className="bg-paper text-sale [&>span]:bg-sale">محظور</Badge>}
                  </td>

                  <td className="py-3.5 px-4 text-muted">{formatDate(c.joinedDate)}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}
