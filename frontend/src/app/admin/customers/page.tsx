"use client";

import React, { useEffect, useState } from "react";
import { Shield01Icon } from "hugeicons-react";
import { Badge } from "@/shared/components/Badge";
import { formatDate } from "@/shared/utils";
import { UsersApi } from "@/lib/api-client";

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
  const [customers, setCustomers] = useState<MockCustomer[]>([]);

  useEffect(() => {
    UsersApi.getAll()
      .then((users) =>
        setCustomers(
          users.map((user) => ({
            id: user.user_id,
            name: user.full_name,
            email: user.email,
            phone: user.phone,
            role: user.role,
            ordersCount: 0,
            totalSpent: 0,
            isActive: user.is_active,
            joinedDate: user.created_at,
          })),
        ),
      )
      .catch(() => setCustomers([]));
  }, []);

  return (
    <div className="space-y-6">
      <div>
        <h2 className="text-xl font-black text-[#1A1D2A]">إدارة العملاء والمستخدمين</h2>
        <p className="text-xs text-[#64748B] mt-0.5">
          عرض قائمة المستخدمين المسجلين، أدوارهم ومشترياتهم، مهيأ لجدول users في الباك إند
        </p>
      </div>

      <div className="bg-white rounded-2xl border border-black/8 shadow-sm overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full text-start text-xs">
            <thead className="bg-[#F8FAFC] border-b border-black/8 text-[#64748B] font-semibold">
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
            <tbody className="divide-y divide-black/5">
              {customers.map((c) => (
                <tr key={c.id} className="hover:bg-[#F8FAFC]/80 transition-colors">
                  <td className="py-3.5 px-4">
                    <div className="flex items-center gap-3">
                      <div className="w-8 h-8 rounded-xl bg-[#EEF5FC] text-[#2B7BD4] flex items-center justify-center font-bold">
                        {c.name.charAt(0)}
                      </div>
                      <div>
                        <p className="font-bold text-[#1A1D2A]">{c.name}</p>
                        <p className="text-[11px] text-[#94A3B8]">{c.email}</p>
                      </div>
                    </div>
                  </td>

                  <td className="py-3.5 px-4 font-mono text-[#64748B]" dir="ltr">
                    {c.phone}
                  </td>

                  <td className="py-3.5 px-4">
                    {c.role === "admin" ? (
                      <span className="inline-flex items-center gap-1 text-[11px] font-bold text-[#6AABF0] bg-[#6AABF0]/10 px-2 py-0.5 rounded-md">
                        <Shield01Icon size={12} />
                        <span>مدير (Admin)</span>
                      </span>
                    ) : (
                      <span className="text-[11px] text-[#64748B]">عميل عادي</span>
                    )}
                  </td>

                  <td className="py-3.5 px-4 font-semibold text-[#1A1D2A]">{c.ordersCount} طلبات</td>

                  <td className="py-3.5 px-4 font-bold text-[#1A1D2A]">${c.totalSpent}</td>

                  <td className="py-3.5 px-4">
                    {c.isActive ? <Badge variant="active">نشط</Badge> : <Badge variant="cancelled">محظور</Badge>}
                  </td>

                  <td className="py-3.5 px-4 text-[#64748B]">{formatDate(c.joinedDate)}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}
