import Link from "next/link";
import { Navbar } from "@/shared/components/Navbar";
import { Footer } from "@/shared/components/Footer";
import { Button } from "@/shared/components/Button";
import { DEMO_USER, STATIC_ADDRESSES, STATIC_ORDERS } from "@/shared/data/mock-data";
import type { Order } from "@/shared/types";
import { formatPrice } from "@/shared/utils";
import { FavouriteIcon, Settings01Icon, User02Icon } from "hugeicons-react";

export default function AccountPage() {
  const addresses = STATIC_ADDRESSES;
  const orders = STATIC_ORDERS;

  return (
    <Shell>
      <main className="flex-1 max-w-7xl w-full mx-auto px-4 sm:px-6 lg:px-8 py-10 space-y-8">
        <div>
          <h1 className="text-2xl sm:text-3xl font-black">حسابي</h1>
          <p className="text-sm text-[#64748B] mt-2">إدارة معلوماتك وعناوينك وطلباتك</p>
        </div>

        <section className="bg-white rounded-3xl border p-6">
          <h2 className="font-black flex items-center gap-2 mb-5"><User02Icon size={18} /> المعلومات الشخصية</h2>
          <form className="grid grid-cols-1 md:grid-cols-3 gap-3">
            <Field label="الاسم الكامل" defaultValue={DEMO_USER.full_name} />
            <Field label="البريد الإلكتروني" type="email" defaultValue={DEMO_USER.email} />
            <Field label="رقم الهاتف" defaultValue={DEMO_USER.phone} />
            <Button type="button" className="md:col-span-3 md:w-fit">حفظ المعلومات</Button>
          </form>
        </section>

        <section className="bg-white rounded-3xl border p-6">
          <div className="flex items-center justify-between mb-5">
            <h2 className="font-black">العناوين</h2>
            <Button type="button" size="sm">إضافة عنوان</Button>
          </div>
          {addresses.length === 0 && <p className="text-sm text-[#64748B] mb-5">لا توجد عناوين محفوظة.</p>}
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-4">
            {addresses.map((address) => (
              <div key={address.address_id} className="border rounded-2xl p-4 space-y-3">
                <div className="flex justify-between gap-3">
                  <div><strong>{address.label}</strong>{address.is_default && <span className="text-xs text-green-600 ms-2">الافتراضي</span>}</div>
                  <div className="flex gap-3 text-xs"><button type="button" className="text-[#2B7BD4] underline">تعديل</button><button type="button" className="text-red-600 underline">حذف</button></div>
                </div>
                <p className="text-sm text-[#64748B]">{address.full_name}، {address.phone}<br />{address.country}، {address.city}، {address.street}، {address.building}</p>
              </div>
            ))}
          </div>
        </section>

        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
          <Link href="/wishlist" className="bg-white rounded-3xl border p-6 hover:border-[#6AABF0]"><h2 className="font-black flex items-center gap-2"><FavouriteIcon size={18} /> المفضلة</h2></Link>
          <section className="bg-white rounded-3xl border p-6"><h2 className="font-black flex items-center gap-2"><Settings01Icon size={18} /> الإعدادات</h2><Link href="/forgot-password" className="text-sm text-[#2B7BD4] underline">تغيير كلمة المرور</Link></section>
        </div>

        <section className="bg-white rounded-3xl border p-6">
          <h2 className="font-black mb-5">طلباتي السابقة</h2>
          {orders.length === 0 ? <p className="text-sm text-[#64748B]">لا توجد طلبات حتى الآن.</p> : <div className="space-y-3">{orders.map((order) => <OrderTracking key={order.order_id} order={order} />)}</div>}
        </section>
      </main>
    </Shell>
  );
}

function Field({ label, defaultValue, type = "text" }: { label: string; defaultValue: string; type?: string }) {
  return <label className="block text-xs font-bold">{label}<input type={type} defaultValue={defaultValue} className="mt-1 w-full px-3 py-2.5 rounded-xl border text-sm font-normal" /></label>;
}
function OrderTracking({ order }: { order: Order }) {
  const stages = ["pending", "processing", "shipped", "delivered"];
  const currentStage = order.status === "cancelled" ? -1 : stages.indexOf(order.status);
  return <details className="border-b last:border-0 py-4"><summary className="flex flex-wrap items-center justify-between gap-3 cursor-pointer list-none"><div><strong className="block text-sm">{order.order_number}</strong><span className="text-xs text-[#64748B]">{new Date(order.created_at).toLocaleDateString("ar")}</span></div><span className="text-xs font-bold rounded-lg px-3 py-1 bg-[#EEF5FC] text-[#2B7BD4]">{order.status}</span><div className="flex items-center gap-3"><strong className="text-sm">{formatPrice(Number(order.total_amount))}</strong><Link href={`/invoice/${order.order_id}`} className="text-xs text-[#2B7BD4] underline font-bold">الفاتورة</Link></div></summary><div className="pt-5 mt-4 border-t border-black/5 grid grid-cols-4 gap-2">{stages.map((stage, index) => <div key={stage} className="text-center"><div className={`mx-auto w-7 h-7 rounded-full flex items-center justify-center text-[10px] font-black ${index <= currentStage ? "bg-[#2B7BD4] text-white" : "bg-[#E2E8F0] text-[#64748B]"}`}>{index + 1}</div><span className="block mt-2 text-[10px] text-[#64748B]">{stage}</span></div>)}</div></details>;
}
function Shell({ children }: { children: React.ReactNode }) { return <div className="min-h-screen flex flex-col bg-[#F8FAFC]"><Navbar />{children}<Footer /></div>; }
