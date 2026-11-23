import React from "react";
import { Navbar } from "@/shared/components/Navbar";
import { Footer } from "@/shared/components/Footer";
import { Shield01Icon } from "hugeicons-react";

export default function PrivacyPage() {
  return (
    <div className="min-h-screen flex flex-col bg-paper">
      <Navbar />

      <main className="flex-1 shell py-14 sm:py-20">
        <div className="mx-auto max-w-4xl">
          <header className="border-b border-line pb-8">
            <div className="flex items-center gap-3">
              <span className="size-2 rounded-full bg-signal" aria-hidden="true" />
              <span className="eyebrow font-latin text-muted">PROSTORE / POLICY</span>
            </div>
            <div className="mt-6 flex items-start gap-5">
              <span className="grid size-12 shrink-0 place-items-center rounded-2xl bg-brand text-white">
                <Shield01Icon size={24} />
              </span>
              <div>
                <h1 className="mt-1 text-4xl font-black leading-[1.15] tracking-[-0.035em] text-ink sm:text-5xl">
                  سياسة الخصوصية وأمان البيانات
                </h1>
                <p className="mt-3 text-sm text-muted">آخر تحديث: أكتوبر 2026</p>
              </div>
            </div>
          </header>

          <div className="surface mt-10 p-8 sm:p-12">
            <div className="divide-y divide-line">
              <section className="py-8 first:pt-0 last:pb-0">
                <h2 className="border-s-2 border-brand ps-4 text-base font-black text-ink">
                  1. المعلومات التي نجمعها
                </h2>
                <p className="mt-4 max-w-2xl text-sm leading-8 text-muted sm:text-[15px]">
                  نحن نلتزم بحماية خصوصية زوارنا وعملائنا. نقوم بجمع المعلومات اللازمة فقط لإتمام عمليات الشحن والتوصيل، مثل الاسم الكامل، رقم الهاتف، عنوان الشحن والبريد الإلكتروني.
                </p>
              </section>

              <section className="py-8 first:pt-0 last:pb-0">
                <h2 className="border-s-2 border-brand ps-4 text-base font-black text-ink">
                  2. أمان المدفوعات والبطاقات
                </h2>
                <p className="mt-4 max-w-2xl text-sm leading-8 text-muted sm:text-[15px]">
                  جميع المعاملات المالية والمدفوعات الإلكترونية تتم عبر بوابات دفع بنكية مشفرة بأعلى معايير التشفير (SSL 256-bit). نحن لا نقوم بتخزين أي أرقام بطاقات ائتمانية في خوادمنا.
                </p>
              </section>

              <section className="py-8 first:pt-0 last:pb-0">
                <h2 className="border-s-2 border-brand ps-4 text-base font-black text-ink">
                  3. مشاركة البيانات
                </h2>
                <p className="mt-4 max-w-2xl text-sm leading-8 text-muted sm:text-[15px]">
                  لا نقوم ببيع أو تأجير أو مشاركة بياناتك الشخصية مع أي طرف ثالث لأغراض تسويقية، وتقتصر المشاركة فقط مع شركات الشحن المعتمدة لتوصيل مشترياتك.
                </p>
              </section>
            </div>
          </div>
        </div>
      </main>

      <Footer />
    </div>
  );
}
