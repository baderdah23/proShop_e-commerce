import React from "react";
import { AdminSidebar } from "@/shared/components/AdminSidebar";
import { AdminHeader } from "@/shared/components/AdminHeader";

export default function AdminLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <div className="min-h-screen flex bg-paper text-ink" dir="rtl">
      <AdminSidebar />

      {/* Main Admin Area */}
      <div className="flex-1 flex flex-col min-w-0">
        <AdminHeader />
        <main className="flex-1 p-6 sm:p-8 lg:p-10 overflow-y-auto">
          <div className="max-w-7xl mx-auto">
            {children}
          </div>
        </main>
      </div>
    </div>
  );
}
