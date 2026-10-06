import React from "react";
import { Navbar } from "@/shared/components/Navbar";
import { Footer } from "@/shared/components/Footer";
import { File01Icon } from "hugeicons-react";

export default function TermsPage() {
  return (
    <div className="min-h-screen flex flex-col bg-[#F8FAFC]">
      <Navbar />

      <main className="flex-1 max-w-4xl w-full mx-auto px-4 sm:px-6 lg:px-8 py-12 space-y-8">
        <div className="flex items-center gap-3 pb-4 border-b border-slate-200">
          <div className="w-10 h-10 rounded-xl bg-blue-50 text-blue-600 flex items-center justify-center">
            <File01Icon size={22} />
          </div>
          <div>
            <h1 className="text-2xl font-black text-slate-900">شروط وأحكام الاستخدام والضمان</h1>
            <p className="text-xs text-slate-500">سارية على كافة المشتريات والتجميعات</p>
          </div>
        </div>

        <div className="bg-white p-8 rounded-3xl border border-black/8 shadow-sm space-y-6 text-sm text-slate-600 leading-relaxed">
          <section className="space-y-2">
            <h2 className="text-base font-bold text-slate-900">1. شروط الضمان والاستبدال</h2>
            <p>
              تتمتع جميع المنتجات الإلكترونية وقطع الهاردوير بضمان صيانة واستبدال رسمي يتراوح بين 12 إلى 36 شهراً ضد عيوب الصناعة من تاريخ استلام الطلب.
            </p>
          </section>

          <section className="space-y-2">
            <h2 className="text-base font-bold text-slate-900">2. سياسة الشحن والتوصيل</h2>
            <p>
              يتم تجهيز وشحن الطلبات خلال 24 ساعة من تأكيد الدفع، وتستغرق مدة التوصيل بين يومين إلى 4 أيام عمل حسب المدينة وموقع العميل.
            </p>
          </section>

          <section className="space-y-2">
            <h2 className="text-base font-bold text-slate-900">3. الإلغاء والاسترجاع</h2>
            <p>
              يحق للعميل إرجاع المنتج غير المفتوح وفي حالته الأصلية خلال 7 أيام من تاريخ الاستلام، مع استرداد كامل المبلغ المدفوع.
            </p>
          </section>
        </div>
      </main>

      <Footer />
    </div>
  );
}
