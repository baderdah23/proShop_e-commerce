"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { toast } from "sonner";
import { Button } from "@/shared/components/Button";
import { Input } from "@/shared/components/Input";
import { Navbar } from "@/shared/components/Navbar";
import { Footer } from "@/shared/components/Footer";
import { resetPassword } from "@/features/auth/api/auth-api";

export default function ResetPasswordPage() {
  const router = useRouter();
  const [email, setEmail] = useState(() =>
    typeof window === "undefined"
      ? ""
      : sessionStorage.getItem("prostore:reset-email") || "",
  );
  const [resetCode, setResetCode] = useState("");
  const [password, setPassword] = useState("");
  const [isLoading, setIsLoading] = useState(false);

  const submit = async (event: React.FormEvent) => {
    event.preventDefault();
    setIsLoading(true);
    try {
      await resetPassword(email, resetCode, password);
      sessionStorage.removeItem("prostore:reset-email");
      toast.success("تم تغيير كلمة المرور. يمكنك تسجيل الدخول الآن.");
      router.push("/login");
    } catch (error) {
      toast.error(error instanceof Error ? error.message : "تعذر تغيير كلمة المرور.");
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <Shell>
      <main className="flex-1 flex items-center justify-center p-4">
        <form onSubmit={submit} className="w-full max-w-md bg-white p-8 rounded-3xl border space-y-5">
          <h1 className="text-2xl font-black">إعادة تعيين كلمة المرور</h1>
          <Input label="البريد الإلكتروني" type="email" required value={email} onChange={(event) => setEmail(event.target.value)} />
          <Input label="رمز التحقق" inputMode="numeric" pattern="[0-9]{6}" minLength={6} maxLength={6} required value={resetCode} onChange={(event) => setResetCode(event.target.value)} />
          <Input label="كلمة المرور الجديدة" type="password" minLength={6} required value={password} onChange={(event) => setPassword(event.target.value)} />
          <Button type="submit" className="w-full" isLoading={isLoading}>حفظ كلمة المرور</Button>
        </form>
      </main>
    </Shell>
  );
}

function Shell({ children }: { children: React.ReactNode }) {
  return <div className="min-h-screen flex flex-col bg-[#F8FAFC]"><Navbar />{children}<Footer /></div>;
}
