import { Button } from "@/shared/components/Button";
import { Input } from "@/shared/components/Input";
import { Navbar } from "@/shared/components/Navbar";
import { Footer } from "@/shared/components/Footer";

export default function ResetPasswordPage() {
  return (
    <Shell>
      <main className="flex-1 flex items-center justify-center p-4">
        <form className="w-full max-w-md bg-white p-8 rounded-3xl border space-y-5">
          <h1 className="text-2xl font-black">إعادة تعيين كلمة المرور</h1>
          <Input label="البريد الإلكتروني" type="email" required />
          <Input label="رمز التحقق" inputMode="numeric" pattern="[0-9]{6}" minLength={6} maxLength={6} required />
          <Input label="كلمة المرور الجديدة" type="password" minLength={6} required />
          <Button type="submit" className="w-full">حفظ كلمة المرور</Button>
        </form>
      </main>
    </Shell>
  );
}

function Shell({ children }: { children: React.ReactNode }) {
  return <div className="min-h-screen flex flex-col bg-[#F8FAFC]"><Navbar />{children}<Footer /></div>;
}
