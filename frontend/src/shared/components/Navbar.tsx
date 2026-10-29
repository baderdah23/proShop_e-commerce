"use client";

import React, { useState } from "react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import {
  ShoppingBag01Icon,
  FavouriteIcon,
  Search01Icon,
  Menu01Icon,
  Cancel01Icon,
} from "hugeicons-react";

export function Navbar() {
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const pathname = usePathname();

  return (
    <header className="sticky top-0 z-40 w-full bg-[#F8FBFF]/95 backdrop-blur-xl border-b border-[#D9E6F2] shadow-[0_6px_24px_rgba(20,32,51,0.06)]">
      {/* Top Banner */}
      <div className="bg-[#142B45] text-white text-[12px] py-2 px-4 text-center font-medium">
        <span> شحن مجاني وسريع لكافة الطلبات فوق 100$ | كود خصم إضافي: </span>
        <span className="font-bold underline tracking-wider text-[#AACFF0]">
          PRO2026
        </span>
      </div>

      <div className="max-w-8xl mx-auto px-4 sm:px-6 lg:px-8 h-[76px] flex items-center justify-between gap-4">
        {/* Logo */}
        <Link href="/" className="flex items-center gap-3 select-none">
          <div className="w-11 h-11 rounded-xl bg-[#2B70BA] flex items-center justify-center text-white shadow-lg shadow-[#2B70BA]/25">
            <svg
              xmlns="http://www.w3.org/2000/svg"
              fill="none"
              viewBox="0 0 24 24"
              strokeWidth="1.5"
              stroke="currentColor"
              className="size-6"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                d="M13.5 21v-7.5a.75.75 0 0 1 .75-.75h3a.75.75 0 0 1 .75.75V21m-4.5 0H2.36m11.14 0H18m0 0h3.64m-1.39 0V9.349M3.75 21V9.349m0 0a3.001 3.001 0 0 0 3.75-.615A2.993 2.993 0 0 0 9.75 9.75c.896 0 1.7-.393 2.25-1.016a2.993 2.993 0 0 0 2.25 1.016c.896 0 1.7-.393 2.25-1.015a3.001 3.001 0 0 0 3.75.614m-16.5 0a3.004 3.004 0 0 1-.621-4.72l1.189-1.19A1.5 1.5 0 0 1 5.378 3h13.243a1.5 1.5 0 0 1 1.06.44l1.19 1.189a3 3 0 0 1-.621 4.72M6.75 18h3.75a.75.75 0 0 0 .75-.75V13.5a.75.75 0 0 0-.75-.75H6.75a.75.75 0 0 0-.75.75v3.75c0 .414.336.75.75.75Z"
              />
            </svg>
          </div>
          <div>
            <span className="font-extrabold text-xl tracking-tight text-[#1A1D2A] block leading-none">
              PRO<span className="text-[#6AABF0]">STORE</span>
            </span>
            <span className="text-[10px] text-[#64748B] font-medium tracking-wide">
              متجر الحواسيب والعتاد الاحترافي
            </span>
          </div>
        </Link>

        {/* Center Search Bar */}
        <div className="hidden md:flex flex-1 max-w-md mx-4">
          <form action="/products" method="GET" className="relative w-full">
            <Search01Icon
              size={18}
              color="#94A3B8"
              className="absolute start-3.5 top-1/2 -translate-y-1/2 pointer-events-none"
            />
            <input
              type="text"
              name="search"
              autoComplete="off"
              placeholder="ابحث عن معالجات، كروت شاشة، تجميعات..."
              className="w-full ps-10 pe-4 py-3 bg-white border border-[#D9E6F2] rounded-2xl text-sm focus:border-[#4F8FD8] focus:ring-4 focus:ring-[#4F8FD8]/10 transition-all placeholder:text-[#94A3B8]"
            />
          </form>
        </div>

        {/* Navigation Links */}
        <nav className="hidden lg:flex items-center gap-8 text-sm font-semibold text-[#475569]">
          <Link
            href="/"
            className={`transition-colors ${
              pathname === "/"
                ? "text-[#2B7BD4] font-bold"
                : "hover:text-[#6AABF0]"
            }`}
          >
            الرئيسية
          </Link>
          <Link
            href="/products"
            className={`transition-colors ${
              pathname === "/products"
                ? "text-[#2B7BD4] font-bold"
                : "hover:text-[#6AABF0]"
            }`}
          >
            كافة المنتجات
          </Link>
          <Link
            href="/categories"
            className={`transition-colors ${
              pathname === "/categories"
                ? "text-[#2B7BD4] font-bold"
                : "hover:text-[#6AABF0]"
            }`}
          >
            التصنيفات
          </Link>
        </nav>

        {/* Actions (Wishlist + Cart + Login) */}
        <div className="flex items-center gap-2.5">
          {/* Heart / Wishlist Icon */}
          <Link
            href="/wishlist"
            aria-label="قائمة المفضلة"
            className="w-10 h-10 rounded-xl border border-black/8 flex items-center justify-center text-[#475569] hover:bg-[#EEF5FC] hover:text-[#EF4444] transition-colors"
          >
            <FavouriteIcon size={20} />
          </Link>

          {/* Cart Icon */}
          <Link
            href="/cart"
            aria-label="سلة المشتريات"
            className="w-10 h-10 rounded-xl border border-black/8 flex items-center justify-center text-[#475569] hover:bg-[#EEF5FC] hover:text-[#2B7BD4] transition-colors"
          >
            <ShoppingBag01Icon size={20} />
          </Link>

          <Link
            href="/login"
            className="hidden sm:inline-flex items-center justify-center h-10 px-4 rounded-xl bg-[#2B70BA] text-white text-xs font-bold shadow-[0_8px_20px_rgba(43,112,186,0.22)] hover:bg-[#205B9B] transition-colors"
          >
            تسجيل الدخول
          </Link>

          {/* Mobile Menu Toggle */}
          <button
            type="button"
            onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
            className="lg:hidden w-10 h-10 rounded-xl border border-black/8 flex items-center justify-center text-[#475569]"
          >
            {mobileMenuOpen ? (
              <Cancel01Icon size={20} />
            ) : (
              <Menu01Icon size={20} />
            )}
          </button>
        </div>
      </div>

      {/* Mobile Drawer */}
      {mobileMenuOpen && (
        <div className="lg:hidden bg-white border-b border-black/10 px-6 py-4 space-y-3">
          <Link
            href="/"
            className="block py-2 text-sm font-medium text-[#475569] hover:text-[#6AABF0]"
            onClick={() => setMobileMenuOpen(false)}
          >
            الصفحة الرئيسية
          </Link>
          <Link
            href="/products"
            className="block py-2 text-sm font-medium text-[#475569] hover:text-[#6AABF0]"
            onClick={() => setMobileMenuOpen(false)}
          >
            كافة المنتجات
          </Link>
          <Link
            href="/categories"
            className="block py-2 text-sm font-medium text-[#475569] hover:text-[#6AABF0]"
            onClick={() => setMobileMenuOpen(false)}
          >
            التصنيفات
          </Link>
          <Link
            href="/wishlist"
            className="block py-2 text-sm font-medium text-[#475569] hover:text-[#EF4444]"
            onClick={() => setMobileMenuOpen(false)}
          >
            قائمة المفضلة
          </Link>
          <Link
            href="/cart"
            className="block py-2 text-sm font-medium text-[#475569] hover:text-[#6AABF0]"
            onClick={() => setMobileMenuOpen(false)}
          >
            سلة المشتريات
          </Link>
          <Link
            href="/login"
            className="block py-2 text-sm font-bold text-[#2B7BD4]"
            onClick={() => setMobileMenuOpen(false)}
          >
            تسجيل الدخول
          </Link>
        </div>
      )}
    </header>
  );
}
