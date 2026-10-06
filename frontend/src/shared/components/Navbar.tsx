"use client";

import React, { useEffect, useState } from "react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import {
  ShoppingBag01Icon,
  FavouriteIcon,
  User02Icon,
  Search01Icon,
  Menu01Icon,
  Cancel01Icon,
  Store01Icon,
} from "hugeicons-react";
import { Button } from "./Button";
import { useAuth } from "@/features/auth";
import { toast } from "sonner";
import { CartApi, WishlistApi } from "@/lib/api-client";
import { ProductsApi } from "@/lib/api-client";
import type { Product } from "@/shared/types";
import { isExcludedProduct } from "@/shared/utils/product-images";

export function Navbar() {
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const pathname = usePathname();
  const { user, logout } = useAuth();
  const [cartCount, setCartCount] = useState(0);
  const [wishlistCount, setWishlistCount] = useState(0);
  const [searchTerm, setSearchTerm] = useState("");
  const [suggestions, setSuggestions] = useState<Product[]>([]);

  useEffect(() => {
    if (!user) {
      return;
    }
    Promise.all([CartApi.get(), WishlistApi.getAll()])
      .then(([cart, wishlist]) => {
        setCartCount(cart.total_items);
        setWishlistCount(wishlist.length);
      })
      .catch(() => undefined);
  }, [user]);

  useEffect(() => {
    const refreshCounts = () => {
      if (!user) return;
      Promise.all([CartApi.get(), WishlistApi.getAll()])
        .then(([cart, wishlist]) => {
          setCartCount(cart.total_items);
          setWishlistCount(wishlist.length);
        })
        .catch(() => undefined);
    };

    window.addEventListener("prostore:cart-updated", refreshCounts);
    window.addEventListener("prostore:wishlist-updated", refreshCounts);
    return () => {
      window.removeEventListener("prostore:cart-updated", refreshCounts);
      window.removeEventListener("prostore:wishlist-updated", refreshCounts);
    };
  }, [user]);

  useEffect(() => {
    if (searchTerm.trim().length < 2) {
      return;
    }
    const timer = window.setTimeout(() => {
      ProductsApi.getAll({ search: searchTerm, limit: 5 })
        .then((result) =>
          setSuggestions(result.products.filter((product) => !isExcludedProduct(product))),
        )
        .catch(() => setSuggestions([]));
    }, 250);
    return () => window.clearTimeout(timer);
  }, [searchTerm]);

  const visibleSuggestions = searchTerm.trim().length < 2 ? [] : suggestions;

  const handleLogout = async () => {
    try {
      await logout();
      toast.success("تم تسجيل الخروج بنجاح.");
    } catch (error) {
      toast.error(
        error instanceof Error ? error.message : "تعذر تسجيل الخروج.",
      );
    }
  };

  return (
    <header className="sticky top-0 z-40 w-full bg-[#F8FBFF]/95 backdrop-blur-xl border-b border-[#D9E6F2] shadow-[0_6px_24px_rgba(20,32,51,0.06)]">
      {/* Top Banner */}
      <div className="bg-[#142B45] text-white text-[12px] py-2 px-4 text-center font-medium">
        <span>⚡ شحن مجاني وسريع لكافة الطلبات فوق 100$ | كود خصم إضافي: </span>
        <span className="font-bold underline tracking-wider text-[#AACFF0]">PRO2026</span>
      </div>

      <div className="max-w-8xl mx-auto px-4 sm:px-6 lg:px-8 h-[76px] flex items-center justify-between gap-4">
        {/* Logo */}
        <Link href="/" className="flex items-center gap-3 select-none">
          <div className="w-11 h-11 rounded-xl bg-[#2B70BA] flex items-center justify-center text-white shadow-lg shadow-[#2B70BA]/25">
            <Store01Icon size={24} color="white" />
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
              value={searchTerm}
              onChange={(event) => setSearchTerm(event.target.value)}
              onBlur={() => window.setTimeout(() => setSuggestions([]), 150)}
              autoComplete="off"
              placeholder="ابحث عن معالجات، كروت شاشة، تجميعات..."
              className="w-full ps-10 pe-4 py-3 bg-white border border-[#D9E6F2] rounded-2xl text-sm focus:border-[#4F8FD8] focus:ring-4 focus:ring-[#4F8FD8]/10 transition-all placeholder:text-[#94A3B8]"
            />
            {visibleSuggestions.length > 0 && (
              <div className="absolute top-full start-0 end-0 mt-2 rounded-xl border border-black/10 bg-white shadow-lg overflow-hidden z-50">
                {visibleSuggestions.map((product) => (
                  <Link key={product.product_id} href={`/products/${encodeURIComponent(product.slug)}?id=${encodeURIComponent(product.product_id)}`} className="block px-4 py-3 text-xs hover:bg-[#F8FAFC]" onMouseDown={(event) => event.preventDefault()}>
                    {product.name}
                  </Link>
                ))}
              </div>
            )}
          </form>
        </div>

        {/* Navigation Links */}
        <nav className="hidden lg:flex items-center gap-8 text-sm font-semibold text-[#475569]">
          <Link
            href="/"
            className={`transition-colors ${
              pathname === "/" ? "text-[#2B7BD4] font-bold" : "hover:text-[#6AABF0]"
            }`}
          >
            الرئيسية
          </Link>
          <Link
            href="/products"
            className={`transition-colors ${
              pathname === "/products" ? "text-[#2B7BD4] font-bold" : "hover:text-[#6AABF0]"
            }`}
          >
            كافة المنتجات
          </Link>
          <Link
            href="/categories"
            className={`transition-colors ${
              pathname === "/categories" ? "text-[#2B7BD4] font-bold" : "hover:text-[#6AABF0]"
            }`}
          >
            التصنيفات
          </Link>
        </nav>

        {/* Actions (Wishlist Icon with badge + Cart + Profile) */}
        <div className="flex items-center gap-2.5">
          {/* Heart / Wishlist Icon */}
          <Link
            href="/wishlist"
            aria-label="قائمة المفضلة"
            className="relative w-10 h-10 rounded-xl border border-black/8 flex items-center justify-center text-[#475569] hover:bg-[#EEF5FC] hover:text-[#EF4444] transition-colors"
          >
            <FavouriteIcon size={20} />
            {wishlistCount > 0 && <span className="absolute -top-1 -end-1 w-4 h-4 rounded-full bg-[#EF4444] text-[10px] font-bold text-white flex items-center justify-center shadow-xs">{wishlistCount}</span>}
          </Link>

          {/* Cart Icon */}
          <Link
            href="/cart"
            aria-label="سلة المشتريات"
            className="relative w-10 h-10 rounded-xl border border-black/8 flex items-center justify-center text-[#475569] hover:bg-[#EEF5FC] hover:text-[#2B7BD4] transition-colors"
          >
            <ShoppingBag01Icon size={20} />
            {cartCount > 0 && <span className="absolute -top-1 -end-1 w-4 h-4 rounded-full bg-[#6AABF0] text-[10px] font-bold text-white flex items-center justify-center shadow-xs">{cartCount}</span>}
          </Link>

          {user ? (
            <div className="hidden sm:flex items-center gap-2">
              <Link
                href="/account"
                aria-label="الملف الشخصي"
                className="w-10 h-10 rounded-xl border border-black/8 flex items-center justify-center text-[#475569] hover:bg-[#EEF5FC] hover:text-[#2B7BD4] transition-colors"
              >
                <User02Icon size={20} />
              </Link>
              <Link
                href="/account"
                className="text-xs font-bold text-[#475569] hover:text-[#2B7BD4]"
              >
                مرحباً، {user.full_name}
              </Link>
              <Button
                variant="ghost"
                size="sm"
                className="text-xs"
                onClick={handleLogout}
              >
                تسجيل الخروج
              </Button>
            </div>
          ) : (
            <Link href="/login" className="hidden sm:inline-flex">
              <Button variant="secondary" size="sm" className="gap-2">
                <User02Icon size={16} color="#2B7BD4" />
                <span>تسجيل الدخول</span>
              </Button>
            </Link>
          )}

          {/* Mobile Menu Toggle */}
          <button
            type="button"
            onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
            className="lg:hidden w-10 h-10 rounded-xl border border-black/8 flex items-center justify-center text-[#475569]"
          >
            {mobileMenuOpen ? <Cancel01Icon size={20} /> : <Menu01Icon size={20} />}
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
            قائمة المفضلة (3)
          </Link>
          <Link
            href="/cart"
            className="block py-2 text-sm font-medium text-[#475569] hover:text-[#6AABF0]"
            onClick={() => setMobileMenuOpen(false)}
          >
            سلة المشتريات
          </Link>
          {user ? (
            <>
              <Link
                href="/account"
                className="block py-2 text-sm font-medium text-[#475569] hover:text-[#2B7BD4]"
                onClick={() => setMobileMenuOpen(false)}
              >
                مرحباً، {user.full_name}
              </Link>
              <button
                type="button"
                className="block py-2 text-sm font-medium text-[#EF4444]"
                onClick={handleLogout}
              >
                تسجيل الخروج
              </button>
            </>
          ) : (
            <Link
              href="/login"
              className="block py-2 text-sm font-medium text-[#2B7BD4]"
              onClick={() => setMobileMenuOpen(false)}
            >
              تسجيل الدخول
            </Link>
          )}
        </div>
      )}
    </header>
  );
}
