import React from "react";
import { Navbar } from "@/shared/components/Navbar";
import { Footer } from "@/shared/components/Footer";
import { Shield01Icon } from "hugeicons-react";

export default function PrivacyPage() {
  return (
    <div className="min-h-screen flex flex-col bg-[#F8FAFC]">
      <Navbar />

      <main className="flex-1 max-w-4xl w-full mx-auto px-4 sm:px-6 lg:px-8 py-12 space-y-8">
        <div className="flex items-center gap-3 pb-4 border-b border-slate-200">
          <div className="w-10 h-10 rounded-xl bg-blue-50 text-blue-600 flex items-center justify-center">
            <Shield01Icon size={22} />
          </div>
          <div>
            <h1 className="text-2xl font-black text-slate-900">سياسة الخصوصية وأمان البيانات</h1>
            <p className="text-xs text-slate-500">آخر تحديث: أكتوبر 2026</p>
          </div>
        </div>

        <div className="bg-white p-8 rounded-3xl border border-black/8 shadow-sm space-y-6 text-sm text-slate-600 leading-relaxed">
          <section className="space-y-2">
            <h2 className="text-base font-bold text-slate-900">1. المعلومات التي نجمعها</h2>
            <p>
              نحن نلتزم بحماية خصوصية زوارنا وعملائنا. نقوم بجمع المعلومات اللازمة فقط لإتمام عمليات الشحن والتوصيل، مثل الاسم الكامل، رقم الهاتف، عنوان الشحن والبريد الإلكتروني.
            </p>
          </section>

          <section className="space-y-2">
            <h2 className="text-base font-bold text-slate-900">2. أمان المدفوعات والبطاقات</h2>
            <p>
              جميع المعاملات المالية والمدفوعات الإلكترونية تتم عبر بوابات دفع بنكية مشفرة بأعلى معايير التشفير (SSL 256-bit). نحن لا نقوم بتخزين أي أرقام بطاقات ائتمانية في خوادمنا.
            </p>
          </section>

          <section className="space-y-2">
            <h2 className="text-base font-bold text-slate-900">3. مشاركة البيانات</h2>
            <p>
              لا نقوم ببيع أو تأجير أو مشاركة بياناتك الشخصية مع أي طرف ثالث لأغراض تسويقية، وتقتصر المشاركة فقط مع شركات الشحن المعتمدة لتوصيل مشترياتك.
            </p>
          </section>
        </div>
      </main>

      <Footer />
    </div>
  );
}
