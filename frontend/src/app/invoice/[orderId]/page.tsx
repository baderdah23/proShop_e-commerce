"use client";

import { use, useEffect, useState } from "react";
import Link from "next/link";
import { Navbar } from "@/shared/components/Navbar";
import { Footer } from "@/shared/components/Footer";
import { Button } from "@/shared/components/Button";
import { useAuth } from "@/features/auth";
import { OrdersApi } from "@/lib/api-client";
import type { Order } from "@/shared/types";
import { formatPrice } from "@/shared/utils";

interface InvoiceData {
  invoiceNumber: string;
  createdAt: string;
  order: Order;
  payment: { method: string; status: string } | null;
}

const statusLabels: Record<string, string> = {
  pending: "قيد الانتظار",
  processing: "قيد التجهيز",
  shipped: "تم الشحن",
  delivered: "تم التسليم",
  cancelled: "ملغي",
};

const paymentLabels: Record<string, string> = {
  credit_card: "بطاقة ائتمانية",
  cash_on_delivery: "الدفع عند الاستلام",
};

const paymentStatusLabels: Record<string, string> = {
  pending: "قيد المعالجة",
  succeeded: "مدفوع",
  failed: "فشل الدفع",
  cancelled: "ملغي",
};

export default function InvoicePage({ params }: { params: Promise<{ orderId: string }> }) {
  const { user } = useAuth();
  const { orderId } = use(params);
  const [invoice, setInvoice] = useState<InvoiceData | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    if (!orderId) return;
    OrdersApi.getInvoice(orderId)
      .then(setInvoice)
      .catch((loadError) => setError(loadError instanceof Error ? loadError.message : "تعذر تحميل الفاتورة."))
      .finally(() => setIsLoading(false));
  }, [orderId, user]);

  if (!user) return <Shell><div className="flex-1 flex items-center justify-center font-bold">يجب تسجيل الدخول أولاً.</div></Shell>;

  return (
    <Shell>
      <main className="flex-1 w-full max-w-4xl mx-auto px-4 py-10">
        <div className="print:hidden flex items-center justify-between mb-6">
          <Button type="button" onClick={() => window.print()}>طباعة الفاتورة</Button>
          <Link href="/account" className="text-sm font-bold text-[#2B7BD4] underline">العودة لحسابي</Link>
        </div>

        {isLoading && <div className="bg-white border rounded-3xl p-10 flex justify-center"><div className="w-8 h-8 border-2 border-[#6AABF0] border-t-transparent rounded-full animate-spin" /></div>}

        {!isLoading && error && <div className="bg-white border rounded-3xl p-8"><p className="font-bold text-red-600">{error}</p></div>}

        {!isLoading && !error && invoice && <InvoiceDoc invoice={invoice} />}
      </main>
    </Shell>
  );
}

function InvoiceDoc({ invoice }: { invoice: InvoiceData }) {
  const { order } = invoice;
  const items = order.items || [];
  return (
    <div className="bg-white border rounded-3xl p-6 sm:p-10 print:rounded-none print:border-0 print:p-0">
      <header className="flex flex-wrap items-start justify-between gap-4 border-b pb-6">
        <div>
          <h1 className="text-2xl font-black">برو ستور</h1>
          <p className="text-sm text-[#64748B] mt-1">× {invoice.invoiceNumber}</p>
        </div>
        <div className="text-left">
          <p className="text-sm font-bold">فاتورة</p>
          <p className="text-xs text-[#64748B]">التاريخ: {new Date(createdAt(invoice.createdAt)).toLocaleDateString("ar")}</p>
        </div>
      </header>

      <div className="grid grid-cols-1 sm:grid-cols-2 gap-6 py-6 text-sm">
        <div>
          <p className="font-black mb-2">معلومات العميل</p>
          <p className="text-[#475569]">{order.customer_name || order.full_name}</p>
          <p className="text-[#475569]" dir="ltr">{order.phone || "—"}</p>
          <p className="text-[#475569]">{[order.city, order.street, order.building, order.country].filter(Boolean).join("، ")}</p>
        </div>
        <div>
          <p className="font-black mb-2">معلومات الطلب</p>
          <p className="text-[#475569]">رقم الطلب: <strong>{order.order_number}</strong></p>
          <p className="text-[#475569]">الحالة: <strong>{statusLabels[order.status] || order.status}</strong></p>
          {invoice.payment && (
            <p className="text-[#475569]">الدفع: <strong>{paymentLabels[invoice.payment.method] || invoice.payment.method}</strong> — {paymentStatusLabels[invoice.payment.status] || invoice.payment.status}</p>
          )}
        </div>
      </div>

      <table className="w-full text-sm">
        <thead>
          <tr className="border-b text-start text-[#64748B] text-xs">
            <th className="py-2 text-start">المنتج</th>
            <th className="py-2 text-start">رمز المنتج</th>
            <th className="py-2 text-start">الكمية</th>
            <th className="py-2 text-start">سعر الوحدة</th>
            <th className="py-2 text-start">الإجمالي</th>
          </tr>
        </thead>
        <tbody className="divide-y divide-black/5">
          {items.map((item) => (
            <tr key={item.order_item_id}>
              <td className="py-3">{item.product_name || "منتج"}</td>
              <td className="py-3 text-[#64748B]">{item.product_sku || "—"}</td>
              <td className="py-3">{item.quantity}</td>
              <td className="py-3">{formatPrice(Number(item.unit_price))}</td>
              <td className="py-3 font-bold">{formatPrice(Number(item.subtotal))}</td>
            </tr>
          ))}
        </tbody>
      </table>

      <div className="space-y-1.5 text-sm ms-auto w-full sm:w-72 py-6">
        <div className="flex justify-between"><span className="text-[#64748B]">المجموع الفرعي</span><strong>{formatPrice(Number(order.subtotal))}</strong></div>
        {Number(order.discount_amount) > 0 && (
          <div className="flex justify-between text-green-600">
            <span className="text-[#64748B]">الخصم</span>
            <strong>-{formatPrice(Number(order.discount_amount))}</strong>
          </div>
        )}
        <div className="flex justify-between"><span className="text-[#64748B]">الشحن</span><strong>{formatPrice(Number(order.shipping_fee))}</strong></div>
        <div className="flex justify-between border-t pt-2 text-base font-black"><span>الإجمالي</span><strong>{formatPrice(Number(order.total_amount))}</strong></div>
      </div>

      <footer className="border-t pt-5 text-center text-xs text-[#94A3B8]">
        <p>شكراً لثقتك ببرو ستور — للمساعدة تواصل معنا على دعم العملاء.</p>
      </footer>
    </div>
  );
}

function createdAt(date: string | Date) { return typeof date === "string" ? new Date(date) : date; }
function Shell({ children }: { children: React.ReactNode }) { return <div className="min-h-screen flex flex-col bg-[#F8FAFC]"><Navbar />{children}<Footer /></div>; }