import Link from "next/link";
import { Button } from "@/shared/components/Button";
import { Input } from "@/shared/components/Input";
import { Navbar } from "@/shared/components/Navbar";
import { Footer } from "@/shared/components/Footer";

export default function ForgotPasswordPage() {
  return (
    <Shell>
      <main className="flex-1 flex items-center justify-center p-4">
        <form className="w-full max-w-md bg-white p-8 rounded-3xl border space-y-5">
          <h1 className="text-2xl font-black">نسيت كلمة المرور؟</h1>
          <p className="text-sm text-[#64748B]">أدخل بريدك لنرسل لك رمز إعادة التعيين.</p>
          <Input label="البريد الإلكتروني" type="email" required />
          <Button type="submit" className="w-full">إرسال الرمز</Button>
          <Link href="/login" className="block text-center text-sm text-[#2B7BD4] underline">العودة لتسجيل الدخول</Link>
        </form>
      </main>
    </Shell>
  );
}

function Shell({ children }: { children: React.ReactNode }) {
  return <div className="min-h-screen flex flex-col bg-[#F8FAFC]"><Navbar />{children}<Footer /></div>;
}
