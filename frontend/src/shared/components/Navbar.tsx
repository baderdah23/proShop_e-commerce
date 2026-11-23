"use client";

import { useState } from "react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import {
  ShoppingBag01Icon,
  FavouriteIcon,
  Menu01Icon,
  Cancel01Icon,
  UserIcon,
  ArrowRight01Icon,
} from "hugeicons-react";
import SearchBar from "./SearchBar";
import { BrandMark } from "./BrandMark";
import { useAuth } from "@/features/auth";
import { cn } from "@/shared/utils";

const links = [
  { href: "/", label: "الرئيسية" },
  { href: "/products", label: "كافة المنتجات" },
  { href: "/categories", label: "التصنيفات" },
];

export function Navbar() {
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const pathname = usePathname();
  const auth = useAuth();
  const user = auth?.user;

  return (
    <header className="relative z-40">
      <div className="border-b border-line bg-surface text-ink">
        <div className="shell flex h-9 items-center justify-between gap-4 text-[11px] font-medium">
          <div className="flex items-center gap-2.5">
            <span className="size-1.5 rounded-full bg-signal" />
            <span>شحن مجاني وسريع للطلبات فوق 100$</span>
          </div>
          <div className="hidden items-center gap-5 text-muted sm:flex">
            <span>ضمان رسمي 36 شهراً</span>
            <span className="hidden h-3 w-px bg-line md:block" />
            <span className="hidden items-center gap-2 font-latin md:flex">
              كود الخصم
              <span className="font-bold tracking-[0.14em] text-ink">PRO2026</span>
            </span>
          </div>
        </div>
      </div>

      <div className="sticky top-0 z-40 border-b border-line bg-paper/90 backdrop-blur-xl">
        <div className="shell flex h-[76px] items-center gap-5">
          <BrandMark />

          <div className="hidden flex-1 justify-center md:flex">
            <form className="relative w-full max-w-[420px]">
              <SearchBar />
            </form>
          </div>

          <nav className="hidden items-center gap-7 xl:flex">
            {links.map((link) => {
              const isActive = pathname === link.href;
              return (
                <Link
                  key={link.href}
                  href={link.href}
                  className={cn(
                    "relative py-2 text-[13px] font-bold transition-colors",
                    isActive ? "text-brand" : "text-ink/65 hover:text-ink",
                  )}
                >
                  {link.label}
                  {isActive && (
                    <span className="absolute -bottom-0.5 inset-x-0 h-0.5 rounded-full bg-brand" />
                  )}
                </Link>
              );
            })}
          </nav>

          <div className="flex items-center gap-2">
            <Link
              href="/wishlist"
              aria-label="قائمة المفضلة"
              className="grid size-10 place-items-center rounded-xl border border-line bg-surface text-ink/60 transition-all hover:border-sale/30 hover:bg-sale/5 hover:text-sale"
            >
              <FavouriteIcon size={19} />
            </Link>
            <Link
              href="/cart"
              aria-label="سلة المشتريات"
              className="grid size-10 place-items-center rounded-xl border border-line bg-surface text-ink/60 transition-all hover:border-brand/30 hover:bg-brand-soft hover:text-brand"
            >
              <ShoppingBag01Icon size={19} />
            </Link>

            <div className="hidden sm:block">
              {!user ? (
                <Link
                  href="/login"
                  className="liquid-glass-btn inline-flex h-10 items-center justify-center rounded-xl px-5 text-xs font-bold"
                >
                  تسجيل الدخول
                </Link>
              ) : (
                <Link
                  href="/account"
                  className="inline-flex h-10 items-center gap-2.5 rounded-xl bg-ink px-3.5 text-xs font-bold text-white transition-colors hover:bg-brand"
                >
                  <span className="grid size-6 place-items-center rounded-lg bg-white/15">
                    <UserIcon size={14} />
                  </span>
                  <span className="max-w-[110px] truncate">{user.full_name || "حسابي"}</span>
                </Link>
              )}
            </div>

            <button
              type="button"
              onClick={() => setMobileMenuOpen((open) => !open)}
              aria-label={mobileMenuOpen ? "إغلاق القائمة" : "فتح القائمة"}
              aria-expanded={mobileMenuOpen}
              className="grid size-10 place-items-center rounded-xl border border-line bg-surface text-ink lg:hidden"
            >
              {mobileMenuOpen ? <Cancel01Icon size={20} /> : <Menu01Icon size={20} />}
            </button>
          </div>
        </div>
      </div>

      {mobileMenuOpen && (
        <div className="border-b border-line bg-surface shadow-[0_20px_40px_rgba(16,22,30,0.08)] lg:hidden">
          <nav className="shell divide-y divide-line py-2">
            {links.map((link) => (
              <Link
                key={link.href}
                href={link.href}
                onClick={() => setMobileMenuOpen(false)}
                className="flex items-center justify-between py-4 text-sm font-bold text-ink/80"
              >
                {link.label}
                <ArrowRight01Icon size={16} className="rotate-180 text-muted" />
              </Link>
            ))}
            <Link
              href="/wishlist"
              onClick={() => setMobileMenuOpen(false)}
              className="flex items-center justify-between py-4 text-sm font-bold text-ink/80"
            >
              قائمة المفضلة
              <ArrowRight01Icon size={16} className="rotate-180 text-muted" />
            </Link>
            <Link
              href="/cart"
              onClick={() => setMobileMenuOpen(false)}
              className="flex items-center justify-between py-4 text-sm font-bold text-ink/80"
            >
              سلة المشتريات
              <ArrowRight01Icon size={16} className="rotate-180 text-muted" />
            </Link>
            {!user ? (
              <Link
                href="/login"
                onClick={() => setMobileMenuOpen(false)}
                className="flex items-center justify-between py-4 text-sm font-bold text-brand"
              >
                تسجيل الدخول
                <ArrowRight01Icon size={16} className="rotate-180" />
              </Link>
            ) : (
              <Link
                href="/account"
                onClick={() => setMobileMenuOpen(false)}
                className="flex items-center gap-2 py-4 text-sm font-bold text-ink"
              >
                <UserIcon size={18} />
                <span>{user.full_name || "حسابي"}</span>
              </Link>
            )}
          </nav>
        </div>
      )}
    </header>
  );
}
