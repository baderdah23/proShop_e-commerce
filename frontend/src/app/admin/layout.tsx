"use client";

import React from "react";
import { useEffect } from "react";
import { useRouter } from "next/navigation";
import { AdminSidebar } from "@/shared/components/AdminSidebar";
import { AdminHeader } from "@/shared/components/AdminHeader";
import { useAuth } from "@/features/auth";

export default function AdminLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const router = useRouter();
  const { user, isLoading } = useAuth();

  useEffect(() => {
    if (isLoading) {
      return;
    }

    if (!user) {
      router.replace("/login");
      return;
    }

    if (user.role !== "admin") {
      router.replace("/");
    }
  }, [isLoading, router, user]);

  if (isLoading || !user || user.role !== "admin") {
    return (
      <div className="min-h-screen flex items-center justify-center bg-[#F8FAFC]">
        <div className="w-8 h-8 border-2 border-[#6AABF0] border-t-transparent rounded-full animate-spin" />
      </div>
    );
  }

  return (
    <div className="min-h-screen flex bg-[#F8FAFC] text-[#1A1D2A]" dir="rtl">
      {/* Dark Modern Sidebar */}
      <AdminSidebar />

      {/* Main Admin Area */}
      <div className="flex-1 flex flex-col min-w-0">
        <AdminHeader />
        <main className="flex-1 p-8 overflow-y-auto">
          <div className="max-w-7xl mx-auto">
            {children}
          </div>
        </main>
      </div>
    </div>
  );
}
