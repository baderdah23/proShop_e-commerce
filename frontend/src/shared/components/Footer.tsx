import React from "react";
import Link from "next/link";
import { Store01Icon, Mail01Icon, Call02Icon, Shield01Icon } from "hugeicons-react";

export function Footer() {
  return (
    <footer className="bg-gradient-to-b from-[#0D1B2A] via-[#0A1520] to-[#0D1B2A] text-white pt-16 pb-10 border-t border-[#6AABF0]/15 mt-auto">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-10 pb-12 border-b border-slate-800/80">
          {/* Col 1: About */}
          <div className="space-y-4">
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-[#6AABF0] to-[#2B7BD4] flex items-center justify-center text-white shadow-lg shadow-[#6AABF0]/20">
                <Store01Icon size={22} color="white" />
              </div>
              <span className="font-extrabold text-lg tracking-tight">
                PRO<span className="text-[#38BDF8]">STORE</span>
              </span>
            </div>
            <p className="text-xs text-slate-400 leading-relaxed">
              الوجهة الرائدة لتجميعات الألعاب الاحترافية، أجهزة الإنتاج وصناع المحتوى، وقطع الحواسيب في الشرق الأوسط. ضمان رسمي وشحن سريع وموثوق.
            </p>
            <div className="flex items-center gap-2 pt-2">
              <span className="inline-flex items-center gap-1.5 text-xs text-emerald-400 bg-emerald-500/10 px-3 py-1 rounded-full border border-emerald-500/20">
                <Shield01Icon size={14} color="#34D399" />
                <span>ضمان صيانة معتمد 36 شهراً</span>
              </span>
            </div>
          </div>

          {/* Col 2: Quick Links */}
          <div>
            <h4 className="font-bold text-sm text-slate-200 mb-4">روابط سريعة</h4>
            <ul className="space-y-2.5 text-xs text-slate-400">
              <li>
                <Link href="/" className="hover:text-white transition-colors">
                  الصفحة الرئيسية
                </Link>
              </li>
              <li>
                <Link href="/products" className="hover:text-white transition-colors">
                  كافة المنتجات والعروض
                </Link>
              </li>
              <li>
                <Link href="/categories" className="hover:text-white transition-colors">
                  تصفح الفئات
                </Link>
              </li>
              <li>
                <Link href="/cart" className="hover:text-white transition-colors">
                  سلة المشتريات
                </Link>
              </li>
            </ul>
          </div>

          {/* Col 3: Categories */}
          <div>
            <h4 className="font-bold text-sm text-slate-200 mb-4">أشهر الأقسام</h4>
            <ul className="space-y-2.5 text-xs text-slate-400">
              <li>
                <Link href="/products?category=1" className="hover:text-white transition-colors">
                  كروت الشاشة (GPUs)
                </Link>
              </li>
              <li>
                <Link href="/products?category=2" className="hover:text-white transition-colors">
                  المعالجات (CPUs)
                </Link>
              </li>
              <li>
                <Link href="/products?category=3" className="hover:text-white transition-colors">
                  لابتوبات الألعاب عالية الأداء
                </Link>
              </li>
              <li>
                <Link href="/products?category=4" className="hover:text-white transition-colors">
                  لوحات الأم والرامات
                </Link>
              </li>
            </ul>
          </div>

          {/* Col 4: Contact & Newsletter */}
          <div className="space-y-3">
            <h4 className="font-bold text-sm text-slate-200 mb-4">خدمة العملاء</h4>
            <div className="flex items-center gap-3 text-xs text-slate-400">
              <Call02Icon size={16} color="#6AABF0" />
              <span dir="ltr">+966 50 123 4567</span>
            </div>
            <div className="flex items-center gap-3 text-xs text-slate-400">
              <Mail01Icon size={16} color="#6AABF0" />
              <span>support@pro-ecommerce.com</span>
            </div>
            <div className="pt-2">
              <p className="text-[11px] text-slate-400 mb-2">اشترك في النشرة البريدية للحصول على أكواد الخصم:</p>
              <div className="flex items-center gap-2">
                <input
                  type="email"
                  placeholder="بريدك الإلكتروني"
                  className="bg-slate-900 border border-slate-700 rounded-xl px-3 py-2 text-xs text-white focus:outline-none focus:border-blue-500 w-full"
                />
                <button
                  type="button"
                  className="liquid-glass-btn px-3.5 py-2 rounded-xl text-xs font-bold text-white transition-colors shrink-0 cursor-pointer"
                >
                  اشتراك
                </button>
              </div>
            </div>
          </div>
        </div>

        {/* Bottom Bar without admin links */}
        <div className="pt-8 flex flex-col sm:flex-row items-center justify-between gap-4 text-xs text-slate-500">
          <p>© {new Date().getFullYear()} PROSTORE. جميع الحقوق محفوظة.</p>
          <div className="flex items-center gap-6">
            <Link href="/privacy" className="hover:text-slate-300 transition-colors">
              سياسة الخصوصية
            </Link>
            <Link href="/terms" className="hover:text-slate-300 transition-colors">
              شروط الاستخدام
            </Link>
          </div>
        </div>
      </div>
    </footer>
  );
}
