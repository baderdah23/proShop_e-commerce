import Link from "next/link";
import {
  Mail01Icon,
  Call02Icon,
  Shield01Icon,
  ArrowRight01Icon,
} from "hugeicons-react";
import { BrandMark } from "./BrandMark";

const quickLinks = [
  { label: "الصفحة الرئيسية", href: "/" },
  { label: "كافة المنتجات والعروض", href: "/products" },
  { label: "تصفح الفئات", href: "/categories" },
  { label: "سلة المشتريات", href: "/cart" },
];

const categoryLinks = [
  { label: "كروت الشاشة (GPUs)", href: "/products?category=1" },
  { label: "المعالجات (CPUs)", href: "/products?category=2" },
  { label: "لابتوبات الألعاب عالية الأداء", href: "/products?category=3" },
  { label: "لوحات الأم والرامات", href: "/products?category=4" },
];

export function Footer() {
  return (
    <footer className="mt-auto border-t border-line bg-surface">
      <div className="shell pt-16 pb-8 sm:pt-20">
        <div className="grid grid-cols-1 gap-12 border-b border-line pb-14 md:grid-cols-2 lg:grid-cols-12">
          <div className="lg:col-span-4">
            <BrandMark />
            <p className="mt-6 max-w-xs text-[13px] leading-7 text-muted">
              وجهة متخصصة لتجميعات الألعاب، أجهزة الإنتاج وقطع الحواسيب.
              نختار كل قطعة بعناية، ونختبرها قبل أن تصل إليك.
            </p>
            <div className="mt-6 inline-flex items-center gap-2 rounded-full border border-line bg-paper px-3.5 py-1.5 text-[11px] font-bold text-ink">
              <Shield01Icon size={14} />
              ضمان معتمد 36 شهراً
            </div>
          </div>

          <div className="lg:col-span-2">
            <h3 className="eyebrow mb-5 text-muted">استكشف</h3>
            <ul className="space-y-3.5 text-[13px] text-muted">
              {quickLinks.map((link) => (
                <li key={link.href}>
                  <Link href={link.href} className="transition-colors hover:text-ink">
                    {link.label}
                  </Link>
                </li>
              ))}
            </ul>
          </div>

          <div className="lg:col-span-2">
            <h3 className="eyebrow mb-5 text-muted">الأقسام</h3>
            <ul className="space-y-3.5 text-[13px] text-muted">
              {categoryLinks.map((link) => (
                <li key={link.href}>
                  <Link href={link.href} className="transition-colors hover:text-ink">
                    {link.label}
                  </Link>
                </li>
              ))}
            </ul>
          </div>

          <div className="lg:col-span-4">
            <h3 className="eyebrow mb-5 text-muted">ابقَ على اطلاع</h3>
            <p className="mb-5 max-w-sm text-[13px] leading-6 text-muted">
              اشترك في نشرتنا لتصلك العروض الحقيقية وإصدارات العتاد الجديدة.
            </p>
            <form className="flex max-w-sm items-center gap-2 rounded-2xl border border-line bg-paper p-1.5 focus-within:border-ink">
              <input
                type="email"
                placeholder="بريدك الإلكتروني"
                aria-label="البريد الإلكتروني للاشتراك في النشرة"
                className="min-w-0 flex-1 bg-transparent px-3 text-[13px] text-ink outline-none placeholder:text-muted/70"
              />
              <button
                type="button"
                className="liquid-glass-btn grid size-9 shrink-0 place-items-center rounded-xl"
                aria-label="اشتراك في النشرة"
              >
                <ArrowRight01Icon size={16} className="rotate-180" />
              </button>
            </form>
            <div className="mt-6 space-y-2.5 text-[12px] text-muted">
              <div className="flex items-center gap-2.5">
                <Call02Icon size={15} className="text-ink" />
                <span dir="ltr">+966 50 123 4567</span>
              </div>
              <div className="flex items-center gap-2.5">
                <Mail01Icon size={15} className="text-ink" />
                <span>support@pro-ecommerce.com</span>
              </div>
            </div>
          </div>
        </div>

        <div className="flex flex-col gap-5 pt-7 text-[12px] text-muted sm:flex-row sm:items-center sm:justify-between">
          <p className="font-latin">© {new Date().getFullYear()} PROSTORE. جميع الحقوق محفوظة.</p>
          <div className="flex items-center gap-6">
            <Link href="/privacy" className="transition-colors hover:text-ink">
              سياسة الخصوصية
            </Link>
            <Link href="/terms" className="transition-colors hover:text-ink">
              شروط الاستخدام
            </Link>
          </div>
        </div>
      </div>
    </footer>
  );
}
