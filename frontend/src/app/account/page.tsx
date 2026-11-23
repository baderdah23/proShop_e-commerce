"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { Navbar } from "@/shared/components/Navbar";
import { Footer } from "@/shared/components/Footer";
import { Button } from "@/shared/components/Button";
import SpinerLoader from "@/shared/components/SpinerLoader";
import type { Address, ApiResponse, Order } from "@/shared/types";
import { formatPrice } from "@/shared/utils";
import { FavouriteIcon, Settings01Icon, User02Icon } from "hugeicons-react";
import { useAuth } from "@/features/auth";
import { toast } from "@/shared/components/Toast";
import { clientFetch } from "@/lib/api/client";

export default function AccountPage() {
  const router = useRouter();
  const auth = useAuth();
  const user = auth?.user;

  const [addresses, setAddresses] = useState<Address[]>([]);
  const [orders, setOrders] = useState<Order[]>([]);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    let isMounted = true;

    async function loadAccountData() {
      try {
        setIsLoading(true);
        const [addressesRes, ordersRes] = await Promise.all([
          clientFetch<ApiResponse<Address[]>>("/addresses", {
            credentials: "include",
          }),
          clientFetch<ApiResponse<Order[]>>("/orders/my-orders", {
            credentials: "include",
          }),
        ]);

        if (isMounted) {
          setAddresses(addressesRes.data || []);
          setOrders(ordersRes.data || []);
        }
      } catch (err: unknown) {
        if (isMounted) {
          toast.error(
            err instanceof Error ? err.message : "حدث خطأ أثناء تحميل البيانات",
          );
        }
      } finally {
        if (isMounted) {
          setIsLoading(false);
        }
      }
    }

    if (!auth?.isLoading) {
      if (!auth?.isAuthenticated) {
        router.push("/login");
      } else {
        loadAccountData();
      }
    }

    return () => {
      isMounted = false;
    };
  }, [auth?.isLoading, auth?.isAuthenticated, router]);

  const handleLogout = async () => {
    try {
      await clientFetch("auth/logout", {
        method: "POST",
        credentials: "include",
      });

      toast.success("تم تسجيل الخروج بنجاح");

      await auth?.refetch();

      router.push("/");
    } catch (err: unknown) {
      toast.error(
        err instanceof Error ? err.message : "حدث خطأ أثناء تسجيل الخروج",
      );
    }
  };

  if (auth?.isLoading || (isLoading && !addresses.length && !orders.length)) {
    return (
      <Shell>
        <div className="flex flex-1 flex-col items-center justify-center gap-3 py-24 text-muted">
          <SpinerLoader className="size-8 border-brand" />
          <span className="text-[13px] font-bold">
            جاري تحميل بيانات الحساب...
          </span>
        </div>
      </Shell>
    );
  }

  return (
    <Shell>
      <main className="shell flex-1 space-y-7 py-10 sm:py-14">
        <div>
          <span className="eyebrow flex items-center gap-2 text-brand">
            <span className="size-1.5 rounded-full bg-signal" />
            ACCOUNT / OVERVIEW
          </span>
          <h1 className="mt-2 text-[28px] font-black leading-tight tracking-[-0.03em] text-ink sm:text-[36px]">حسابي</h1>
          <p className="mt-2 text-[13px] text-muted">
            إدارة معلوماتك وعناوينك وطلباتك
          </p>
        </div>

        <section className="surface p-6 sm:p-8">
          <div className="mb-6 flex items-center gap-3 border-b border-line pb-5">
            <span className="grid size-9 place-items-center rounded-xl bg-brand-soft text-brand">
              <User02Icon size={18} />
            </span>
            <h2 className="text-lg font-black tracking-tight text-ink">المعلومات الشخصية</h2>
          </div>
          <form className="grid grid-cols-1 gap-4 md:grid-cols-3">
            <Field label="الاسم الكامل" defaultValue={user?.full_name ?? ""} />
            <Field
              label="البريد الإلكتروني"
              type="email"
              defaultValue={user?.email ?? ""}
            />
            <Field label="رقم الهاتف" defaultValue={user?.phone ?? ""} />
            <Button type="button" className="md:col-span-3 md:w-fit">
              حفظ المعلومات
            </Button>
          </form>
        </section>

        <section className="surface p-6 sm:p-8">
          <div className="mb-6 flex flex-wrap items-center justify-between gap-3 border-b border-line pb-5">
            <h2 className="text-lg font-black tracking-tight text-ink">العناوين</h2>
            <Button type="button" size="sm">
              إضافة عنوان
            </Button>
          </div>
          {addresses?.length === 0 && (
            <p className="mb-5 text-[13px] text-muted">
              لا توجد عناوين محفوظة.
            </p>
          )}
          <div className="grid grid-cols-1 gap-4 lg:grid-cols-2">
            {addresses.map((address) => (
              <div
                key={address.address_id}
                className="space-y-3 rounded-2xl border border-line bg-paper p-4 transition-colors hover:border-brand/30 hover:bg-surface"
              >
                <div className="flex flex-wrap justify-between gap-3">
                  <div>
                    <strong className="text-[13px] font-black text-ink">{address.label}</strong>
                    {address.is_default && (
                      <span className="ms-2 rounded-full bg-brand-soft px-2.5 py-1 text-[10px] font-bold text-brand-deep">
                        الافتراضي
                      </span>
                    )}
                  </div>
                  <div className="flex gap-3 text-[12px] font-bold">
                    <button type="button" className="text-brand underline decoration-brand/40 underline-offset-4 hover:text-brand-deep">
                      تعديل
                    </button>
                    <button type="button" className="text-sale underline decoration-sale/40 underline-offset-4 hover:text-sale/80">
                      حذف
                    </button>
                  </div>
                </div>
                <p className="text-[12px] leading-6 text-muted">
                  {address.full_name}، {address.phone}
                  <br />
                  {address.country}، {address.city}، {address.street}،{" "}
                  {address.building}
                </p>
              </div>
            ))}
          </div>
        </section>

        <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
          <Link
            href="/wishlist"
            className="surface group flex min-h-28 flex-col justify-between p-6 transition-all duration-300 hover:-translate-y-0.5 hover:border-brand/30 hover:shadow-[0_18px_40px_rgba(10,11,10,0.08)]"
          >
            <h2 className="flex items-center gap-3 text-lg font-black tracking-tight text-ink transition-colors group-hover:text-brand">
              <FavouriteIcon size={18} /> المفضلة
            </h2>
          </Link>
          <section className="surface p-6">
            <h2 className="flex items-center gap-3 border-b border-line pb-4 text-lg font-black tracking-tight text-ink">
              <Settings01Icon size={18} /> الإعدادات
            </h2>
            <div className="mt-4 flex flex-wrap items-center gap-x-5 gap-y-3">
              <Link
                href="/forgot-password"
                className="text-[12px] font-bold text-brand underline decoration-brand/40 underline-offset-4 hover:text-brand-deep"
              >
                تغيير كلمة المرور
              </Link>
              <button
                onClick={handleLogout}
                className="cursor-pointer text-[12px] font-bold text-sale underline decoration-sale/40 underline-offset-4 hover:text-sale/80"
              >
                تسجيل خروج
              </button>
            </div>
          </section>
        </div>

        <section className="surface p-6 sm:p-8">
          <h2 className="mb-6 border-b border-line pb-5 text-lg font-black tracking-tight text-ink">طلباتي السابقة</h2>
          {orders.length === 0 ? (
            <p className="text-[13px] text-muted">لا توجد طلبات حتى الآن.</p>
          ) : (
            <div className="space-y-3">
              {orders.map((order) => (
                <OrderTracking key={order.order_id} order={order} />
              ))}
            </div>
          )}
        </section>
      </main>
    </Shell>
  );
}

