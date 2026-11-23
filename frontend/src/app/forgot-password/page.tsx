import Link from "next/link";
import { Button } from "@/shared/components/Button";
import { Input } from "@/shared/components/Input";
import { Navbar } from "@/shared/components/Navbar";
import { Footer } from "@/shared/components/Footer";
import { BrandMark } from "@/shared/components/BrandMark";
import { LockPasswordIcon, Shield01Icon, Ticket01Icon } from "hugeicons-react";

export default function ForgotPasswordPage() {
  return (
    <Shell>
      <main className="flex flex-1 items-center justify-center p-4 sm:p-6 lg:p-10">
        <div className="surface w-full max-w-4xl overflow-hidden shadow-[0_30px_80px_-48px_rgba(10,11,10,0.16)] lg:grid lg:grid-cols-[1.1fr_0.9fr]">
          <form className="space-y-6 p-8 sm:p-12">
            <div className="space-y-3">
              <span className="eyebrow inline-flex items-center gap-2 text-brand">
                <LockPasswordIcon size={14} />
                استعادة الوصول
              </span>
              <h1 className="text-3xl font-black leading-tight tracking-[-0.03em] text-ink">
                نسيت كلمة المرور؟
              </h1>
              <p className="text-sm leading-relaxed text-muted">
                أدخل بريدك لنرسل لك رمز إعادة التعيين.
              </p>
            </div>

            <Input label="البريد الإلكتروني" type="email" required />
            <Button type="submit" className="w-full">إرسال الرمز</Button>
            <Link
              href="/login"
              className="block text-center text-sm font-bold text-brand transition-colors hover:text-brand-deep hover:underline"
            >
              العودة لتسجيل الدخول
            </Link>
          </form>

          <aside className="blueprint relative hidden overflow-hidden p-12 text-ink lg:flex lg:flex-col lg:justify-between lg:border-s lg:border-line">
            <BrandMark tone="dark" />

            <div className="relative z-10 space-y-6">
              <span className="font-latin text-[11px] font-bold tracking-[0.22em] text-muted">
                PROSTORE / RECOVERY
              </span>
              <h2 className="max-w-xs text-4xl font-black leading-[1.15] tracking-[-0.035em] text-ink">
                استعد حسابك
                <br />
                <span className="text-brand">بخطوة واحدة.</span>
              </h2>
              <p className="max-w-xs text-sm leading-relaxed text-muted">
                نرسل رمز تحقق آمن إلى بريدك المسجل لتتمكن من متابعة التسوق بثقة.
              </p>
              <div className="flex gap-3 pt-2">
                <span className="grid size-11 place-items-center rounded-2xl border border-line bg-surface/80 text-brand">
                  <Shield01Icon size={20} />
                </span>
                <span className="grid size-11 place-items-center rounded-2xl border border-line bg-surface/80 text-brand">
                  <Ticket01Icon size={20} />
                </span>
              </div>
            </div>

            <p className="font-latin relative z-10 text-[11px] tracking-[0.2em] text-muted">
              EST. 2026 — PROSTORE
            </p>
          </aside>
        </div>
      </main>
    </Shell>
  );
}

function Shell({ children }: { children: React.ReactNode }) {
  return <div className="min-h-screen flex flex-col bg-paper"><Navbar />{children}<Footer /></div>;
}
