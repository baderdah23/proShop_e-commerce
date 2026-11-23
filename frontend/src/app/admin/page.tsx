import React from "react";
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
import { Button } from "@/shared/components/Button";
import { Badge } from "@/shared/components/Badge";
import { formatPrice, formatDate } from "@/shared/utils";
import {
  STATIC_ORDERS,
  STATIC_PRODUCTS,
  STATIC_USERS,
} from "@/shared/data/mock-data";

export default function AdminDashboardPage() {
  const orders = STATIC_ORDERS;
  const products = STATIC_PRODUCTS;
  const totalCustomers = STATIC_USERS.filter((user) => user.role === "customer").length;

  const totalSales = orders.reduce((sum, order) => sum + Number(order.total_amount || 0), 0);
  const totalOrders = orders.length;
  const activeProducts = products.length;

  return (
    <div className="space-y-8">
      {/* Top Banner / Welcome */}
      <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 bg-surface p-6 rounded-2xl border border-line shadow-[0_2px_10px_rgba(10,11,10,0.04)]">
        <div>
          <span className="eyebrow text-brand">PROSTORE / OVERVIEW</span>
          <h2 className="mt-2 text-2xl font-black tracking-[-0.02em] text-ink">
            مرحباً بك في لوحة تحكم المتجر
          </h2>
          <p className="mt-1.5 text-sm text-muted">
            إليك ملخص الأداء والإحصائيات الحية لمتجرك اليوم.
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
        <div className="surface p-6 hover:border-brand/30 transition-all">
          <div className="flex items-center justify-between mb-3">
            <span className="text-xs font-semibold text-muted">إجمالي المبيعات</span>
            <div className="grid size-10 place-items-center rounded-xl bg-brand-soft text-brand">
              <Money01Icon size={20} className="text-brand" />
            </div>
          </div>
          <div className="font-latin tabular-nums text-3xl font-black text-ink mb-1">
            {formatPrice(totalSales)}
          </div>
          <div className="flex items-center gap-1.5 text-xs font-semibold text-brand">
            <ArrowUp01Icon size={14} className="text-brand" />
            <span>+14.8% مقارنة بالشهر السابق</span>
          </div>
        </div>

        {/* KPI 2: Orders */}
        <div className="surface p-6 hover:border-brand/30 transition-all">
          <div className="flex items-center justify-between mb-3">
            <span className="text-xs font-semibold text-muted">إجمالي الطلبات</span>
            <div className="grid size-10 place-items-center rounded-xl bg-brand-soft text-brand">
              <Invoice01Icon size={20} className="text-brand" />
            </div>
          </div>
          <div className="font-latin tabular-nums text-3xl font-black text-ink mb-1">{totalOrders} طلب</div>
          <div className="flex items-center gap-1.5 text-xs font-semibold text-brand">
            <ArrowUp01Icon size={14} className="text-brand" />
            <span>+8.2% نمو أسبوعي</span>
          </div>
        </div>

        {/* KPI 3: Products */}
        <div className="surface p-6 hover:border-brand/30 transition-all">
          <div className="flex items-center justify-between mb-3">
            <span className="text-xs font-semibold text-muted">المنتجات النشطة</span>
            <div className="grid size-10 place-items-center rounded-xl bg-brand-soft text-brand">
              <ShoppingBag01Icon size={20} className="text-brand" />
            </div>
          </div>
          <div className="font-latin tabular-nums text-3xl font-black text-ink mb-1">{activeProducts} منتج</div>
          <div className="text-xs text-muted">متوفرة في 5 فئات رئيسية</div>
        </div>

        {/* KPI 4: Customers */}
        <div className="surface p-6 hover:border-brand/30 transition-all">
          <div className="flex items-center justify-between mb-3">
            <span className="text-xs font-semibold text-muted">العملاء المسجلين</span>
            <div className="grid size-10 place-items-center rounded-xl bg-brand-soft text-brand">
              <UserGroupIcon size={20} className="text-brand" />
            </div>
          </div>
          <div className="font-latin tabular-nums text-3xl font-black text-ink mb-1">{totalCustomers} عميل</div>
          <div className="flex items-center gap-1.5 text-xs font-semibold text-brand">
            <ArrowUp01Icon size={14} className="text-brand" />
            <span>+24 عميل جديد هذا الأسبوع</span>
          </div>
        </div>
      </div>

      {/* Grid: Recent Orders & Quick Management */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        {/* Recent Orders Table (Col Span 2) */}
        <div className="lg:col-span-2 bg-surface rounded-2xl border border-line p-6 shadow-[0_2px_10px_rgba(10,11,10,0.04)]">
          <div className="flex items-center justify-between mb-6">
            <div>
              <h3 className="font-black text-base text-ink">أحدث طلبات المتجر</h3>
              <p className="mt-1 text-xs text-muted">مزامنة مباشرة مع موديل orders في الباك إند</p>
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
                <tr className="border-b border-line text-muted font-semibold">
                  <th className="pb-3 text-start">رقم الطلب</th>
                  <th className="pb-3 text-start">العميل</th>
                  <th className="pb-3 text-start">الإجمالي</th>
                  <th className="pb-3 text-start">الحالة</th>
                  <th className="pb-3 text-start">التاريخ</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-line">
                {orders.slice(0, 5).map((order) => (
                  <tr key={order.order_id} className="hover:bg-paper/70 transition-colors">
                    <td className="font-latin py-3.5 font-bold text-ink">
                      {order.order_number}
                    </td>
                    <td className="py-3.5">
                      <div className="font-medium text-ink">{order.customer_name}</div>
                      <div className="font-latin text-[11px] text-muted">{order.customer_email}</div>
                    </td>
                    <td className="font-latin py-3.5 font-extrabold tabular-nums text-ink">
                      {formatPrice(order.total_amount)}
                    </td>
                    <td className="py-3.5">
                      {order.status === "delivered" && <Badge variant="active" className="bg-brand-soft text-ink [&>span]:bg-brand">تم التوصيل</Badge>}
                      {order.status === "processing" && <Badge variant="completed" className="bg-brand-soft text-ink [&>span]:bg-brand">قيد التجهيز</Badge>}
                      {order.status === "pending" && <Badge variant="pending" className="bg-brand-soft text-ink [&>span]:bg-signal">في الانتظار</Badge>}
                      {order.status === "cancelled" && <Badge variant="cancelled" className="bg-paper text-sale [&>span]:bg-sale">ملغي</Badge>}
                    </td>
                    <td className="font-latin py-3.5 text-muted">
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
          <div className="bg-surface rounded-2xl border border-line p-6 shadow-[0_2px_10px_rgba(10,11,10,0.04)]">
            <div className="flex items-center justify-between mb-4">
              <div className="flex items-center gap-2">
                <Ticket01Icon size={18} className="text-brand" />
                <h4 className="font-black text-sm text-ink">الكوبونات النشطة</h4>
              </div>
              <Link href="/admin/coupons" className="text-xs font-bold text-brand hover:text-brand-deep hover:underline">
                إدارة
              </Link>
            </div>

            <div className="space-y-3">
              <div className="p-3 rounded-xl bg-paper border border-line flex items-center justify-between">
                <div>
                  <span className="font-latin font-bold text-xs text-brand-deep bg-brand-soft px-2 py-0.5 rounded-md">
                    PRO2026
                  </span>
                  <p className="text-[11px] text-muted mt-1">خصم 50$ مباشر | استخدام 84/500</p>
                </div>
                <Badge variant="active" className="bg-brand-soft text-ink [&>span]:bg-brand">فعال</Badge>
              </div>

              <div className="p-3 rounded-xl bg-paper border border-line flex items-center justify-between">
                <div>
                  <span className="font-latin font-bold text-xs text-brand-deep bg-brand-soft px-2 py-0.5 rounded-md">
                    GAMER10
                  </span>
                  <p className="text-[11px] text-muted mt-1">خصم 10% | استخدام 142/200</p>
                </div>
                <Badge variant="active" className="bg-brand-soft text-ink [&>span]:bg-brand">فعال</Badge>
              </div>
            </div>
          </div>

          {/* Quick Review Banner */}
          <div className="blueprint rounded-3xl border border-line p-6 text-ink shadow-[0_16px_36px_-24px_rgba(10,11,10,0.18)]">
            <div className="flex items-center gap-2 text-xs font-bold text-brand mb-2">
              <StarIcon size={16} className="text-brand" />
              <span>تقييمات المتجر</span>
            </div>
            <h4 className="font-black text-base text-ink mb-1">متوسط تقييم 4.9 من 5</h4>
            <p className="text-xs text-muted leading-relaxed mb-4">
              تم تلقي 12 تقييم إيجابي جديد خلال الـ 24 ساعة الماضية.
            </p>
            <Link href="/admin/reviews">
              <Button variant="secondary" size="xs" className="w-full text-xs hover:bg-brand hover:text-white">
                مراجعة التقييمات والتعليقات
              </Button>
            </Link>
          </div>
        </div>
      </div>
    </div>
  );
}
