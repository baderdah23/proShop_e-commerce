import Link from "next/link";
import { Navbar } from "@/shared/components/Navbar";
import { Footer } from "@/shared/components/Footer";
import { Button } from "@/shared/components/Button";
import { Input } from "@/shared/components/Input";
import { Mail01Icon, LockPasswordIcon, Store01Icon } from "hugeicons-react";

export default function LoginPage() {
  return (
    <div className="min-h-screen flex flex-col bg-[#F8FAFC]">
      <Navbar />

      <main className="flex-1 flex items-center justify-center p-4 sm:p-8">
        <div className="w-full max-w-md bg-white p-8 rounded-3xl border border-black/8 shadow-sm space-y-6">
          <div className="text-center space-y-2">
            <div className="w-12 h-12 rounded-2xl bg-gradient-to-br from-[#6AABF0] to-[#2B7BD4] flex items-center justify-center text-white mx-auto shadow-md shadow-[#6AABF0]/20">
              <Store01Icon size={26} color="white" />
            </div>
            <h1 className="text-xl font-black text-[#1A1D2A]">تسجيل الدخول</h1>
            <p className="text-xs text-[#64748B]">
              أدخل بيانات حسابك للوصول إلى طلباتك وسلة المشتريات
            </p>
          </div>

          <form className="space-y-4">
            <Input
              label="البريد الإلكتروني"
              type="email"
              placeholder="name@example.com"
              required
              icon={<Mail01Icon size={16} />}
            />

            <Input
              label="كلمة المرور"
              type="password"
              placeholder="••••••••"
              required
              icon={<LockPasswordIcon size={16} />}
            />

            <Button
              variant="primary"
              size="lg"
              className="w-full shadow-lg shadow-[#6AABF0]/25 mt-2"
            >
              تسجيل الدخول
            </Button>
          </form>

          <Link href="/forgot-password" className="block text-center text-xs font-bold text-[#2B7BD4] hover:underline">
            نسيت كلمة المرور؟
          </Link>

          <div className="text-center text-xs text-[#64748B]">
            ليس لديك حساب بعد؟{" "}
            <Link href="/signup" className="font-bold text-[#2B7BD4] hover:underline">
              أنشئ حساباً جديداً
            </Link>
          </div>
        </div>
      </main>

      <Footer />
    </div>
  );
}
