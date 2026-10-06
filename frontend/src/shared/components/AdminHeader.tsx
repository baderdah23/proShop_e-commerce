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
    <header className="h-20 bg-white/80 backdrop-blur-md border-b border-black/8 px-8 flex items-center justify-between sticky top-0 z-20">
      {/* Quick Search */}
      <div className="relative w-80">
        <Search01Icon
          size={18}
          color="#94A3B8"
          className="absolute start-3.5 top-1/2 -translate-y-1/2 pointer-events-none"
        />
        <input
          type="text"
          placeholder="ابحث عن منتج، طلب، عميل..."
          className="w-full ps-10 pe-4 py-2 bg-[#F8FAFC] border border-black/8 rounded-xl text-xs focus:outline-none focus:border-[#6AABF0] focus:ring-2 focus:ring-[#6AABF0]/15 transition-all"
        />
      </div>

      {/* Admin Controls */}
      <div className="flex items-center gap-4">
        {/* Status Indicator */}
        <div className="flex items-center gap-2 px-3 py-1.5 rounded-full bg-[#22C55E]/10 border border-[#22C55E]/20 text-xs font-medium text-[#16A34A]">
          <span className="w-2 h-2 rounded-full bg-[#22C55E] animate-pulse" />
          <span>النظام متصل وجاهز</span>
        </div>

        {/* Notifications */}
        <button
          type="button"
          aria-label="التنبيهات"
          className="w-10 h-10 rounded-xl border border-black/8 flex items-center justify-center text-[#64748B] hover:bg-[#F1F5F9] relative transition-colors"
        >
          <Notification01Icon size={20} color="#475569" />
          <span className="absolute top-2.5 end-2.5 w-2 h-2 rounded-full bg-[#EF4444]" />
        </button>

        {/* Admin Profile */}
        <div className="flex items-center gap-3 ps-3 border-s border-black/8">
          <div className="w-10 h-10 rounded-xl bg-[#EEF5FC] border border-[#AACFF0]/60 flex items-center justify-center text-[#2B7BD4] font-bold">
            <User02Icon size={20} color="#2B7BD4" />
          </div>
          <div className="text-start">
            <p className="text-xs font-bold text-[#1A1D2A] flex items-center gap-1.5">
              <span>مدير المتجر</span>
              <Shield01Icon size={14} color="#6AABF0" />
            </p>
            <p className="text-[11px] text-[#64748B]">admin@pro-ecommerce.com</p>
          </div>
        </div>
      </div>
    </header>
  );
}
