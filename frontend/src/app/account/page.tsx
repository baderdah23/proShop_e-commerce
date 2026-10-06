"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import { Navbar } from "@/shared/components/Navbar";
import { Footer } from "@/shared/components/Footer";
import { Button } from "@/shared/components/Button";
import { useAuth } from "@/features/auth";
import { AddressesApi, OrdersApi } from "@/lib/api-client";
import type { Address, Order } from "@/shared/types";
import { formatPrice } from "@/shared/utils";
import { toast } from "sonner";
import { FavouriteIcon, Settings01Icon, User02Icon } from "hugeicons-react";

type AddressForm = Omit<Address, "address_id" | "user_id" | "created_at">;

const emptyAddress: AddressForm = {
  label: "المنزل",
  full_name: "",
  phone: "",
  country: "السعودية",
  city: "",
  street: "",
  building: "",
  is_default: false,
};

export default function AccountPage() {
  const { user, isLoading: isAuthLoading, updateProfile } = useAuth();
  const [orders, setOrders] = useState<Order[]>([]);
  const [addresses, setAddresses] = useState<Address[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [isSavingProfile, setIsSavingProfile] = useState(false);
  const [profileForm, setProfileForm] = useState({ full_name: "", email: "", phone: "" });
  const [editingAddressId, setEditingAddressId] = useState<string | null>(null);
  const [addressForm, setAddressForm] = useState<AddressForm>(emptyAddress);

  useEffect(() => {
    if (!user) return;
    setProfileForm({ full_name: user.full_name, email: user.email, phone: user.phone });
    Promise.all([OrdersApi.getMyOrders(), AddressesApi.getAll()])
      .then(([loadedOrders, loadedAddresses]) => {
        setOrders(loadedOrders);
        setAddresses(loadedAddresses);
      })
      .catch((error) => toast.error(error instanceof Error ? error.message : "تعذر تحميل الحساب."))
      .finally(() => setIsLoading(false));
  }, [user]);

  const saveProfile = async (event: React.FormEvent) => {
    event.preventDefault();
    setIsSavingProfile(true);
    try {
      await updateProfile(profileForm);
      toast.success("تم تحديث معلوماتك الشخصية.");
    } catch (error) {
      toast.error(error instanceof Error ? error.message : "تعذر تحديث المعلومات.");
    } finally {
      setIsSavingProfile(false);
    }
  };

  const saveAddress = async (event: React.FormEvent) => {
    event.preventDefault();
    try {
      const saved = editingAddressId
        ? await AddressesApi.update(editingAddressId, addressForm)
        : await AddressesApi.create(addressForm);
      setAddresses((current) => {
        const withoutSaved = current.filter((item) => item.address_id !== saved.address_id);
        return saved.is_default ? [saved, ...withoutSaved.map((item) => ({ ...item, is_default: false }))] : [...withoutSaved, saved];
      });
      setEditingAddressId(null);
      setAddressForm(emptyAddress);
      toast.success(editingAddressId ? "تم تحديث العنوان." : "تمت إضافة العنوان.");
    } catch (error) {
      toast.error(error instanceof Error ? error.message : "تعذر حفظ العنوان.");
    }
  };

  const removeAddress = async (addressId: string) => {
    try {
      await AddressesApi.remove(addressId);
      setAddresses((current) => current.filter((item) => item.address_id !== addressId));
      toast.success("تم حذف العنوان.");
    } catch (error) {
      toast.error(error instanceof Error ? error.message : "تعذر حذف العنوان.");
    }
  };

  if (isAuthLoading || (user && isLoading)) return <Shell><Loading /></Shell>;
  if (!user) return <Shell><Empty title="سجل الدخول للوصول إلى حسابك" href="/login" /></Shell>;

  return (
    <Shell>
      <main className="flex-1 max-w-7xl w-full mx-auto px-4 sm:px-6 lg:px-8 py-10 space-y-8">
        <div>
          <h1 className="text-2xl sm:text-3xl font-black">حسابي</h1>
          <p className="text-sm text-[#64748B] mt-2">إدارة معلوماتك وعناوينك وطلباتك</p>
        </div>

        <section className="bg-white rounded-3xl border p-6">
          <h2 className="font-black flex items-center gap-2 mb-5"><User02Icon size={18} /> المعلومات الشخصية</h2>
          <form onSubmit={saveProfile} className="grid grid-cols-1 md:grid-cols-3 gap-3">
            <Field label="الاسم الكامل" value={profileForm.full_name} onChange={(value) => setProfileForm({ ...profileForm, full_name: value })} />
            <Field label="البريد الإلكتروني" type="email" value={profileForm.email} onChange={(value) => setProfileForm({ ...profileForm, email: value })} />
            <Field label="رقم الهاتف" value={profileForm.phone} onChange={(value) => setProfileForm({ ...profileForm, phone: value })} />
            <Button type="submit" isLoading={isSavingProfile} className="md:col-span-3 md:w-fit">حفظ المعلومات</Button>
          </form>
        </section>

        <section className="bg-white rounded-3xl border p-6">
          <div className="flex items-center justify-between mb-5">
            <h2 className="font-black">العناوين</h2>
            <Button type="button" size="sm" onClick={() => { setEditingAddressId(null); setAddressForm({ ...emptyAddress, full_name: user.full_name, phone: user.phone }); }}>إضافة عنوان</Button>
          </div>
          {addresses.length === 0 && <p className="text-sm text-[#64748B] mb-5">لا توجد عناوين محفوظة.</p>}
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-4">
            {addresses.map((address) => (
              <div key={address.address_id} className="border rounded-2xl p-4 space-y-3">
                <div className="flex justify-between gap-3">
                  <div><strong>{address.label}</strong>{address.is_default && <span className="text-xs text-green-600 ms-2">الافتراضي</span>}</div>
                  <div className="flex gap-3 text-xs"><button type="button" className="text-[#2B7BD4] underline" onClick={() => { setEditingAddressId(address.address_id); setAddressForm(address); }}>تعديل</button><button type="button" className="text-red-600 underline" onClick={() => removeAddress(address.address_id)}>حذف</button></div>
                </div>
                <p className="text-sm text-[#64748B]">{address.full_name}، {address.phone}<br />{address.country}، {address.city}، {address.street}، {address.building}</p>
              </div>
            ))}
          </div>
          {(editingAddressId !== null || addresses.length === 0) && (
            <form onSubmit={saveAddress} className="mt-6 grid grid-cols-1 sm:grid-cols-2 gap-3 border-t pt-5">
              <Field label="اسم العنوان" value={addressForm.label} onChange={(value) => setAddressForm({ ...addressForm, label: value })} />
              <Field label="الاسم الكامل" value={addressForm.full_name} onChange={(value) => setAddressForm({ ...addressForm, full_name: value })} />
              <Field label="الهاتف" value={addressForm.phone} onChange={(value) => setAddressForm({ ...addressForm, phone: value })} />
              <Field label="الدولة" value={addressForm.country} onChange={(value) => setAddressForm({ ...addressForm, country: value })} />
              <Field label="المدينة" value={addressForm.city} onChange={(value) => setAddressForm({ ...addressForm, city: value })} />
              <Field label="الشارع" value={addressForm.street} onChange={(value) => setAddressForm({ ...addressForm, street: value })} />
              <Field label="المبنى" value={addressForm.building} onChange={(value) => setAddressForm({ ...addressForm, building: value })} />
              <label className="flex items-center gap-2 text-sm"><input type="checkbox" checked={addressForm.is_default} onChange={(event) => setAddressForm({ ...addressForm, is_default: event.target.checked })} /> جعله العنوان الافتراضي</label>
              <div className="sm:col-span-2 flex gap-3"><Button type="submit">{editingAddressId ? "حفظ التعديل" : "حفظ العنوان"}</Button>{editingAddressId && <Button type="button" variant="secondary" onClick={() => setEditingAddressId(null)}>إلغاء</Button>}</div>
            </form>
          )}
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

function Field({ label, value, onChange, type = "text" }: { label: string; value: string; onChange: (value: string) => void; type?: string }) {
  return <label className="block text-xs font-bold">{label}<input required type={type} value={value} onChange={(event) => onChange(event.target.value)} className="mt-1 w-full px-3 py-2.5 rounded-xl border text-sm font-normal" /></label>;
}
function OrderTracking({ order }: { order: Order }) {
  const stages = ["pending", "processing", "shipped", "delivered"];
  const currentStage = order.status === "cancelled" ? -1 : stages.indexOf(order.status);
  return <details className="border-b last:border-0 py-4"><summary className="flex flex-wrap items-center justify-between gap-3 cursor-pointer list-none"><div><strong className="block text-sm">{order.order_number}</strong><span className="text-xs text-[#64748B]">{new Date(order.created_at).toLocaleDateString("ar")}</span></div><span className="text-xs font-bold rounded-lg px-3 py-1 bg-[#EEF5FC] text-[#2B7BD4]">{order.status}</span><div className="flex items-center gap-3"><strong className="text-sm">{formatPrice(Number(order.total_amount))}</strong><Link href={`/invoice/${order.order_id}`} className="text-xs text-[#2B7BD4] underline font-bold">الفاتورة</Link></div></summary><div className="pt-5 mt-4 border-t border-black/5 grid grid-cols-4 gap-2">{stages.map((stage, index) => <div key={stage} className="text-center"><div className={`mx-auto w-7 h-7 rounded-full flex items-center justify-center text-[10px] font-black ${index <= currentStage ? "bg-[#2B7BD4] text-white" : "bg-[#E2E8F0] text-[#64748B]"}`}>{index + 1}</div><span className="block mt-2 text-[10px] text-[#64748B]">{stage}</span></div>)}</div></details>;
}
function Shell({ children }: { children: React.ReactNode }) { return <div className="min-h-screen flex flex-col bg-[#F8FAFC]"><Navbar />{children}<Footer /></div>; }
function Loading() { return <div className="flex-1 flex items-center justify-center"><div className="w-8 h-8 border-2 border-[#6AABF0] border-t-transparent rounded-full animate-spin" /></div>; }
function Empty({ title, href }: { title: string; href: string }) { return <div className="flex-1 flex items-center justify-center flex-col gap-3 font-bold"><p>{title}</p><Link href={href} className="text-[#2B7BD4] underline">تسجيل الدخول</Link></div>; }
