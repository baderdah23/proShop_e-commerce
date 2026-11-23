"use client";

import React from "react";
import {
  Notification01Icon,
  Search01Icon,
  Shield01Icon,
  User02Icon,
} from "hugeicons-react";

export function AdminHeader() {
  return (
    <header className="h-20 bg-surface/90 backdrop-blur-xl border-b border-line px-6 sm:px-8 flex items-center justify-between gap-6 sticky top-0 z-20">
      {/* Quick Search */}
      <div className="relative w-full max-w-xs">
        <Search01Icon
          size={18}
          className="absolute start-3.5 top-1/2 -translate-y-1/2 pointer-events-none text-muted"
        />
        <input
          type="text"
          placeholder="ابحث عن منتج، طلب، عميل..."
          className="w-full ps-10 pe-4 py-2.5 bg-paper border border-line rounded-xl text-xs text-ink placeholder:text-muted/70 focus:outline-none focus:border-brand focus:ring-4 focus:ring-brand/10 transition-all"
        />
      </div>

      {/* Admin Controls */}
      <div className="flex items-center gap-3 sm:gap-4">
        {/* Status Indicator */}
        <div className="hidden sm:flex items-center gap-2 px-3 py-1.5 rounded-full bg-brand-soft border border-line text-xs font-semibold text-ink">
          <span className="size-2 rounded-full bg-signal" />
          <span>النظام متصل وجاهز</span>
        </div>

        {/* Notifications */}
        <button
          type="button"
          aria-label="التنبيهات"
          className="relative grid size-10 place-items-center rounded-xl border border-line text-muted hover:bg-paper hover:text-ink transition-colors"
        >
          <Notification01Icon size={20} className="text-muted" />
          <span className="absolute top-2.5 end-2.5 size-2 rounded-full bg-sale" />
        </button>

        {/* Admin Profile */}
        <div className="flex items-center gap-3 ps-3 border-s border-line">
          <div className="grid size-10 place-items-center rounded-xl bg-brand-soft border border-line text-brand">
            <User02Icon size={20} className="text-brand" />
          </div>
          <div className="text-start">
            <p className="text-xs font-bold text-ink flex items-center gap-1.5">
              <span>مدير المتجر</span>
              <Shield01Icon size={14} className="text-muted" />
            </p>
            <p className="font-latin text-[11px] text-muted">admin@pro-ecommerce.com</p>
          </div>
        </div>
      </div>
    </header>
  );
}
