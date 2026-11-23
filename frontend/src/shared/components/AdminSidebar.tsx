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
    <aside className="w-64 min-h-screen bg-surface border-e border-line flex flex-col justify-between shrink-0 select-none z-30">
      <div>
        {/* Brand / Logo */}
        <div className="p-6 flex items-center gap-3 border-b border-line">
          <div className="grid size-10 shrink-0 place-items-center rounded-xl bg-brand text-white">
            <Store01Icon size={22} className="text-white" />
          </div>
          <div>
            <h1 className="text-ink font-bold text-base tracking-tight">
              برو ستور
            </h1>
            <span className="text-[11px] font-semibold text-muted bg-brand-soft px-2.5 py-0.5 rounded-full inline-block mt-0.5 border border-line">
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
                  "relative flex items-center gap-3.5 px-4 py-3 rounded-xl text-sm transition-all duration-200",
                  "before:absolute before:inset-y-2 before:start-0 before:w-[3px] before:rounded-full before:content-['']",
                  isActive
                    ? "bg-brand-soft text-ink font-bold before:bg-brand"
                    : "text-muted hover:bg-paper hover:text-ink font-medium before:bg-transparent",
                )}
              >
                <Icon size={20} className={isActive ? "text-brand" : "text-muted"} />
                <span>{item.name}</span>
              </Link>
            );
          })}
        </nav>
      </div>

      {/* Bottom Actions */}
      <div className="p-4 border-t border-line space-y-1">
        <Link
          href="/"
          className="flex items-center gap-3 px-4 py-2.5 rounded-xl text-xs text-muted hover:bg-paper hover:text-ink transition-colors"
        >
          <Store01Icon size={18} className="text-muted" />
          <span>العودة إلى المتجر الرئيسي</span>
        </Link>
        <button
          type="button"
          className="w-full flex items-center gap-3 px-4 py-2.5 rounded-xl text-xs text-sale hover:bg-sale/10 hover:text-sale transition-colors cursor-pointer"
        >
          <Logout01Icon size={18} className="text-sale" />
          <span>تسجيل خروج الأدمن</span>
        </button>
      </div>
    </aside>
  );
}
