import { use } from "react";
import Link from "next/link";
import { Navbar } from "@/shared/components/Navbar";
import { Footer } from "@/shared/components/Footer";
import { Button } from "@/shared/components/Button";
import { STATIC_ORDERS } from "@/shared/data/mock-data";
import { formatPrice } from "@/shared/utils";
import { CreditCardIcon, CheckmarkCircle01Icon } from "hugeicons-react";

export default function CheckoutPaymentPage({
  searchParams,
}: {
  searchParams: Promise<{ orderId?: string }>;
}) {
  const { orderId } = use(searchParams);

  const order =
    STATIC_ORDERS.find((o) => o.order_id === orderId) || STATIC_ORDERS[0];

  return (
    <Shell>
      <main className="flex-1 w-full max-w-6xl mx-auto px-4 py-10 space-y-6">
        <h1 className="text-2xl sm:text-3xl font-black">إتمام الدفع بالبطاقة</h1>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 items-start">
          <section className="bg-white border rounded-3xl p-6 space-y-4 shadow-sm">
            <h2 className="font-black text-lg">ملخص الطلب</h2>
            <div className="text-xs text-[#64748B]">
              رقم الطلب: <strong>{order.order_number}</strong>
            </div>
            {order.items && (
              <ul className="divide-y divide-black/5">
                {order.items.map((item) => (
                  <li
                    key={item.order_item_id}
                    className="py-2.5 flex justify-between gap-3 text-xs"
                  >
                    <div>
                      <strong className="block text-sm">
                        {item.product_name || "منتج"}
                      </strong>
                      <span className="text-[#94A3B8]">
                        الكمية: {item.quantity} × {formatPrice(Number(item.unit_price))}
                      </span>
                    </div>
                    <strong className="whitespace-nowrap">
                      {formatPrice(Number(item.subtotal))}
                    </strong>
                  </li>
                ))}
              </ul>
            )}
            <div className="border-t pt-3 space-y-1.5 text-xs">
              <div className="flex justify-between">
                <span>المجموع</span>
                <strong>{formatPrice(Number(order.subtotal))}</strong>
              </div>
              {Number(order.discount_amount) > 0 && (
                <div className="flex justify-between text-green-600">
                  <span>الخصم</span>
                  <strong>-{formatPrice(Number(order.discount_amount))}</strong>
                </div>
              )}
              <div className="flex justify-between">
                <span>الشحن</span>
                <strong>{formatPrice(Number(order.shipping_fee))}</strong>
              </div>
              <div className="flex justify-between font-black pt-2 text-sm">
                <span>الإجمالي المستحق</span>
                <strong>{formatPrice(Number(order.total_amount))}</strong>
              </div>
            </div>
          </section>

          <section className="bg-white border rounded-3xl p-6 space-y-5 shadow-sm">
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 rounded-xl bg-blue-50 text-blue-600 flex items-center justify-center">
                <CreditCardIcon size={20} />
              </div>
              <div>
                <h2 className="font-black text-lg">بوابة الدفع الآمنة</h2>
                <p className="text-xs text-[#64748B]">دفع إلكتروني فوري ومحمي</p>
              </div>
            </div>

            <div className="space-y-4">
              <div>
                <label className="block text-xs font-bold text-[#475569] mb-1">
                  رقم البطاقة
                </label>
                <input
                  type="text"
                  placeholder="4242 •••• •••• 4242"
                  defaultValue="4242 4242 4242 4242"
                  className="w-full px-4 py-2.5 border rounded-xl text-sm font-mono"
                />
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block text-xs font-bold text-[#475569] mb-1">
                    تاريخ الانتهاء
                  </label>
                  <input
                    type="text"
                    placeholder="MM/YY"
                    defaultValue="12/28"
                    className="w-full px-4 py-2.5 border rounded-xl text-sm font-mono text-center"
                  />
                </div>
                <div>
                  <label className="block text-xs font-bold text-[#475569] mb-1">
                    رمز الأمان CVC
                  </label>
                  <input
                    type="text"
                    placeholder="CVC"
                    defaultValue="123"
                    className="w-full px-4 py-2.5 border rounded-xl text-sm font-mono text-center"
                  />
                </div>
              </div>
            </div>

            <Button
              type="button"
              variant="primary"
              size="lg"
              className="w-full gap-2"
            >
              <CheckmarkCircle01Icon size={18} />
              <span>دفع {formatPrice(Number(order.total_amount))}</span>
            </Button>

            <div className="flex justify-between items-center pt-2">
              <Link href="/account" className="text-xs text-[#2B7BD4] underline">
                العودة لحسابي
              </Link>
              <Link
                href="/account"
                className="text-xs text-[#EF4444] font-medium"
              >
                إلغاء الطلب
              </Link>
            </div>
          </section>
        </div>
      </main>
    </Shell>
  );
}

function Shell({ children }: { children: React.ReactNode }) {
  return (
    <div className="min-h-screen flex flex-col bg-[#F8FAFC]">
      <Navbar />
      {children}
      <Footer />
    </div>
  );
}
