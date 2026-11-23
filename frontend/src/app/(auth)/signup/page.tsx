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
  User02Icon,
  Call02Icon,
  Store01Icon,
  ShoppingBag01Icon,
  Shield01Icon,
} from "hugeicons-react";
import type { FormEvent } from "react";
import SpinerLoader from "@/shared/components/SpinerLoader";
import { clientFetch } from "@/lib/api/client";
import { useFormSubmit } from "@/shared/hooks/useFormSubmit";
import { SignupSchema } from "@/validations/auth/auth.schema";
import { toast } from "@/shared/components/Toast";
import { useRouter } from "next/navigation";
import { useAuth } from "@/features/auth";

interface SignupResponse {
  success: boolean;
  message: string;
}

export default function SignupPage() {
  const router = useRouter();
  const auth = useAuth();
  const { isSubmitting, error, submit } = useFormSubmit({
    successMessage: "تم إنشاء الحساب بنجاح",
    fallbackErrorMessage: "تعذر إنشاء الحساب، حاول مرة أخرى",
  });

  async function handleSubmit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();

    const formData = new FormData(event.currentTarget);

    const payload = {
      full_name: String(formData.get("full-name") ?? ""),
      email: String(formData.get("email") ?? ""),
      phone: String(formData.get("phone") ?? ""),
      password: String(formData.get("password") ?? ""),
    };

    const result = SignupSchema.safeParse(payload);

    if (!result.success) {
      toast.error(result.error.issues[0].message);
      return;
    }

    await submit(() =>
      clientFetch<SignupResponse>("auth/signup", {
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
                انضم إلى برو ستور
              </span>
              <h1 className="text-3xl font-black leading-tight tracking-[-0.03em] text-ink sm:text-4xl">
                إنشاء حساب جديد
              </h1>
              <p className="max-w-sm text-sm leading-relaxed text-muted">
                انضم إلينا للاستمتاع بأقوى العروض ومتابعة طلباتك أولاً بأول
              </p>
            </div>

            <form className="mt-9 space-y-4" onSubmit={handleSubmit}>
              <Input
                label="الاسم الكامل"
                inputId="full-name"
                name="full-name"
                placeholder="مثال: محمد أحمد"
                required
                icon={<User02Icon size={16} />}
              />

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
                label="رقم الهاتف"
                inputId="phone"
                name="phone"
                type="tel"
                placeholder="+966 50 000 0000"
                required
                icon={<Call02Icon size={16} />}
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

              {error && (
                <p
                  role="alert"
                  className="text-sm font-semibold text-sale"
                >
                  {error}
                </p>
              )}

              <Button
                type="submit"
                variant="primary"
                size="lg"
                className="mt-2 w-full"
                disabled={isSubmitting}
                aria-busy={isSubmitting}
              >
                {isSubmitting ? (
                  <div className="flex items-center justify-center gap-3">
                    <SpinerLoader className="size-5 border-white" />
                    <p>جاري الانشاء</p>
                  </div>
                ) : (
                  "إنشاء الحساب"
                )}
              </Button>
            </form>

            <p className="mt-7 border-t border-line pt-6 text-center text-sm text-muted">
              لديك حساب بالفعل؟{" "}
              <Link
                href="/login"
                className="font-bold text-brand transition-colors hover:text-brand-deep hover:underline"
              >
                تسجيل الدخول
              </Link>
            </p>
          </div>

          <aside className="blueprint relative hidden overflow-hidden p-12 text-ink lg:flex lg:flex-col lg:justify-between lg:border-s lg:border-line">
            <BrandMark tone="dark" />

            <div className="relative z-10 space-y-7">
              <span className="font-latin text-[11px] font-bold tracking-[0.22em] text-muted">
                PROSTORE / MEMBERSHIP
              </span>
              <h2 className="max-w-sm text-4xl font-black leading-[1.15] tracking-[-0.035em] text-ink xl:text-5xl">
                ابدأ بعتاد
                <br />
                <span className="text-brand">يليق بطموحك.</span>
              </h2>
              <p className="max-w-sm text-sm leading-relaxed text-muted">
                حساب واحد يجمع طلباتك، كوبوناتك، وكل ما تحتاجه لمتابعة مشترياتك بثقة.
              </p>
              <div className="grid grid-cols-2 gap-3 pt-2">
                <div className="rounded-2xl border border-line bg-surface/80 p-4">
                  <ShoppingBag01Icon size={22} className="text-brand" />
                  <p className="mt-3 text-xs font-bold text-ink">تشكيلة مختارة</p>
                  <p className="mt-1 text-[11px] leading-relaxed text-muted">
                    أحدث الأجهزة والمكونات
                  </p>
                </div>
                <div className="rounded-2xl border border-line bg-surface/80 p-4">
                  <Shield01Icon size={22} className="text-brand" />
                  <p className="mt-3 text-xs font-bold text-ink">تسوق باطمئنان</p>
                  <p className="mt-1 text-[11px] leading-relaxed text-muted">
                    ضمان معتمد ودعم مستمر
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