function Field({
  label,
  defaultValue,
  type = "text",
}: {
  label: string;
  defaultValue?: string | number;
  type?: string;
}) {
  return (
    <label className="block text-[12px] font-bold text-ink/80">
      {label}
      <input
        type={type}
        defaultValue={defaultValue}
        className="mt-1.5 h-11 w-full rounded-xl border border-line bg-paper px-3.5 text-[13px] font-normal text-ink outline-none transition-colors placeholder:text-muted focus:border-brand focus:bg-surface focus:ring-4 focus:ring-brand/10"
      />
    </label>
  );
}

function OrderTracking({ order }: { order: Order }) {
  const stages = ["pending", "processing", "shipped", "delivered"];
  const currentStage =
    order.status === "cancelled" ? -1 : stages.indexOf(order.status);
  return (
    <details className="group rounded-2xl border border-line bg-paper px-4 py-4 open:bg-surface">
      <summary className="flex flex-wrap items-center justify-between gap-3 cursor-pointer list-none">
        <div>
          <strong className="font-latin block text-[13px] font-black text-ink">{order.order_number}</strong>
          <span className="mt-1 block text-[11px] text-muted">
            {new Date(order.created_at).toLocaleDateString("ar")}
          </span>
        </div>
        <span className="rounded-lg bg-brand-soft px-3 py-1 text-[11px] font-bold text-brand-deep">
          {order.status}
        </span>
        <div className="flex items-center gap-3">
          <strong className="font-latin text-[13px] font-black text-ink">
            {formatPrice(Number(order.total_amount))}
          </strong>
          <Link
            href={`/invoice/${order.order_id}`}
            className="text-[12px] font-bold text-brand underline decoration-brand/40 underline-offset-4 hover:text-brand-deep"
          >
            الفاتورة
          </Link>
        </div>
      </summary>
      <div className="mt-4 grid grid-cols-4 gap-2 border-t border-line pt-5">
        {stages.map((stage, index) => (
          <div key={stage} className="text-center">
            <div
              className={`mx-auto grid size-7 place-items-center rounded-full text-[10px] font-black ${index === currentStage ? "bg-signal text-ink" : index < currentStage ? "bg-ink text-white" : "bg-line text-muted"}`}
            >
              {index + 1}
            </div>
            <span className="mt-2 block text-[10px] font-semibold text-muted">
              {stage}
            </span>
          </div>
        ))}
      </div>
    </details>
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
