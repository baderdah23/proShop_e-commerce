import { Button } from "@/shared/components/Button";
import { Input } from "@/shared/components/Input";
import { Navbar } from "@/shared/components/Navbar";
import { Footer } from "@/shared/components/Footer";
import { BrandMark } from "@/shared/components/BrandMark";
import { LockPasswordIcon, Shield01Icon, CheckmarkCircle01Icon } from "hugeicons-react";

export default function ResetPasswordPage() {
  return (
    <Shell>
      <main className="flex flex-1 items-center justify-center p-4 sm:p-6 lg:p-10">
        <div className="surface w-full max-w-4xl overflow-hidden shadow-[0_30px_80px_-48px_rgba(10,11,10,0.16)] lg:grid lg:grid-cols-[1.1fr_0.9fr]">
          <form className="space-y-6 p-8 sm:p-12">
            <div className="space-y-3">
              <span className="eyebrow inline-flex items-center gap-2 text-brand">
                <LockPasswordIcon size={14} />
                كلمة مرور جديدة
              </span>
              <h1 className="text-3xl font-black leading-tight tracking-[-0.03em] text-ink">
                إعادة تعيين كلمة المرور
              </h1>
            </div>

            <div className="space-y-4">
              <Input label="البريد الإلكتروني" type="email" required />
              <Input label="رمز التحقق" inputMode="numeric" pattern="[0-9]{6}" minLength={6} maxLength={6} required />
              <Input label="كلمة المرور الجديدة" type="password" minLength={6} required />
            </div>

            <Button type="submit" className="w-full">حفظ كلمة المرور</Button>
          </form>

          <aside className="blueprint relative hidden overflow-hidden p-12 text-ink lg:flex lg:flex-col lg:justify-between lg:border-s lg:border-line">
            <BrandMark tone="dark" />

            <div className="relative z-10 space-y-6">
              <span className="font-latin text-[11px] font-bold tracking-[0.22em] text-muted">
                PROSTORE / SECURITY
              </span>
              <h2 className="max-w-xs text-4xl font-black leading-[1.15] tracking-[-0.035em] text-ink">
                حسابك محمي
                <br />
                <span className="text-brand">بكل خطوة.</span>
              </h2>
              <p className="max-w-xs text-sm leading-relaxed text-muted">
                اختر كلمة مرور قوية وفريدة لتحافظ على أمان طلباتك وبياناتك.
              </p>
              <div className="flex gap-3 pt-2">
                <span className="grid size-11 place-items-center rounded-2xl border border-line bg-surface/80 text-brand">
                  <Shield01Icon size={20} />
                </span>
                <span className="grid size-11 place-items-center rounded-2xl border border-line bg-surface/80 text-brand">
                  <CheckmarkCircle01Icon size={20} />
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
