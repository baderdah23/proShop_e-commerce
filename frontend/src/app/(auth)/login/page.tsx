"use client";

import Link from "next/link";
import { Navbar } from "@/shared/components/Navbar";
import { Footer } from "@/shared/components/Footer";
import { Button } from "@/shared/components/Button";
import { Input } from "@/shared/components/Input";
import { BrandMark } from "@/shared/components/BrandMark";
import {
  Mail01Icon,
  LockPasswordIcon,
  Store01Icon,
  Shield01Icon,
  Ticket01Icon,
} from "hugeicons-react";
import { useFormSubmit } from "@/shared/hooks/useFormSubmit";
import type { FormEvent } from "react";
import { toast } from "@/shared/components/Toast";
import { LoginSchema } from "@/validations/auth/auth.schema";
import { clientFetch } from "@/lib/api/client";
import { useRouter } from "next/navigation";
import { useAuth } from "@/features/auth";

export default function LoginPage() {
  const router = useRouter();
  const auth = useAuth();
  const { error, submit } = useFormSubmit({
    successMessage: "تم تسجيل الدخول بنجاح",
    fallbackErrorMessage: "تعذر تسجيل الدخول، حاول مرة أخرى",
  });

  async function handleSubmit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();

    const formData = new FormData(event.currentTarget);

    const payload = {
      email: String(formData.get("email") ?? ""),
      password: String(formData.get("password") ?? ""),
    };

    const result = LoginSchema.safeParse(payload);

    if (!result.success) {
      toast.error(result.error.issues[0].message);
      return;
    }

    await submit(() =>
      clientFetch("auth/login", {
        method: "POST",
        credentials: "include",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(payload),
      }),
    );

    await auth?.refetch();
    router.push("/");
  }

  return (
    <div className="min-h-screen flex flex-col bg-paper">
      <Navbar />

      <main className="flex flex-1 items-center justify-center p-4 sm:p-6 lg:p-10">
        <div className="surface w-full max-w-5xl overflow-hidden shadow-[0_30px_80px_-48px_rgba(10,11,10,0.16)] lg:grid lg:grid-cols-[1.05fr_0.95fr]">
          <div className="p-8 sm:p-12 lg:p-14">
            <div className="space-y-3">
              <span className="eyebrow inline-flex items-center gap-2 text-brand">
                <Store01Icon size={14} />
                بوابة العملاء
              </span>
              <h1 className="text-3xl font-black leading-tight tracking-[-0.03em] text-ink sm:text-4xl">
                تسجيل الدخول
              </h1>
              <p className="max-w-sm text-sm leading-relaxed text-muted">
                أدخل بيانات حسابك للوصول إلى طلباتك وسلة المشتريات
              </p>
            </div>

            <form onSubmit={handleSubmit} className="mt-10 space-y-5">
              <Input
                label="البريد الإلكتروني"
                inputId="email"
                name="email"
                type="email"
                placeholder="name@example.com"
                required
                icon={<Mail01Icon size={16} />}
              />

              <Input
                label="كلمة المرور"
                inputId="password"
                name="password"
                type="password"
                placeholder="••••••••"
                required
                icon={<LockPasswordIcon size={16} />}
              />

              <Button
                variant="primary"
                size="lg"
                className="mt-2 w-full"
              >
                تسجيل الدخول
              </Button>
            </form>

            <div className="mt-7 flex flex-wrap items-center justify-between gap-3 border-t border-line pt-6">
              <Link
                href="/forgot-password"
                className="text-sm font-bold text-brand transition-colors hover:text-brand-deep hover:underline"
              >
                نسيت كلمة المرور؟
              </Link>

              <p className="text-sm text-muted">
                ليس لديك حساب بعد؟{" "}
                <Link
                  href="/signup"
                  className="font-bold text-brand transition-colors hover:text-brand-deep hover:underline"
                >
                  أنشئ حساباً جديداً
                </Link>
              </p>
            </div>
          </div>

          <aside className="blueprint relative hidden overflow-hidden p-12 text-ink lg:flex lg:flex-col lg:justify-between lg:border-s lg:border-line">
            <BrandMark tone="dark" />

            <div className="relative z-10 space-y-7">
              <span className="font-latin text-[11px] font-bold tracking-[0.22em] text-muted">
                PROSTORE / ACCOUNT
              </span>
              <h2 className="max-w-sm text-4xl font-black leading-[1.15] tracking-[-0.035em] text-ink xl:text-5xl">
                عتاد احترافي.
                <br />
                <span className="text-brand">اختيار دقيق.</span>
              </h2>
              <p className="max-w-sm text-sm leading-relaxed text-muted">
                منصة متكاملة لأجهزتك وطلباتك — مواصفات واضحة، ضمان معتمد، وتوصيل موثوق.
              </p>
              <div className="grid grid-cols-2 gap-3 pt-2">
                <div className="rounded-2xl border border-line bg-surface/80 p-4">
                  <Shield01Icon size={22} className="text-brand" />
                  <p className="mt-3 text-xs font-bold text-ink">ضمان معتمد</p>
                  <p className="mt-1 text-[11px] leading-relaxed text-muted">
                    قطع أصلية بضمان رسمي
                  </p>
                </div>
                <div className="rounded-2xl border border-line bg-surface/80 p-4">
                  <Ticket01Icon size={22} className="text-brand" />
                  <p className="mt-3 text-xs font-bold text-ink">عروض حقيقية</p>
                  <p className="mt-1 text-[11px] leading-relaxed text-muted">
                    كوبونات وخصومات مُحدّثة
                  </p>
                </div>
              </div>
            </div>

            <p className="font-latin relative z-10 text-[11px] tracking-[0.2em] text-muted">
              EST. 2026 — PROSTORE
            </p>
          </aside>
        </div>
      </main>

      <Footer />
    </div>
  );
}
