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
      <main className="shell flex-1 space-y-7 py-10 sm:py-14">
        <div>
          <span className="eyebrow text-brand">SECURE PAYMENT / 02</span>
          <h1 className="mt-2 text-[28px] font-black leading-tight tracking-[-0.03em] text-ink sm:text-[36px]">إتمام الدفع بالبطاقة</h1>
        </div>

        <div className="grid grid-cols-1 items-start gap-6 lg:grid-cols-2">
          <section className="overflow-hidden rounded-[28px] border border-line bg-surface shadow-[0_10px_36px_rgba(10,11,10,0.06)]">
            <div className="blueprint border-b border-line px-6 py-6 text-ink">
              <span className="eyebrow flex items-center gap-2 text-brand">
                <span className="size-1.5 rounded-full bg-signal" />
                ORDER SUMMARY
              </span>
              <h2 className="mt-2 text-xl font-black tracking-tight text-ink">ملخص الطلب</h2>
              <div className="mt-2 text-[11px] text-muted">
                رقم الطلب: <strong className="font-latin font-black text-ink underline decoration-signal decoration-2 underline-offset-4">{order.order_number}</strong>
              </div>
            </div>
            <div className="space-y-5 p-6">
              {order.items && (
                <ul className="divide-y divide-line">
                  {order.items.map((item) => (
                    <li
                      key={item.order_item_id}
                      className="flex justify-between gap-3 py-3 text-[12px]"
                    >
                      <div>
                        <strong className="block text-[13px] font-black text-ink">
                          {item.product_name || "منتج"}
                        </strong>
                        <span className="mt-1 block text-muted">
                          الكمية: <span className="font-latin">{item.quantity} × {formatPrice(Number(item.unit_price))}</span>
                        </span>
                      </div>
                      <strong className="font-latin whitespace-nowrap font-black text-ink">
                        {formatPrice(Number(item.subtotal))}
                      </strong>
                    </li>
                  ))}
                </ul>
              )}
              <div className="space-y-2 border-t border-line pt-4 text-[12px]">
                <div className="flex justify-between text-muted">
                  <span>المجموع</span>
                  <strong className="font-latin font-bold text-ink">{formatPrice(Number(order.subtotal))}</strong>
                </div>
                {Number(order.discount_amount) > 0 && (
                  <div className="flex justify-between text-brand-deep">
                    <span>الخصم</span>
                    <strong className="font-latin font-bold">-{formatPrice(Number(order.discount_amount))}</strong>
                  </div>
                )}
                <div className="flex justify-between text-muted">
                  <span>الشحن</span>
                  <strong className="font-latin font-bold text-ink">{formatPrice(Number(order.shipping_fee))}</strong>
                </div>
                <div className="flex items-end justify-between border-t border-line pt-4">
                  <span className="text-[13px] font-black text-ink">الإجمالي المستحق</span>
                  <strong className="font-latin text-2xl font-black leading-none tracking-[-0.03em] text-brand-deep">{formatPrice(Number(order.total_amount))}</strong>
                </div>
              </div>
            </div>
          </section>

          <section className="surface space-y-6 p-6 sm:p-7">
            <div className="flex items-center gap-3 border-b border-line pb-5">
              <div className="grid size-11 shrink-0 place-items-center rounded-2xl bg-ink text-white">
                <CreditCardIcon size={20} />
              </div>
              <div>
                <h2 className="text-lg font-black tracking-tight text-ink">بوابة الدفع الآمنة</h2>
                <p className="mt-1 text-[12px] text-muted">دفع إلكتروني فوري ومحمي</p>
              </div>
            </div>

            <div className="space-y-4">
              <div>
                <label className="mb-2 block text-[12px] font-bold text-ink/80">
                  رقم البطاقة
                </label>
                <input
                  type="text"
                  placeholder="4242 •••• •••• 4242"
                  defaultValue="4242 4242 4242 4242"
                  className="font-latin h-12 w-full rounded-xl border border-line bg-paper px-4 text-[13px] tracking-[0.06em] text-ink outline-none transition-colors placeholder:text-muted focus:border-brand focus:bg-surface focus:ring-4 focus:ring-brand/10"
                />
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="mb-2 block text-[12px] font-bold text-ink/80">
                    تاريخ الانتهاء
                  </label>
                  <input
                    type="text"
                    placeholder="MM/YY"
                    defaultValue="12/28"
                    className="font-latin h-12 w-full rounded-xl border border-line bg-paper px-4 text-center text-[13px] tracking-[0.06em] text-ink outline-none transition-colors placeholder:text-muted focus:border-brand focus:bg-surface focus:ring-4 focus:ring-brand/10"
                  />
                </div>
                <div>
                  <label className="mb-2 block text-[12px] font-bold text-ink/80">
                    رمز الأمان CVC
                  </label>
                  <input
                    type="text"
                    placeholder="CVC"
                    defaultValue="123"
                    className="font-latin h-12 w-full rounded-xl border border-line bg-paper px-4 text-center text-[13px] tracking-[0.06em] text-ink outline-none transition-colors placeholder:text-muted focus:border-brand focus:bg-surface focus:ring-4 focus:ring-brand/10"
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

            <div className="flex flex-wrap items-center justify-between gap-3 border-t border-line pt-4">
              <Link href="/account" className="text-[12px] font-bold text-brand underline decoration-brand/40 underline-offset-4 hover:text-brand-deep">
                العودة لحسابي
              </Link>
              <Link
                href="/account"
                className="text-[12px] font-bold text-sale underline decoration-sale/40 underline-offset-4 hover:text-sale/80"
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
    <div className="flex min-h-screen flex-col bg-paper">
      <Navbar />
      {children}
      <Footer />
    </div>
  );
}
