"use client";

import Link from "next/link";
import { Navbar } from "@/shared/components/Navbar";
import { Footer } from "@/shared/components/Footer";
import { Button } from "@/shared/components/Button";
import { Input } from "@/shared/components/Input";
import { Mail01Icon, LockPasswordIcon, Store01Icon } from "hugeicons-react";
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
    <div className="min-h-screen flex flex-col bg-[#F8FAFC]">
      <Navbar />

      <main className="flex-1 flex items-center justify-center p-4 sm:p-8">
        <div className="w-full max-w-md bg-white p-8 rounded-3xl border border-black/8 shadow-sm space-y-6">
          <div className="text-center space-y-2">
            <div className="w-12 h-12 rounded-2xl bg-[#111111] flex items-center justify-center text-white mx-auto shadow-md shadow-black/15">
              <Store01Icon size={26} color="white" />
            </div>
            <h1 className="text-xl font-black text-[#1A1D2A]">تسجيل الدخول</h1>
            <p className="text-xs text-[#64748B]">
              أدخل بيانات حسابك للوصول إلى طلباتك وسلة المشتريات
            </p>
          </div>

          <form onSubmit={handleSubmit} className="space-y-4">
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
              className="w-full shadow-lg shadow-black/15 mt-2"
            >
              تسجيل الدخول
            </Button>
          </form>

          <Link
            href="/forgot-password"
            className="block text-center text-xs font-bold text-[#2B7BD4] hover:underline"
          >
            نسيت كلمة المرور؟
          </Link>

          <div className="text-center text-xs text-[#64748B]">
            ليس لديك حساب بعد؟{" "}
            <Link
              href="/signup"
              className="font-bold text-[#2B7BD4] hover:underline"
            >
              أنشئ حساباً جديداً
            </Link>
          </div>
        </div>
      </main>

      <Footer />
    </div>
  );
}
