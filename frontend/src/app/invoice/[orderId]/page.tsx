import { use } from "react";
import Link from "next/link";
import { Navbar } from "@/shared/components/Navbar";
import { Footer } from "@/shared/components/Footer";
import { Button } from "@/shared/components/Button";
import { STATIC_ORDERS } from "@/shared/data/mock-data";
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
  const { orderId } = use(params);

  const foundOrder =
    STATIC_ORDERS.find((o) => o.order_id === orderId) || STATIC_ORDERS[0];
  const invoice: InvoiceData | null = foundOrder
    ? {
        invoiceNumber: `INV-${foundOrder.order_number}`,
        createdAt: foundOrder.created_at || new Date().toISOString(),
        order: foundOrder,
        payment: { method: "credit_card", status: "succeeded" },
      }
    : null;

  return (
    <Shell>
      <main className="shell flex-1 py-10 sm:py-14">
        <div className="print:hidden mb-6 flex flex-wrap items-center justify-between gap-4 rounded-2xl border border-line bg-surface p-4">
          <Button type="button">طباعة الفاتورة</Button>
          <Link href="/account" className="text-[13px] font-bold text-brand underline decoration-brand/40 underline-offset-4 hover:text-brand-deep">العودة لحسابي</Link>
        </div>

        {invoice && <InvoiceDoc invoice={invoice} />}
      </main>
    </Shell>
  );
}

function InvoiceDoc({ invoice }: { invoice: InvoiceData }) {
  const { order } = invoice;
  const items = order.items || [];
  return (
    <div className="rounded-[28px] border border-line bg-surface p-6 shadow-[0_10px_40px_rgba(10,11,10,0.06)] sm:p-10 print:rounded-none print:border-0 print:p-0 print:shadow-none">
      <header className="flex flex-wrap items-start justify-between gap-5 border-b border-line pb-7">
        <div>
          <span className="eyebrow flex items-center gap-2 text-brand">
            <span className="size-1.5 rounded-full bg-signal" />
            PROSTORE / INVOICE
          </span>
          <h1 className="mt-2 text-[26px] font-black tracking-tight text-ink">برو ستور</h1>
          <span className="mt-3 block h-0.5 w-10 rounded-full bg-signal" />
          <p className="font-latin mt-1 text-xs text-muted">× {invoice.invoiceNumber}</p>
        </div>
        <div className="text-end">
          <p className="text-sm font-black text-ink">فاتورة</p>
          <p className="mt-1 text-[11px] text-muted">التاريخ: {new Date(createdAt(invoice.createdAt)).toLocaleDateString("ar")}</p>
        </div>
      </header>

      <div className="grid grid-cols-1 gap-4 py-7 sm:grid-cols-2 sm:gap-6">
        <div className="rounded-2xl border border-line bg-paper p-4 text-[13px] leading-6">
          <p className="eyebrow mb-3 text-brand">معلومات العميل</p>
          <p className="font-bold text-ink">{order.customer_name || order.full_name}</p>
          <p className="font-latin text-muted" dir="ltr">{order.phone || "—"}</p>
          <p className="text-muted">{[order.city, order.street, order.building, order.country].filter(Boolean).join("، ")}</p>
        </div>
        <div className="rounded-2xl border border-line bg-paper p-4 text-[13px] leading-6">
          <p className="eyebrow mb-3 text-brand">معلومات الطلب</p>
          <p className="text-muted">رقم الطلب: <strong className="font-latin font-black text-ink">{order.order_number}</strong></p>
          <p className="text-muted">الحالة: <strong className="font-black text-ink">{statusLabels[order.status] || order.status}</strong></p>
          {invoice.payment && (
            <p className="text-muted">الدفع: <strong className="font-black text-ink">{paymentLabels[invoice.payment.method] || invoice.payment.method}</strong> — {paymentStatusLabels[invoice.payment.status] || invoice.payment.status}</p>
          )}
        </div>
      </div>

      <table className="w-full text-[13px]">
        <thead>
          <tr className="border-y border-line bg-paper text-[11px] font-bold text-muted">
            <th className="px-2 py-3 text-start first:ps-3">المنتج</th>
            <th className="px-2 py-3 text-start">رمز المنتج</th>
            <th className="px-2 py-3 text-start">الكمية</th>
            <th className="px-2 py-3 text-start">سعر الوحدة</th>
            <th className="px-2 py-3 text-start last:pe-3">الإجمالي</th>
          </tr>
        </thead>
        <tbody className="divide-y divide-line">
          {items.map((item) => (
            <tr key={item.order_item_id}>
              <td className="px-2 py-3 font-semibold text-ink first:ps-3">{item.product_name || "منتج"}</td>
              <td className="font-latin px-2 py-3 text-muted">{item.product_sku || "—"}</td>
              <td className="font-latin px-2 py-3 text-ink">{item.quantity}</td>
              <td className="font-latin px-2 py-3 text-ink">{formatPrice(Number(item.unit_price))}</td>
              <td className="font-latin px-2 py-3 font-black text-ink last:pe-3">{formatPrice(Number(item.subtotal))}</td>
            </tr>
          ))}
        </tbody>
      </table>

      <div className="ms-auto w-full space-y-2 py-7 text-[13px] sm:w-80">
        <div className="rounded-2xl border border-line bg-paper p-5">
          <div className="flex justify-between"><span className="text-muted">المجموع الفرعي</span><strong className="font-latin font-bold text-ink">{formatPrice(Number(order.subtotal))}</strong></div>
          {Number(order.discount_amount) > 0 && (
            <div className="mt-2 flex justify-between text-brand-deep">
              <span className="text-muted">الخصم</span>
              <strong className="font-latin font-bold">-{formatPrice(Number(order.discount_amount))}</strong>
            </div>
          )}
          <div className="mt-2 flex justify-between"><span className="text-muted">الشحن</span><strong className="font-latin font-bold text-ink">{formatPrice(Number(order.shipping_fee))}</strong></div>
          <div className="mt-4 flex items-end justify-between border-t border-line pt-4">
            <span className="text-sm font-black text-ink">الإجمالي</span>
            <strong className="font-latin text-2xl font-black leading-none tracking-[-0.03em] text-brand-deep">{formatPrice(Number(order.total_amount))}</strong>
          </div>
        </div>
      </div>

      <footer className="border-t border-line pt-5 text-center text-[11px] text-muted">
        <p>شكراً لثقتك ببرو ستور — للمساعدة تواصل معنا على دعم العملاء.</p>
      </footer>
    </div>
  );
}

function createdAt(date: string | Date) { return typeof date === "string" ? new Date(date) : date; }
function Shell({ children }: { children: React.ReactNode }) { return <div className="flex min-h-screen flex-col bg-paper"><Navbar />{children}<Footer /></div>; }
