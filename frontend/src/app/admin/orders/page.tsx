"use client";

import React, { useEffect, useState } from "react";
import { Badge } from "@/shared/components/Badge";
import { formatPrice, formatDate } from "@/shared/utils";
import { Order, OrderStatus } from "@/shared/types";
import { toast } from "sonner";
import { OrdersApi } from "@/lib/api-client";

export default function AdminOrdersPage() {
  const [orders, setOrders] = useState<Order[]>([]);
  const [statusFilter, setStatusFilter] = useState<string>("all");

  useEffect(() => {
    OrdersApi.getAll()
      .then(setOrders)
      .catch((error) =>
        toast.error(error instanceof Error ? error.message : "تعذر تحميل الطلبات."),
      );
  }, []);

  const handleUpdateStatus = async (orderId: string, newStatus: OrderStatus) => {
    try {
      const updatedOrder = await OrdersApi.updateStatus(orderId, newStatus);
      setOrders((current) =>
        current.map((order) => order.order_id === orderId ? { ...order, ...updatedOrder } : order),
      );
      toast.success(`تم تحديث حالة الطلب إلى "${newStatus}" بنجاح.`);
    } catch (error) {
      toast.error(error instanceof Error ? error.message : "تعذر تحديث حالة الطلب.");
    }
  };

  const filteredOrders = orders.filter((o) =>
    statusFilter === "all" ? true : o.status === statusFilter
  );

  return (
    <div className="space-y-6">
      {/* Page Header */}
      <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
        <div>
          <h2 className="text-xl font-black text-[#1A1D2A]">إدارة الطلبات والمبيعات</h2>
          <p className="text-xs text-[#64748B] mt-0.5">
            متابعة حالة شحن وتوصيل الطلبات وتحديثها في قاعدة البيانات
          </p>
        </div>
      </div>

      {/* Filter Tabs */}
      <div className="flex flex-wrap items-center gap-2 border-b border-black/8 pb-3">
        {[
          { label: "كافة الطلبات", value: "all" },
          { label: "قيد الانتظار (Pending)", value: "pending" },
          { label: "قيد التجهيز (Processing)", value: "processing" },
          { label: "تم الشحن (Shipped)", value: "shipped" },
          { label: "تم التوصيل (Delivered)", value: "delivered" },
          { label: "ملغية (Cancelled)", value: "cancelled" },
        ].map((tab) => (
          <button
            key={tab.value}
            onClick={() => setStatusFilter(tab.value)}
            className={`px-3.5 py-1.5 rounded-xl text-xs font-semibold transition-all ${
              statusFilter === tab.value
                ? "bg-[#6AABF0] text-white shadow-sm"
                : "bg-white text-[#64748B] border border-black/8 hover:bg-[#F8FAFC]"
            }`}
          >
            {tab.label}
          </button>
        ))}
      </div>

      {/* Orders Table */}
      <div className="bg-white rounded-2xl border border-black/8 shadow-sm overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full text-start text-xs">
            <thead className="bg-[#F8FAFC] border-b border-black/8 text-[#64748B] font-semibold">
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
            <tbody className="divide-y divide-black/5">
              {filteredOrders.map((order) => (
                <tr key={order.order_id} className="hover:bg-[#F8FAFC]/80 transition-colors">
                  <td className="py-4 px-4 font-mono font-bold text-[#1A1D2A]">
                    {order.order_number}
                  </td>

                  <td className="py-4 px-4">
                    <div className="font-bold text-[#1A1D2A]">{order.customer_name}</div>
                    <div className="text-[11px] text-[#94A3B8]">{order.customer_email}</div>
                  </td>

                  <td className="py-4 px-4">
                    <span className="font-semibold text-[#1A1D2A]">
                      {order.items?.length || 1} منتجات
                    </span>
                    <span className="text-[11px] text-[#64748B] block truncate max-w-xs">
                      {order.items?.[0]?.product_name}
                    </span>
                  </td>

                  <td className="py-4 px-4 font-extrabold text-[#1A1D2A]">
                    {formatPrice(order.total_amount)}
                  </td>

                  <td className="py-4 px-4">
                    {order.status === "delivered" && <Badge variant="active">تم التوصيل</Badge>}
                    {order.status === "processing" && <Badge variant="completed">قيد التجهيز</Badge>}
                    {order.status === "pending" && <Badge variant="pending">في الانتظار</Badge>}
                    {order.status === "shipped" && <Badge variant="completed">تم الشحن</Badge>}
                    {order.status === "cancelled" && <Badge variant="cancelled">ملغي</Badge>}
                  </td>

                  <td className="py-4 px-4 text-[#64748B]">
                    {formatDate(order.created_at)}
                  </td>

                  <td className="py-4 px-4 text-end">
                    <div className="flex items-center justify-end gap-1.5">
                      <button
                        onClick={() => handleUpdateStatus(order.order_id, "processing")}
                        className="px-2 py-1 rounded-lg border border-black/8 text-[11px] hover:bg-[#F8FAFC]"
                        title="قيد التجهيز"
                      >
                        تجهيز
                      </button>
                      <button
                        onClick={() => handleUpdateStatus(order.order_id, "shipped")}
                        className="px-2 py-1 rounded-lg bg-[#EEF5FC] text-[#2B7BD4] text-[11px] font-semibold"
                        title="تم الشحن"
                      >
                        شحن
                      </button>
                      <button
                        onClick={() => handleUpdateStatus(order.order_id, "delivered")}
                        className="px-2 py-1 rounded-lg bg-[#22C55E]/10 text-[#16A34A] text-[11px] font-semibold"
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
