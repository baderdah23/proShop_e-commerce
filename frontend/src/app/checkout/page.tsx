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
      <main className="flex-1 max-w-5xl w-full mx-auto px-4 py-10">
        <h1 className="text-2xl sm:text-3xl font-black mb-8">إتمام الطلب</h1>
        {items.length === 0 ? (
          <div className="bg-white border rounded-3xl p-10 text-center font-bold">السلة فارغة.</div>
        ) : (
          <form className="grid grid-cols-1 lg:grid-cols-5 gap-8">
            <section className="lg:col-span-3 bg-white rounded-3xl border p-6 space-y-4">
              <h2 className="font-black">عنوان التوصيل</h2>
              {addresses.length > 0 && (
                <fieldset className="space-y-2">
                  <legend className="text-xs font-bold">اختر عنواناً محفوظاً</legend>
                  {addresses.map((savedAddress) => (
                    <label key={savedAddress.address_id} className="flex items-start gap-2 text-xs border rounded-xl p-3 cursor-pointer">
                      <input
                        type="radio"
                        name="address"
                        defaultChecked={selectedAddress?.address_id === savedAddress.address_id}
                      />
                      <span><strong>{savedAddress.label}</strong><br />{savedAddress.city}، {savedAddress.street}، {savedAddress.building}</span>
                    </label>
                  ))}
                </fieldset>
              )}
              <button type="button" className="text-sm text-[#2B7BD4] underline">إضافة عنوان جديد</button>
              <label className="block text-xs font-bold">
                الاسم الكامل
                <input defaultValue={selectedAddress?.full_name || ""} className="mt-1 w-full px-3 py-2.5 rounded-xl border text-sm font-normal" />
              </label>
              <label className="block text-xs font-bold">
                رقم الهاتف
                <input defaultValue={selectedAddress?.phone || ""} className="mt-1 w-full px-3 py-2.5 rounded-xl border text-sm font-normal" />
              </label>
              <label className="block text-xs font-bold">
                الدولة
                <input defaultValue={selectedAddress?.country || ""} className="mt-1 w-full px-3 py-2.5 rounded-xl border text-sm font-normal" />
              </label>
              <label className="block text-xs font-bold">
                المدينة
                <input defaultValue={selectedAddress?.city || ""} className="mt-1 w-full px-3 py-2.5 rounded-xl border text-sm font-normal" />
              </label>
              <label className="block text-xs font-bold">
                الشارع
                <input defaultValue={selectedAddress?.street || ""} className="mt-1 w-full px-3 py-2.5 rounded-xl border text-sm font-normal" />
              </label>
              <label className="block text-xs font-bold">
                المبنى
                <input defaultValue={selectedAddress?.building || ""} className="mt-1 w-full px-3 py-2.5 rounded-xl border text-sm font-normal" />
              </label>
              <fieldset className="space-y-2 pt-2">
                <legend className="text-xs font-bold">طريقة الدفع</legend>
                <label className="flex items-center gap-2 text-xs border rounded-xl p-3 cursor-pointer">
                  <input type="radio" name="payment" defaultChecked />
                  الدفع عند الاستلام
                </label>
                <label className="flex items-center gap-2 text-xs border rounded-xl p-3 cursor-pointer">
                  <input type="radio" name="payment" />
                  بطاقة ائتمانية (يتطلب إكمالاً عبر Stripe)
                </label>
              </fieldset>
            </section>
            <aside className="lg:col-span-2 bg-white rounded-3xl border p-6 space-y-4 h-fit">
              <h2 className="font-black">ملخص الطلب</h2>
              <div className="flex justify-between text-sm"><span>المجموع</span><strong>{formatPrice(subtotal)}</strong></div>
              <div className="flex justify-between text-sm"><span>الشحن</span><strong>{shipping ? formatPrice(shipping) : "مجاني"}</strong></div>
              <div className="border-t pt-3 flex justify-between font-black"><span>الإجمالي</span><strong>{formatPrice(Math.max(0, subtotal + shipping))}</strong></div>
              <Button type="button" className="w-full">تأكيد الطلب</Button>
            </aside>
          </form>
        )}
      </main>
    </Shell>
  );
}
function Shell({ children }: { children: React.ReactNode }) { return <div className="min-h-screen flex flex-col bg-[#F8FAFC]"><Navbar />{children}<Footer /></div>; }
