"use client";

import Link from "next/link";
import { Navbar } from "@/shared/components/Navbar";
import { Footer } from "@/shared/components/Footer";
import { Button } from "@/shared/components/Button";
import { Input } from "@/shared/components/Input";
import {
  Mail01Icon,
  LockPasswordIcon,
  User02Icon,
  Call02Icon,
  Store01Icon,
} from "hugeicons-react";
import type { FormEvent } from "react";
import SpinerLoader from "@/shared/components/SpinerLoader";
import { clientFetch } from "@/lib/api/client";
import { useFormSubmit } from "@/shared/hooks/useFormSubmit";

interface SignupResponse {
  success: boolean;
  message: string;
}

export default function SignupPage() {
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
  }
  return (
    <div className="min-h-screen flex flex-col bg-[#F8FAFC]">
      <Navbar />

      <main className="flex-1 flex items-center justify-center p-4 sm:p-8">
        <div className="w-full max-w-md bg-white p-8 rounded-3xl border border-black/8 shadow-sm space-y-6">
          <div className="text-center space-y-2">
            <div className="w-12 h-12 rounded-2xl bg-gradient-to-br from-[#6AABF0] to-[#2B7BD4] flex items-center justify-center text-white mx-auto shadow-md shadow-[#6AABF0]/20">
              <Store01Icon size={26} color="white" />
            </div>
            <h1 className="text-xl font-black text-[#1A1D2A]">
              إنشاء حساب جديد
            </h1>
            <p className="text-xs text-[#64748B]">
              انضم إلينا للاستمتاع بأقوى العروض ومتابعة طلباتك أولاً بأول
            </p>
          </div>

          <form className="space-y-4" onSubmit={handleSubmit}>
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
                className="text-xs text-[#EF4444] font-medium my-2"
              >
                {error}
              </p>
            )}

            <Button
              type="submit"
              variant="primary"
              size="lg"
              className="w-full shadow-lg shadow-[#6AABF0]/25 mt-2"
              disabled={isSubmitting}
              aria-busy={isSubmitting}
            >
              {isSubmitting ? (
                <div className="flex justify-center items-center gap-4">
                  <SpinerLoader className="border-white w-6" />
                  <p>جاري الانشاء</p>
                </div>
              ) : (
                "إنشاء الحساب"
              )}
            </Button>
          </form>

          <div className="text-center text-xs text-[#64748B]">
            لديك حساب بالفعل؟{" "}
            <Link
              href="/login"
              className="font-bold text-[#2B7BD4] hover:underline"
            >
              تسجيل الدخول
            </Link>
          </div>
        </div>
      </main>

      <Footer />
    </div>
  );
}
