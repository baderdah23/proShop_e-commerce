import React from "react";
import { Navbar } from "@/shared/components/Navbar";
import { Footer } from "@/shared/components/Footer";
import { File01Icon } from "hugeicons-react";

export default function TermsPage() {
  return (
    <div className="min-h-screen flex flex-col bg-paper">
      <Navbar />

      <main className="flex-1 shell py-14 sm:py-20">
        <div className="mx-auto max-w-4xl">
          <header className="border-b border-line pb-8">
            <div className="flex items-center gap-3">
              <span className="size-2 rounded-full bg-signal" aria-hidden="true" />
              <span className="eyebrow font-latin text-muted">PROSTORE / TERMS</span>
            </div>
            <div className="mt-6 flex items-start gap-5">
              <span className="grid size-12 shrink-0 place-items-center rounded-2xl bg-brand text-white">
                <File01Icon size={24} />
              </span>
              <div>
                <h1 className="mt-1 text-4xl font-black leading-[1.15] tracking-[-0.035em] text-ink sm:text-5xl">
                  شروط وأحكام الاستخدام والضمان
                </h1>
                <p className="mt-3 text-sm text-muted">سارية على كافة المشتريات والتجميعات</p>
              </div>
            </div>
          </header>

          <div className="surface mt-10 p-8 sm:p-12">
            <div className="divide-y divide-line">
              <section className="py-8 first:pt-0 last:pb-0">
                <h2 className="border-s-2 border-brand ps-4 text-base font-black text-ink">
                  1. شروط الضمان والاستبدال
                </h2>
                <p className="mt-4 max-w-2xl text-sm leading-8 text-muted sm:text-[15px]">
                  تتمتع جميع المنتجات الإلكترونية وقطع الهاردوير بضمان صيانة واستبدال رسمي يتراوح بين 12 إلى 36 شهراً ضد عيوب الصناعة من تاريخ استلام الطلب.
                </p>
              </section>

              <section className="py-8 first:pt-0 last:pb-0">
                <h2 className="border-s-2 border-brand ps-4 text-base font-black text-ink">
                  2. سياسة الشحن والتوصيل
                </h2>
                <p className="mt-4 max-w-2xl text-sm leading-8 text-muted sm:text-[15px]">
                  يتم تجهيز وشحن الطلبات خلال 24 ساعة من تأكيد الدفع، وتستغرق مدة التوصيل بين يومين إلى 4 أيام عمل حسب المدينة وموقع العميل.
                </p>
              </section>

              <section className="py-8 first:pt-0 last:pb-0">
                <h2 className="border-s-2 border-brand ps-4 text-base font-black text-ink">
                  3. الإلغاء والاسترجاع
                </h2>
                <p className="mt-4 max-w-2xl text-sm leading-8 text-muted sm:text-[15px]">
                  يحق للعميل إرجاع المنتج غير المفتوح وفي حالته الأصلية خلال 7 أيام من تاريخ الاستلام، مع استرداد كامل المبلغ المدفوع.
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
