import Link from "next/link";
import { Navbar } from "@/shared/components/Navbar";
import { Footer } from "@/shared/components/Footer";
import { Button } from "@/shared/components/Button";
import { STATIC_CART } from "@/shared/data/mock-data";
import { formatPrice } from "@/shared/utils";
import { Delete01Icon, Ticket01Icon } from "hugeicons-react";

export default function CartPage() {
  const items = STATIC_CART;

  const subtotal = items.reduce(
    (sum, item) => sum + Number(item.total_item_price),
    0,
  );
  const shipping = subtotal > 100 ? 0 : 15;
  const total = Math.max(0, subtotal + shipping);

  return (
    <PageShell>
      <main className="shell flex-1 py-10 sm:py-14">
        <div className="mb-9">
          <span className="eyebrow flex items-center gap-2 text-brand">
            <span className="size-1.5 rounded-full bg-signal" />
            YOUR CART / 01
          </span>
          <h1 className="mt-2 text-[28px] font-black leading-tight tracking-[-0.03em] text-ink sm:text-[36px]">
            سلة المشتريات ({items.length} منتجات)
          </h1>
        </div>
        {items.length === 0 ? (
          <EmptyState title="سلة المشتريات فارغة" action={<Link href="/products" className="text-[13px] font-bold text-brand underline decoration-brand/40 underline-offset-4 hover:text-brand-deep">تصفح المنتجات</Link>} />
        ) : (
          <div className="grid grid-cols-1 items-start gap-6 lg:grid-cols-12 lg:gap-8">
            <div className="surface divide-y divide-line p-2 shadow-[0_2px_16px_rgba(10,11,10,0.05)] sm:p-3 lg:col-span-8">
              {items.map((item) => (
                <div key={item.cart_item_id} className="flex flex-wrap items-center gap-4 px-3 py-5 sm:px-4">
                  <img
                    src={item.product_image}
                    alt={item.product_name}
                    className="size-20 rounded-2xl border border-line bg-paper object-contain p-2"
                  />
                  <div className="min-w-40 flex-1">
                    <h2 className="text-[14px] font-black text-ink">{item.product_name}</h2>
                    <p className="font-latin mt-1 text-xs text-muted">{formatPrice(Number(item.product_price))}</p>
                  </div>
                  <div className="flex items-center overflow-hidden rounded-xl border border-line bg-paper">
                    <button type="button" className="size-8 text-base text-ink transition-colors hover:bg-brand-soft hover:text-brand">−</button>
                    <span className="font-latin w-8 text-center text-[13px] font-bold text-ink">{item.quantity}</span>
                    <button type="button" className="size-8 text-base text-ink transition-colors hover:bg-brand-soft hover:text-brand">+</button>
                  </div>
                  <strong className="font-latin w-24 text-end text-[15px] font-black text-ink">{formatPrice(Number(item.total_item_price))}</strong>
                  <button type="button" className="grid size-9 place-items-center rounded-xl text-sale transition-colors hover:bg-sale/10" aria-label="حذف المنتج">
                    <Delete01Icon size={16} />
                  </button>
                </div>
              ))}
            </div>
            <aside className="space-y-5 lg:col-span-4">
              <div className="coupon-edge border border-line bg-surface p-5 shadow-[0_2px_16px_rgba(10,11,10,0.05)]">
                <form className="space-y-3">
                  <div className="h-0.5 w-8 rounded-full bg-signal" />
                  <label className="flex items-center gap-2 text-[13px] font-black text-ink"><Ticket01Icon size={16} className="text-brand" />هل لديك كوبون؟</label>
                  <div className="flex gap-2">
                    <input className="h-11 min-w-0 flex-1 rounded-xl border border-line bg-paper px-3 font-latin text-xs text-ink outline-none placeholder:text-muted focus:border-brand focus:bg-surface" placeholder="رمز الكوبون" />
                    <Button type="button" variant="outline" size="sm">تطبيق</Button>
                  </div>
                </form>
              </div>
              <div className="surface space-y-4 p-6 shadow-[0_2px_16px_rgba(10,11,10,0.05)]">
                <div className="border-b border-line pb-4">
                  <span className="eyebrow flex items-center gap-2 text-brand">
                    <span className="size-1.5 rounded-full bg-signal" />
                    ORDER SUMMARY
                  </span>
                  <h2 className="mt-1.5 text-xl font-black tracking-tight text-ink">ملخص الطلب</h2>
                </div>
                <div className="space-y-3 text-[13px]">
                  <div className="flex justify-between text-muted"><span>المجموع الفرعي</span><strong className="font-latin font-bold text-ink">{formatPrice(subtotal)}</strong></div>
                  <div className="flex justify-between text-muted"><span>الشحن</span><strong className="font-latin font-bold text-ink">{shipping === 0 ? "مجاني" : formatPrice(shipping)}</strong></div>
                </div>
                <div className="flex items-end justify-between border-t border-line pt-4">
                  <span className="text-sm font-black text-ink">الإجمالي</span>
                  <strong className="font-latin text-[30px] font-black leading-none tracking-[-0.04em] text-brand-deep sm:text-[34px]">{formatPrice(total)}</strong>
                </div>
                <Link href="/checkout" className="liquid-glass-btn flex h-12 items-center justify-center rounded-xl text-[13px] font-bold">متابعة الشراء</Link>
              </div>
            </aside>
          </div>
        )}
      </main>
    </PageShell>
  );
}

function PageShell({ children }: { children: React.ReactNode }) {
  return <div className="flex min-h-screen flex-col bg-paper"><Navbar />{children}<Footer /></div>;
}

function EmptyState({ title, action }: { title: string; action: React.ReactNode }) {
  return <div className="shell flex-1 py-24 text-center"><p className="mb-3 text-lg font-black text-ink">{title}</p>{action}</div>;
}
