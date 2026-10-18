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
      <main className="flex-1 max-w-7xl w-full mx-auto px-4 sm:px-6 lg:px-8 py-10">
        <h1 className="text-2xl sm:text-3xl font-black text-[#1A1D2A] mb-8">
          سلة المشتريات ({items.length} منتجات)
        </h1>
        {items.length === 0 ? (
          <EmptyState title="سلة المشتريات فارغة" action={<Link href="/products" className="text-[#2B7BD4] underline">تصفح المنتجات</Link>} />
        ) : (
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">
            <div className="lg:col-span-8 bg-white p-6 rounded-3xl border border-black/8 shadow-sm divide-y divide-black/5">
              {items.map((item) => (
                <div key={item.cart_item_id} className="py-4 first:pt-0 last:pb-0 flex flex-wrap items-center gap-4">
                  <img
                    src={item.product_image}
                    alt={item.product_name}
                    className="w-20 h-20 rounded-xl object-contain p-1 bg-[#F1F5F9]"
                  />
                  <div className="flex-1 min-w-40">
                    <h2 className="font-bold text-sm">{item.product_name}</h2>
                    <p className="text-xs text-[#64748B]">{formatPrice(Number(item.product_price))}</p>
                  </div>
                  <div className="flex items-center border rounded-xl overflow-hidden">
                    <button type="button" className="w-8 h-8">−</button>
                    <span className="w-8 text-center text-xs">{item.quantity}</span>
                    <button type="button" className="w-8 h-8">+</button>
                  </div>
                  <strong className="w-24 text-end text-sm">{formatPrice(Number(item.total_item_price))}</strong>
                  <button type="button" className="p-2 text-red-500" aria-label="حذف المنتج">
                    <Delete01Icon size={16} />
                  </button>
                </div>
              ))}
            </div>
            <aside className="lg:col-span-4 space-y-6">
              <div className="bg-white p-5 rounded-3xl border shadow-sm">
                <form className="space-y-3">
                  <label className="text-xs font-bold flex items-center gap-2"><Ticket01Icon size={16} />هل لديك كوبون؟</label>
                  <div className="flex gap-2">
                    <input className="min-w-0 flex-1 px-3 py-2 border rounded-xl text-xs" placeholder="رمز الكوبون" />
                    <Button type="button" variant="secondary" size="sm">تطبيق</Button>
                  </div>
                </form>
              </div>
              <div className="bg-white p-6 rounded-3xl border shadow-sm space-y-3 text-sm">
                <h2 className="font-black">ملخص الطلب</h2>
                <div className="flex justify-between"><span>المجموع الفرعي</span><strong>{formatPrice(subtotal)}</strong></div>
                <div className="flex justify-between"><span>الشحن</span><strong>{shipping === 0 ? "مجاني" : formatPrice(shipping)}</strong></div>
                <div className="pt-3 border-t flex justify-between font-black"><span>الإجمالي</span><strong>{formatPrice(total)}</strong></div>
                <Link href="/checkout" className="block text-center bg-[#2B7BD4] text-white rounded-xl py-3 font-bold text-sm">متابعة الشراء</Link>
              </div>
            </aside>
          </div>
        )}
      </main>
    </PageShell>
  );
}

function PageShell({ children }: { children: React.ReactNode }) {
  return <div className="min-h-screen flex flex-col bg-[#F8FAFC]"><Navbar />{children}<Footer /></div>;
}

function EmptyState({ title, action }: { title: string; action: React.ReactNode }) {
  return <div className="flex-1 max-w-7xl w-full mx-auto px-4 py-20 text-center"><p className="font-bold text-[#1A1D2A] mb-3">{title}</p>{action}</div>;
}
