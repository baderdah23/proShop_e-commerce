"use client";

import React from "react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import {
  DashboardCircleIcon,
  ShoppingBag01Icon,
  Folder01Icon,
  Invoice01Icon,
  Ticket01Icon,
  StarIcon,
  UserGroupIcon,
  Logout01Icon,
  Store01Icon,
} from "hugeicons-react";
import { cn } from "@/shared/utils";

const navigationItems = [
  { name: "نظرة عامة", href: "/admin", icon: DashboardCircleIcon },
  { name: "المنتجات", href: "/admin/products", icon: ShoppingBag01Icon },
  { name: "الفئات والماركات", href: "/admin/categories", icon: Folder01Icon },
  { name: "الطلبات والمبيعات", href: "/admin/orders", icon: Invoice01Icon },
  { name: "كوبونات الخصم", href: "/admin/coupons", icon: Ticket01Icon },
  { name: "التقييمات", href: "/admin/reviews", icon: StarIcon },
  { name: "العملاء", href: "/admin/customers", icon: UserGroupIcon },
];

export function AdminSidebar() {
  const pathname = usePathname();

  return (
    <aside className="w-64 min-h-screen bg-[#eee] border-e border-[#d0d0d0] flex flex-col justify-between shrink-0 select-none z-30">
      <div>
        {/* Brand / Logo */}
        <div className="p-6 flex items-center gap-3 border-b border-slate-800/80">
          <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-blue-600 to-indigo-600 flex items-center justify-center text-white shadow-md shadow-blue-500/20">
            <Store01Icon size={22} color="white" />
          </div>
          <div>
            <h1 className="text-black font-bold text-base tracking-wide">
              برو ستور
            </h1>
            <span className="text-[11px] font-semibold text-blue-400 bg-blue-500/10 px-2.5 py-0.5 rounded-full inline-block mt-0.5 border border-blue-500/20">
              لوحة الإدارة
            </span>
          </div>
        </div>

        {/* Navigation Links */}
        <nav className="p-4 space-y-1.5">
          {navigationItems.map((item) => {
            const isActive =
              pathname === item.href ||
              (item.href !== "/admin" && pathname.startsWith(item.href));
            const Icon = item.icon;

            return (
              <Link
                key={item.href}
                href={item.href}
                className={cn(
                  "relative flex items-center gap-3.5 px-4 py-3 rounded-xl text-sm font-medium transition-all duration-200",
                  isActive
                    ? "bg-blue-600 text-white font-bold shadow-md shadow-blue-600/30"
                    : "text-black  hover:bg-blue-600/20",
                )}
              >
                <Icon size={20} color={isActive ? "white" : "black"} />
                <span>{item.name}</span>
              </Link>
            );
          })}
        </nav>
      </div>

      {/* Bottom Actions */}
      <div className="p-4 border-t border-slate-800/80 space-y-1">
        <Link
          href="/"
          className="flex items-center gap-3 px-4 py-2.5 rounded-xl text-xs text-black hover:text-white hover:bg-blue-600 transition-colors"
        >
          <Store01Icon size={18} color="black" />
          <span>العودة إلى المتجر الرئيسي</span>
        </Link>
        <button
          onClick={() => {
            alert("تم تسجيل الخروج بنجاح.");
          }}
          className="w-full flex items-center gap-3 px-4 py-2.5 rounded-xl text-xs text-rose-400 hover:bg-rose-500/10 transition-colors cursor-pointer"
        >
          <Logout01Icon size={18} color="#FB7185" />
          <span>تسجيل خروج الأدمن</span>
        </button>
      </div>
    </aside>
  );
}
