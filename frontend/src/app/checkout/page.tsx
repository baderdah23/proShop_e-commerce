"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { Navbar } from "@/shared/components/Navbar";
import { Footer } from "@/shared/components/Footer";
import { Button } from "@/shared/components/Button";
import { useAuth } from "@/features/auth";
import { AddressesApi, CartApi, OrdersApi, PaymentsApi } from "@/lib/api-client";
import type { Address, AppliedCoupon, CartItem } from "@/shared/types";
import { formatPrice } from "@/shared/utils";
import { toast } from "sonner";

export default function CheckoutPage() {
  const router = useRouter();
  const { user, isLoading: isAuthLoading } = useAuth();
  const [addresses, setAddresses] = useState<Address[]>([]);
  const [address, setAddress] = useState<Address | null>(null);
  const [items, setItems] = useState<CartItem[]>([]);
  const [coupon, setCoupon] = useState<AppliedCoupon | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [paymentMethod, setPaymentMethod] = useState<"cash_on_delivery" | "credit_card">("cash_on_delivery");
  const [form, setForm] = useState({ fullName: "", phone: "", country: "السعودية", city: "", street: "", building: "" });

  useEffect(() => {
    if (!user) {
      return;
    }
    Promise.all([AddressesApi.getAll().catch(() => []), CartApi.get()])
      .then(([addresses, cart]) => {
        const existingAddress = addresses[0] || null;
        setAddresses(addresses);
        setAddress(existingAddress);
        setItems(cart.items);
        setCoupon(cart.applied_coupon);
        if (existingAddress) {
          setForm({
            fullName: existingAddress.full_name,
            phone: existingAddress.phone,
            country: existingAddress.country,
            city: existingAddress.city,
            street: existingAddress.street,
            building: existingAddress.building,
          });
        }
      })
      .catch((error) => toast.error(error instanceof Error ? error.message : "تعذر تحميل بيانات checkout."))
      .finally(() => setIsLoading(false));
  }, [isAuthLoading, user]);

  const subtotal = items.reduce((sum, item) => sum + Number(item.total_item_price), 0);
  const discount = coupon?.discount_type === "percentage"
    ? (subtotal * Number(coupon.discount_value)) / 100
    : Number(coupon?.discount_value || 0);
  const shipping = subtotal > 100 ? 0 : 15;

  const handleOrderSuccess = () => {
    setCoupon(null);
    router.push("/account");
  };

  const submitOrder = async (event: React.FormEvent) => {
    event.preventDefault();
    setIsSubmitting(true);
    let createdOrderId: string | null = null;
    try {
      let selectedAddress = address;
      if (!selectedAddress) {
        selectedAddress = await AddressesApi.create({
          full_name: form.fullName,
          phone: form.phone,
          country: form.country,
          city: form.city,
          street: form.street,
          building: form.building,
          label: "المنزل",
          is_default: true,
        });
      }
      const order = await OrdersApi.create({
        addressId: selectedAddress.address_id,
        couponCode: coupon?.code,
        shippingFee: shipping,
      });
      createdOrderId = order.order_id;

      if (paymentMethod === "credit_card") {
        router.push(`/checkout/payment?orderId=${order.order_id}`);
        return;
      }

      await PaymentsApi.process(order.order_id, "cash_on_delivery");
      toast.success("تم تأكيد الطلب بنجاح.");
      handleOrderSuccess();
    } catch (error) {
      if (createdOrderId) {
        await PaymentsApi.cancel(createdOrderId).catch(() => undefined);
      }
      toast.error(error instanceof Error ? error.message : "تعذر إتمام الطلب.");
    } finally {
      setIsSubmitting(false);
    }
  };

  if (isAuthLoading || (user && isLoading)) return <Shell><Loading /></Shell>;
  if (!user) return <Shell><div className="flex-1 flex items-center justify-center font-bold">يجب تسجيل الدخول أولاً.</div></Shell>;

  return (
    <Shell>
      <main className="flex-1 max-w-5xl w-full mx-auto px-4 py-10">
        <h1 className="text-2xl sm:text-3xl font-black mb-8">إتمام الطلب</h1>
        {items.length === 0 ? <div className="bg-white border rounded-3xl p-10 text-center font-bold">السلة فارغة.</div> : (
          <form onSubmit={submitOrder} className="grid grid-cols-1 lg:grid-cols-5 gap-8">
            <section className="lg:col-span-3 bg-white rounded-3xl border p-6 space-y-4">
              <h2 className="font-black">عنوان التوصيل</h2>
              {addresses.length > 0 && (
                <fieldset className="space-y-2">
                  <legend className="text-xs font-bold">اختر عنواناً محفوظاً</legend>
                  {addresses.map((savedAddress) => (
                    <label key={savedAddress.address_id} className="flex items-start gap-2 text-xs border rounded-xl p-3 cursor-pointer">
                      <input type="radio" name="address" checked={address?.address_id === savedAddress.address_id} onChange={() => {
                        setAddress(savedAddress);
                        setForm({
                          fullName: savedAddress.full_name,
                          phone: savedAddress.phone,
                          country: savedAddress.country,
                          city: savedAddress.city,
                          street: savedAddress.street,
                          building: savedAddress.building,
                        });
                      }} />
                      <span><strong>{savedAddress.label}</strong><br />{savedAddress.city}، {savedAddress.street}، {savedAddress.building}</span>
                    </label>
                  ))}
                </fieldset>
              )}
              <button type="button" className="text-sm text-[#2B7BD4] underline" onClick={() => {
                setAddress(null);
                setForm({ fullName: user.full_name, phone: user.phone, country: "السعودية", city: "", street: "", building: "" });
              }}>إضافة عنوان جديد</button>
              {Object.entries({ fullName: "الاسم الكامل", phone: "رقم الهاتف", country: "الدولة", city: "المدينة", street: "الشارع", building: "المبنى" }).map(([key, label]) => (
                <label key={key} className="block text-xs font-bold">
                  {label}
                  <input required value={form[key as keyof typeof form]} onChange={(event) => setForm({ ...form, [key]: event.target.value })} className="mt-1 w-full px-3 py-2.5 rounded-xl border text-sm font-normal" />
                </label>
              ))}
              <fieldset className="space-y-2 pt-2">
                <legend className="text-xs font-bold">طريقة الدفع</legend>
                <label className="flex items-center gap-2 text-xs border rounded-xl p-3 cursor-pointer">
                  <input type="radio" name="payment" checked={paymentMethod === "cash_on_delivery"} onChange={() => setPaymentMethod("cash_on_delivery")} />
                  الدفع عند الاستلام
                </label>
                <label className="flex items-center gap-2 text-xs border rounded-xl p-3 cursor-pointer">
                  <input type="radio" name="payment" checked={paymentMethod === "credit_card"} onChange={() => setPaymentMethod("credit_card")} />
                  بطاقة ائتمانية (يتطلب إكمالاً عبر Stripe)
                </label>
                {paymentMethod === "credit_card" && (
                  <div role="dialog" aria-label="بيانات بطاقة اختبار الدفع" className="text-xs bg-[#EEF5FC] border border-[#AACFF0]/60 rounded-xl p-3.5 space-y-2">
                    <p className="font-bold text-[#1F63B3]">بطاقة اختبار Stripe — استخدمها لتجربة الدفع:</p>
                    <ul className="text-[#475569] space-y-1 list-disc list-inside">
                      <li>رقم البطاقة: <strong className="font-mono">4242 4242 4242 4242</strong></li>
                      <li>تاريخ الانتهاء: أي تاريخ مستقبلي (مثال: <strong className="font-mono">12/30</strong>)</li>
                      <li>رمز CVC: <strong className="font-mono">123</strong></li>
                      <li>الرمز البريدي / ZIP: <strong className="font-mono">10001</strong></li>
                    </ul>
                  </div>
                )}
              </fieldset>
            </section>
            <aside className="lg:col-span-2 bg-white rounded-3xl border p-6 space-y-4 h-fit">
              <h2 className="font-black">ملخص الطلب</h2>
              <div className="flex justify-between text-sm"><span>المجموع</span><strong>{formatPrice(subtotal)}</strong></div>
              <div className="flex justify-between text-sm"><span>الشحن</span><strong>{shipping ? formatPrice(shipping) : "مجاني"}</strong></div>
              {discount > 0 && <div className="flex justify-between text-sm text-green-600"><span>الخصم</span><strong>-{formatPrice(discount)}</strong></div>}
              <div className="border-t pt-3 flex justify-between font-black"><span>الإجمالي</span><strong>{formatPrice(Math.max(0, subtotal - discount + shipping))}</strong></div>
              {paymentMethod === "credit_card" ? (
                <Button type="submit" isLoading={isSubmitting} className="w-full">متابعة الدفع بالبطاقة</Button>
              ) : (
                <Button type="submit" isLoading={isSubmitting} className="w-full">تأكيد الطلب</Button>
              )}
            </aside>
          </form>
        )}
      </main>
    </Shell>
  );
}
function Shell({ children }: { children: React.ReactNode }) { return <div className="min-h-screen flex flex-col bg-[#F8FAFC]"><Navbar />{children}<Footer /></div>; }
function Loading() { return <div className="flex-1 flex items-center justify-center"><div className="w-8 h-8 border-2 border-[#6AABF0] border-t-transparent rounded-full animate-spin" /></div>; }
