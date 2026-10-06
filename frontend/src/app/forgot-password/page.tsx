"use client";

import { useState } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { toast } from "sonner";
import { Button } from "@/shared/components/Button";
import { Input } from "@/shared/components/Input";
import { Navbar } from "@/shared/components/Navbar";
import { Footer } from "@/shared/components/Footer";
import { requestPasswordReset } from "@/features/auth/api/auth-api";

export default function ForgotPasswordPage() {
  const router = useRouter();
  const [email, setEmail] = useState("");
  const [isLoading, setIsLoading] = useState(false);

  const submit = async (event: React.FormEvent) => {
    event.preventDefault();
    setIsLoading(true);
    try {
      await requestPasswordReset(email);
      sessionStorage.setItem("prostore:reset-email", email.trim().toLowerCase());
      toast.success("تم إرسال رمز إعادة التعيين إلى بريدك الإلكتروني.");
      router.push("/reset-password");
    } catch (error) {
      toast.error(error instanceof Error ? error.message : "تعذر إرسال رمز التحقق.");
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <Shell>
      <main className="flex-1 flex items-center justify-center p-4">
        <form onSubmit={submit} className="w-full max-w-md bg-white p-8 rounded-3xl border space-y-5">
          <h1 className="text-2xl font-black">نسيت كلمة المرور؟</h1>
          <p className="text-sm text-[#64748B]">أدخل بريدك لنرسل لك رمز إعادة التعيين.</p>
          <Input label="البريد الإلكتروني" type="email" required value={email} onChange={(event) => setEmail(event.target.value)} />
          <Button type="submit" className="w-full" isLoading={isLoading}>إرسال الرمز</Button>
          <Link href="/login" className="block text-center text-sm text-[#2B7BD4] underline">العودة لتسجيل الدخول</Link>
        </form>
      </main>
    </Shell>
  );
}

function Shell({ children }: { children: React.ReactNode }) {
  return <div className="min-h-screen flex flex-col bg-[#F8FAFC]"><Navbar />{children}<Footer /></div>;
}
