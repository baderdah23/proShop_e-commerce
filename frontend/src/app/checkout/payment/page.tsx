"use client";

import { use, useEffect, useRef, useState } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { Navbar } from "@/shared/components/Navbar";
import { Footer } from "@/shared/components/Footer";
import { Button } from "@/shared/components/Button";
import { useAuth } from "@/features/auth";
import { OrdersApi, PaymentsApi } from "@/lib/api-client";
import type { Order } from "@/shared/types";
import { formatPrice } from "@/shared/utils";
import { toast } from "sonner";
import { StripeCheckoutPayment } from "../StripeCheckoutPayment";

interface InvoiceData {
  invoiceNumber: string;
  createdAt: string;
  order: Order;
  payment: { method: string; status: string } | null;
}

export default function CheckoutPaymentPage({
  searchParams,
}: {
  searchParams: Promise<{ orderId?: string }>;
}) {
  const router = useRouter();
  const { user } = useAuth();
  const { orderId } = use(searchParams);
  const [invoice, setInvoice] = useState<InvoiceData | null>(null);
  const [clientSecret, setClientSecret] = useState<string | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [isCancelling, setIsCancelling] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const startedRef = useRef(false);

  useEffect(() => {
    if (!user || !orderId) {
      return;
    }
    if (startedRef.current) {
      return;
    }
    startedRef.current = true;

    const load = async () => {
      try {
        const invoiceData = await OrdersApi.getInvoice(orderId);
        setInvoice(invoiceData);
        if (invoiceData.order.status !== "pending") {
          setError("هذا الطلب اكتمل أو أُلغي بالفعل.");
          return;
        }
        const paymentResult = await PaymentsApi.process(orderId, "credit_card");
        if (!paymentResult.clientSecret) {
          setError("لم يتم إنشاء جلسة الدفع — تأكد من إعداد مفاتيح Stripe.");
          return;
        }
        setClientSecret(paymentResult.clientSecret);
      } catch (loadError) {
        setError(loadError instanceof Error ? loadError.message : "تعذر تحميل بيانات الدفع.");
      } finally {
        setIsLoading(false);
      }
    };
    load();
  }, [orderId, user]);

  const cancelOrder = async () => {
    if (!orderId) {
      return;
    }
    setIsCancelling(true);
    try {
      await PaymentsApi.cancel(orderId);
      toast.success("تم إلغاء الطلب وتحرير المخزون.");
      router.push("/account");
    } catch (cancelError) {
      toast.error(cancelError instanceof Error ? cancelError.message : "تعذر إلغاء الطلب.");
      setIsCancelling(false);
    }
  };

  if (!user) return <Shell><div className="flex-1 flex items-center justify-center font-bold">يجب تسجيل الدخول أولاً.</div></Shell>;

  if (!orderId) {
    return (
      <Shell>
        <main className="flex-1 w-full max-w-xl mx-auto px-4 py-10">
          <div className="bg-white border rounded-3xl p-8 space-y-4">
            <p className="font-bold text-red-600">رابط الدفع غير صالح.</p>
            <Link href="/account" className="underline text-[#2B7BD4] text-sm font-bold">العودة لحسابي</Link>
          </div>
        </main>
      </Shell>
    );
  }

  return (
    <Shell>
      <main className="flex-1 w-full max-w-6xl mx-auto px-4 py-10 space-y-6">
        <h1 className="text-2xl sm:text-3xl font-black">إتمام الدفع بالبطاقة</h1>

        {isLoading && <Loading />}

        {!isLoading && error && (
          <div className="bg-white border rounded-3xl p-8 space-y-4 max-w-xl">
            <p className="font-bold text-red-600">{error}</p>
            <div className="flex gap-3">
              <Link href="/account" className="underline text-[#2B7BD4] text-sm font-bold">العودة لحسابي</Link>
              {invoice?.order.status === "pending" && (
                <Button type="button" variant="secondary" size="sm" isLoading={isCancelling} onClick={cancelOrder}>
                  إلغاء الطلب
                </Button>
              )}
            </div>
          </div>
        )}

        {!isLoading && !error && invoice && (
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 items-start">
            <section className="bg-white border rounded-3xl p-6 space-y-4">
              <h2 className="font-black">ملخص الطلب</h2>
              <div className="text-xs text-[#64748B]">رقم الطلب: <strong>{invoice.order.order_number}</strong></div>
              {invoice.order.items && (
                <ul className="divide-y divide-black/5">
                  {invoice.order.items.map((item) => (
                    <li key={item.order_item_id} className="py-2.5 flex justify-between gap-3 text-xs">
                      <div>
                        <strong className="block text-sm">{item.product_name || "منتج"}</strong>
                        <span className="text-[#94A3B8]">الكمية: {item.quantity} × {formatPrice(Number(item.unit_price))}</span>
                      </div>
                      <strong className="whitespace-nowrap">{formatPrice(Number(item.subtotal))}</strong>
                    </li>
                  ))}
                </ul>
              )}
              <div className="border-t pt-3 space-y-1.5 text-xs">
                <div className="flex justify-between"><span>المجموع</span><strong>{formatPrice(Number(invoice.order.subtotal))}</strong></div>
                {Number(invoice.order.discount_amount) > 0 && (
                  <div className="flex justify-between text-green-600"><span>الخصم</span><strong>-{formatPrice(Number(invoice.order.discount_amount))}</strong></div>
                )}
                <div className="flex justify-between"><span>الشحن</span><strong>{formatPrice(Number(invoice.order.shipping_fee))}</strong></div>
                <div className="flex justify-between font-black pt-2"><span>الإجمالي المستحق</span><strong>{formatPrice(Number(invoice.order.total_amount))}</strong></div>
              </div>
            </section>

            <section className="bg-white border rounded-3xl p-6 space-y-4">
              <h2 className="font-black">بيانات البطاقة</h2>
              {clientSecret ? (
                <StripeCheckoutPayment
                  clientSecret={clientSecret}
                  onSuccess={() => {
                    toast.success("تم الدفع بنجاح.");
                    router.push("/account");
                  }}
                />
              ) : (
                <Loading />
              )}
              <div className="flex justify-end">
                <Button type="button" variant="ghost" size="sm" isLoading={isCancelling} onClick={cancelOrder} className="cursor-pointer">
                  إلغاء الطلب والعودة
                </Button>
              </div>
            </section>
          </div>
        )}
      </main>
    </Shell>
  );
}

function Shell({ children }: { children: React.ReactNode }) { return <div className="min-h-screen flex flex-col bg-[#F8FAFC]"><Navbar />{children}<Footer /></div>; }
function Loading() { return <div className="flex-1 flex items-center justify-center py-20"><div className="w-8 h-8 border-2 border-[#6AABF0] border-t-transparent rounded-full animate-spin" /></div>; }