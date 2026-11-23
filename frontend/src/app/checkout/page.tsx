import { Navbar } from "@/shared/components/Navbar";
import { Footer } from "@/shared/components/Footer";
import { Button } from "@/shared/components/Button";
import { STATIC_ADDRESSES, STATIC_CART } from "@/shared/data/mock-data";
import { formatPrice } from "@/shared/utils";

export default function CheckoutPage() {
  const addresses = STATIC_ADDRESSES;
  const selectedAddress = STATIC_ADDRESSES[0] || null;
  const items = STATIC_CART;

  const subtotal = items.reduce(
    (sum, item) => sum + Number(item.total_item_price),
    0,
  );
  const shipping = subtotal > 100 ? 0 : 15;

  return (
    <Shell>
      <main className="shell flex-1 py-10 sm:py-14">
        <div className="mb-9">
          <span className="eyebrow flex items-center gap-2 text-brand">
            <span className="size-1.5 rounded-full bg-signal" />
            CHECKOUT / 01
          </span>
          <h1 className="mt-2 text-[28px] font-black leading-tight tracking-[-0.03em] text-ink sm:text-[36px]">إتمام الطلب</h1>
        </div>
        {items.length === 0 ? (
          <div className="surface p-10 text-center text-sm font-bold text-ink">السلة فارغة.</div>
        ) : (
          <form className="grid grid-cols-1 items-start gap-6 lg:grid-cols-12 lg:gap-8">
            <section className="surface space-y-6 p-6 sm:p-8 lg:col-span-7">
              <div className="border-b border-line pb-5">
                <span className="eyebrow flex items-center gap-2 text-brand">
                  <span className="size-1.5 rounded-full bg-signal" />
                  DELIVERY DETAILS
                </span>
                <h2 className="mt-2 text-lg font-black tracking-tight text-ink">عنوان التوصيل</h2>
              </div>
              {addresses.length > 0 && (
                <fieldset className="space-y-3">
                  <legend className="mb-1 text-[12px] font-bold text-muted">اختر عنواناً محفوظاً</legend>
                  {addresses.map((savedAddress) => (
                    <label key={savedAddress.address_id} className="flex cursor-pointer items-start gap-3 rounded-2xl border border-line bg-paper p-4 text-[12px] leading-6 text-muted transition-colors has-checked:border-brand has-checked:bg-brand-soft">
                      <input
                        type="radio"
                        name="address"
                        defaultChecked={selectedAddress?.address_id === savedAddress.address_id}
                        className="mt-1 accent-brand"
                      />
                      <span><strong className="font-black text-ink">{savedAddress.label}</strong><br />{savedAddress.city}، {savedAddress.street}، {savedAddress.building}</span>
                    </label>
                  ))}
                </fieldset>
              )}
              <button type="button" className="text-[12px] font-bold text-brand underline decoration-brand/40 underline-offset-4 hover:text-brand-deep">إضافة عنوان جديد</button>
              <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
                <label className="block text-[12px] font-bold text-ink/80">
                  الاسم الكامل
                  <input defaultValue={selectedAddress?.full_name || ""} className="mt-1.5 h-11 w-full rounded-xl border border-line bg-paper px-3.5 text-[13px] font-normal text-ink outline-none transition-colors placeholder:text-muted focus:border-brand focus:bg-surface focus:ring-4 focus:ring-brand/10" />
                </label>
                <label className="block text-[12px] font-bold text-ink/80">
                  رقم الهاتف
                  <input defaultValue={selectedAddress?.phone || ""} className="mt-1.5 h-11 w-full rounded-xl border border-line bg-paper px-3.5 text-[13px] font-normal text-ink outline-none transition-colors placeholder:text-muted focus:border-brand focus:bg-surface focus:ring-4 focus:ring-brand/10" />
                </label>
                <label className="block text-[12px] font-bold text-ink/80">
                  الدولة
                  <input defaultValue={selectedAddress?.country || ""} className="mt-1.5 h-11 w-full rounded-xl border border-line bg-paper px-3.5 text-[13px] font-normal text-ink outline-none transition-colors placeholder:text-muted focus:border-brand focus:bg-surface focus:ring-4 focus:ring-brand/10" />
                </label>
                <label className="block text-[12px] font-bold text-ink/80">
                  المدينة
                  <input defaultValue={selectedAddress?.city || ""} className="mt-1.5 h-11 w-full rounded-xl border border-line bg-paper px-3.5 text-[13px] font-normal text-ink outline-none transition-colors placeholder:text-muted focus:border-brand focus:bg-surface focus:ring-4 focus:ring-brand/10" />
                </label>
                <label className="block text-[12px] font-bold text-ink/80">
                  الشارع
                  <input defaultValue={selectedAddress?.street || ""} className="mt-1.5 h-11 w-full rounded-xl border border-line bg-paper px-3.5 text-[13px] font-normal text-ink outline-none transition-colors placeholder:text-muted focus:border-brand focus:bg-surface focus:ring-4 focus:ring-brand/10" />
                </label>
                <label className="block text-[12px] font-bold text-ink/80">
                  المبنى
                  <input defaultValue={selectedAddress?.building || ""} className="mt-1.5 h-11 w-full rounded-xl border border-line bg-paper px-3.5 text-[13px] font-normal text-ink outline-none transition-colors placeholder:text-muted focus:border-brand focus:bg-surface focus:ring-4 focus:ring-brand/10" />
                </label>
              </div>
              <fieldset className="space-y-3 border-t border-line pt-6">
                <legend className="mb-1 px-1 text-[12px] font-bold text-muted">طريقة الدفع</legend>
                <label className="flex cursor-pointer items-center gap-3 rounded-2xl border border-line bg-paper p-4 text-[12px] font-semibold text-ink transition-colors has-checked:border-brand has-checked:bg-brand-soft">
                  <input type="radio" name="payment" defaultChecked className="accent-brand" />
                  الدفع عند الاستلام
                </label>
                <label className="flex cursor-pointer items-center gap-3 rounded-2xl border border-line bg-paper p-4 text-[12px] font-semibold text-ink transition-colors has-checked:border-brand has-checked:bg-brand-soft">
                  <input type="radio" name="payment" className="accent-brand" />
                  بطاقة ائتمانية (يتطلب إكمالاً عبر Stripe)
                </label>
              </fieldset>
            </section>
            <aside className="surface sticky top-6 space-y-5 p-6 sm:p-7 lg:col-span-5 lg:top-24">
              <div className="border-b border-line pb-4">
                <span className="eyebrow flex items-center gap-2 text-brand">
                  <span className="size-1.5 rounded-full bg-signal" />
                  ORDER SUMMARY
                </span>
                <h2 className="mt-1.5 text-xl font-black tracking-tight text-ink">ملخص الطلب</h2>
              </div>
              <div className="space-y-3 text-[13px]">
                <div className="flex justify-between text-muted"><span>المجموع</span><strong className="font-latin font-bold text-ink">{formatPrice(subtotal)}</strong></div>
                <div className="flex justify-between text-muted"><span>الشحن</span><strong className="font-latin font-bold text-ink">{shipping ? formatPrice(shipping) : "مجاني"}</strong></div>
              </div>
              <div className="flex items-end justify-between border-t border-line pt-4">
                <span className="text-sm font-black text-ink">الإجمالي</span>
                <strong className="font-latin text-[30px] font-black leading-none tracking-[-0.04em] text-brand-deep sm:text-[34px]">{formatPrice(Math.max(0, subtotal + shipping))}</strong>
              </div>
              <Button type="button" className="w-full">تأكيد الطلب</Button>
            </aside>
          </form>
        )}
      </main>
    </Shell>
  );
}
function Shell({ children }: { children: React.ReactNode }) { return <div className="flex min-h-screen flex-col bg-paper"><Navbar />{children}<Footer /></div>; }
