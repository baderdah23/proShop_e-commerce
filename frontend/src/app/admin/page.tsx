"use client";

import React, { useEffect, useState } from "react";
import Link from "next/link";
import {
  ShoppingBag01Icon,
  Invoice01Icon,
  UserGroupIcon,
  Money01Icon,
  ArrowUp01Icon,
  Ticket01Icon,
  Add01Icon,
  StarIcon,
} from "hugeicons-react";
import { SpotlightCard } from "@/shared/components/SpotlightCard";
import { Button } from "@/shared/components/Button";
import { Badge } from "@/shared/components/Badge";
import { formatPrice, formatDate } from "@/shared/utils";
import { OrdersApi, ProductsApi, UsersApi } from "@/lib/api-client";
import { Order, Product } from "@/shared/types";

export default function AdminDashboardPage() {
  const [orders, setOrders] = useState<Order[]>([]);
  const [products, setProducts] = useState<Product[]>([]);
  const [totalCustomers, setTotalCustomers] = useState(0);

  useEffect(() => {
    Promise.all([OrdersApi.getAll(), ProductsApi.getAll({ limit: 100 }), UsersApi.getAll()])
      .then(([loadedOrders, loadedProducts, users]) => {
        setOrders(loadedOrders);
        setProducts(loadedProducts.products);
        setTotalCustomers(users.filter((user) => user.role === "customer").length);
      })
      .catch(() => undefined);
  }, []);

  const totalSales = orders.reduce((sum, order) => sum + Number(order.total_amount || 0), 0);
  const totalOrders = orders.length;
  const activeProducts = products.length;

  return (
    <div className="space-y-8">
      {/* Top Banner / Welcome */}
      <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 bg-white p-6 rounded-2xl border border-black/8 shadow-sm">
        <div>
          <h2 className="text-xl font-black text-[#1A1D2A]">مرحباً بك في لوحة تحكم المتجر 👋</h2>
          <p className="text-xs text-[#64748B] mt-1">
            إليك ملخص الأداء والإحصائيات الحية لمتجرك اليوم. النظام متصل وجاهز للربط بالباك إند.
          </p>
        </div>

        <div className="flex items-center gap-3">
          <Link href="/admin/products/new">
            <Button variant="primary" size="sm" className="gap-2">
              <Add01Icon size={16} />
              <span>إضافة منتج جديد</span>
            </Button>
          </Link>
        </div>
      </div>

      {/* KPI Stats Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-5">
        {/* KPI 1: Sales */}
        <SpotlightCard className="p-5 border border-black/8 hover:border-[#6AABF0]/30 transition-all">
          <div className="flex items-center justify-between mb-3">
            <span className="text-xs font-semibold text-[#64748B]">إجمالي المبيعات</span>
            <div className="w-10 h-10 rounded-xl bg-[#22C55E]/10 text-[#16A34A] flex items-center justify-center">
              <Money01Icon size={20} color="#16A34A" />
            </div>
          </div>
          <div className="text-2xl font-black text-[#1A1D2A] mb-1">
            {formatPrice(totalSales)}
          </div>
          <div className="flex items-center gap-1.5 text-xs text-[#16A34A] font-semibold">
            <ArrowUp01Icon size={14} color="#16A34A" />
            <span>+14.8% مقارنة بالشهر السابق</span>
          </div>
        </SpotlightCard>

        {/* KPI 2: Orders */}
        <SpotlightCard className="p-5 border border-black/8 hover:border-[#6AABF0]/30 transition-all">
          <div className="flex items-center justify-between mb-3">
            <span className="text-xs font-semibold text-[#64748B]">إجمالي الطلبات</span>
            <div className="w-10 h-10 rounded-xl bg-[#6AABF0]/10 text-[#2B7BD4] flex items-center justify-center">
              <Invoice01Icon size={20} color="#2B7BD4" />
            </div>
          </div>
          <div className="text-2xl font-black text-[#1A1D2A] mb-1">{totalOrders} طلب</div>
          <div className="flex items-center gap-1.5 text-xs text-[#16A34A] font-semibold">
            <ArrowUp01Icon size={14} color="#16A34A" />
            <span>+8.2% نمو أسبوعي</span>
          </div>
        </SpotlightCard>

        {/* KPI 3: Products */}
        <SpotlightCard className="p-5 border border-black/8 hover:border-[#6AABF0]/30 transition-all">
          <div className="flex items-center justify-between mb-3">
            <span className="text-xs font-semibold text-[#64748B]">المنتجات النشطة</span>
            <div className="w-10 h-10 rounded-xl bg-[#F59E0B]/10 text-[#D97706] flex items-center justify-center">
              <ShoppingBag01Icon size={20} color="#D97706" />
            </div>
          </div>
          <div className="text-2xl font-black text-[#1A1D2A] mb-1">{activeProducts} منتج</div>
          <div className="text-xs text-[#64748B]">متوفرة في 5 فئات رئيسية</div>
        </SpotlightCard>

        {/* KPI 4: Customers */}
        <SpotlightCard className="p-5 border border-black/8 hover:border-[#6AABF0]/30 transition-all">
          <div className="flex items-center justify-between mb-3">
            <span className="text-xs font-semibold text-[#64748B]">العملاء المسجلين</span>
            <div className="w-10 h-10 rounded-xl bg-[#0D1B2A]/5 text-[#0D1B2A] flex items-center justify-center">
              <UserGroupIcon size={20} color="#1A1D2A" />
            </div>
          </div>
          <div className="text-2xl font-black text-[#1A1D2A] mb-1">{totalCustomers} عميل</div>
          <div className="flex items-center gap-1.5 text-xs text-[#16A34A] font-semibold">
            <ArrowUp01Icon size={14} color="#16A34A" />
            <span>+24 عميل جديد هذا الأسبوع</span>
          </div>
        </SpotlightCard>
      </div>

      {/* Grid: Recent Orders & Quick Management */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        {/* Recent Orders Table (Col Span 2) */}
        <div className="lg:col-span-2 bg-white rounded-2xl border border-black/8 p-6 shadow-sm">
          <div className="flex items-center justify-between mb-6">
            <div>
              <h3 className="font-bold text-base text-[#1A1D2A]">أحدث طلبات المتجر</h3>
              <p className="text-xs text-[#64748B]">مزامنة مباشرة مع موديل orders في الباك إند</p>
            </div>
            <Link href="/admin/orders">
              <Button variant="ghost" size="xs">
                عرض كافة الطلبات
              </Button>
            </Link>
          </div>

          <div className="overflow-x-auto">
            <table className="w-full text-start text-xs">
              <thead>
                <tr className="border-b border-black/5 text-[#64748B] font-semibold">
                  <th className="pb-3 text-start">رقم الطلب</th>
                  <th className="pb-3 text-start">العميل</th>
                  <th className="pb-3 text-start">الإجمالي</th>
                  <th className="pb-3 text-start">الحالة</th>
                  <th className="pb-3 text-start">التاريخ</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-black/5">
                {orders.slice(0, 5).map((order) => (
                  <tr key={order.order_id} className="hover:bg-[#F8FAFC] transition-colors">
                    <td className="py-3.5 font-bold text-[#1A1D2A]">
                      {order.order_number}
                    </td>
                    <td className="py-3.5">
                      <div className="font-medium text-[#1A1D2A]">{order.customer_name}</div>
                      <div className="text-[11px] text-[#94A3B8]">{order.customer_email}</div>
                    </td>
                    <td className="py-3.5 font-extrabold text-[#1A1D2A]">
                      {formatPrice(order.total_amount)}
                    </td>
                    <td className="py-3.5">
                      {order.status === "delivered" && <Badge variant="active">تم التوصيل</Badge>}
                      {order.status === "processing" && <Badge variant="completed">قيد التجهيز</Badge>}
                      {order.status === "pending" && <Badge variant="pending">في الانتظار</Badge>}
                      {order.status === "cancelled" && <Badge variant="cancelled">ملغي</Badge>}
                    </td>
                    <td className="py-3.5 text-[#64748B]">
                      {formatDate(order.created_at)}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>

        {/* Quick Operations & Active Coupons (Col Span 1) */}
        <div className="space-y-6">
          {/* Active Coupons Box */}
          <div className="bg-white rounded-2xl border border-black/8 p-6 shadow-sm">
            <div className="flex items-center justify-between mb-4">
              <div className="flex items-center gap-2">
                <Ticket01Icon size={18} color="#6AABF0" />
                <h4 className="font-bold text-sm text-[#1A1D2A]">الكوبونات النشطة</h4>
              </div>
              <Link href="/admin/coupons" className="text-xs text-[#2B7BD4] hover:underline">
                إدارة
              </Link>
            </div>

            <div className="space-y-3">
              <div className="p-3 rounded-xl bg-[#F8FAFC] border border-black/5 flex items-center justify-between">
                <div>
                  <span className="font-mono font-bold text-xs text-[#2B7BD4] bg-[#EEF5FC] px-2 py-0.5 rounded-md">
                    PRO2026
                  </span>
                  <p className="text-[11px] text-[#64748B] mt-1">خصم 50$ مباشر | استخدام 84/500</p>
                </div>
                <Badge variant="active">فعال</Badge>
              </div>

              <div className="p-3 rounded-xl bg-[#F8FAFC] border border-black/5 flex items-center justify-between">
                <div>
                  <span className="font-mono font-bold text-xs text-[#2B7BD4] bg-[#EEF5FC] px-2 py-0.5 rounded-md">
                    GAMER10
                  </span>
                  <p className="text-[11px] text-[#64748B] mt-1">خصم 10% | استخدام 142/200</p>
                </div>
                <Badge variant="active">فعال</Badge>
              </div>
            </div>
          </div>

          {/* Quick Review Banner */}
          <div className="bg-gradient-to-br from-[#0D1B2A] to-[#1F63B3] text-white rounded-2xl p-6 shadow-md">
            <div className="flex items-center gap-2 text-xs font-bold text-[#6AABF0] mb-2">
              <StarIcon size={16} color="#6AABF0" />
              <span>تقييمات المتجر</span>
            </div>
            <h4 className="font-bold text-base mb-1">متوسط تقييم 4.9 من 5</h4>
            <p className="text-xs text-[#AACFF0] leading-relaxed mb-4">
              تم تلقي 12 تقييم إيجابي جديد خلال الـ 24 ساعة الماضية.
            </p>
            <Link href="/admin/reviews">
              <Button variant="secondary" size="xs" className="w-full text-xs">
                مراجعة التقييمات والتعليقات
              </Button>
            </Link>
          </div>
        </div>
      </div>
    </div>
  );
}
