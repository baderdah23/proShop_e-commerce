"use client";

import React, { useSyncExternalStore } from "react";

export type ToastType = "success" | "error" | "info";

export interface ToastOptions {
  duration?: number;
}

interface ToastItem {
  id: number;
  type: ToastType;
  message: string;
}

const MAX_TOASTS = 4;
const DEFAULT_DURATION = 4000;

const EMPTY: ToastItem[] = [];
let snapshot: ToastItem[] = EMPTY;
let nextId = 1;
const listeners = new Set<() => void>();
const timers = new Map<number, ReturnType<typeof setTimeout>>();

function emit() {
  listeners.forEach((listener) => listener());
}

function dismiss(id?: number) {
  const ids = id === undefined ? [...snapshot.map((item) => item.id)] : [id];
  let changed = false;

  ids.forEach((toastId) => {
    const timer = timers.get(toastId);
    if (timer !== undefined) {
      clearTimeout(timer);
      timers.delete(toastId);
      changed = true;
    } else if (snapshot.some((item) => item.id === toastId)) {
      changed = true;
    }
  });

  if (!changed) return;
  snapshot = snapshot.filter((item) => !ids.includes(item.id));
  emit();
}

function push(
  type: ToastType,
  message: string,
  options?: ToastOptions,
): number {
  const id = nextId++;
  snapshot = [...snapshot, { id, type, message }];

  while (snapshot.length > MAX_TOASTS) {
    const oldest = snapshot[0];
    snapshot = snapshot.slice(1);
    const oldestTimer = timers.get(oldest.id);
    if (oldestTimer !== undefined) {
      clearTimeout(oldestTimer);
      timers.delete(oldest.id);
    }
  }

  const duration = options?.duration ?? DEFAULT_DURATION;
  if (duration > 0) {
    timers.set(
      id,
      setTimeout(() => dismiss(id), duration),
    );
  }

  emit();
  return id;
}

function subscribe(listener: () => void): () => void {
  listeners.add(listener);
  return () => listeners.delete(listener);
}

const getSnapshot = () => snapshot;
const getServerSnapshot = () => EMPTY;

/**
 * @example
 * toast.success("test");
 * toast.error("test");
 * toast.info("test");
 */
export const toast = {
  success: (message: string, options?: ToastOptions) =>
    push("success", message, options),
  error: (message: string, options?: ToastOptions) =>
    push("error", message, options),
  info: (message: string, options?: ToastOptions) =>
    push("info", message, options),
  dismiss,
};

const typeStyles: Record<ToastType, { chip: string; icon: React.ReactNode }> = {
  success: {
    chip: "text-[#16A34A] bg-[#DCFCE7]",
    icon: (
      <svg
        viewBox="0 0 20 20"
        fill="currentColor"
        aria-hidden="true"
        className="w-5 h-5"
      >
        <path
          fillRule="evenodd"
          d="M16.7 5.3a1 1 0 0 1 0 1.4l-7.5 7.5a1 1 0 0 1-1.4 0L3.3 9.7a1 1 0 1 1 1.4-1.4l3.8 3.8 6.8-6.8a1 1 0 0 1 1.4 0Z"
          clipRule="evenodd"
        />
      </svg>
    ),
  },
  error: {
    chip: "text-[#DC2626] bg-[#FEE2E2]",
    icon: (
      <svg
        viewBox="0 0 20 20"
        fill="currentColor"
        aria-hidden="true"
        className="w-5 h-5"
      >
        <path d="M5.3 5.3a1 1 0 0 1 1.4 0L10 8.6l3.3-3.3a1 1 0 1 1 1.4 1.4L11.4 10l3.3 3.3a1 1 0 0 1-1.4 1.4L10 11.4l-3.3 3.3a1 1 0 0 1-1.4-1.4L8.6 10 5.3 6.7a1 1 0 0 1 0-1.4Z" />
      </svg>
    ),
  },
  info: {
    chip: "text-[#2B7BD4] bg-[#EEF5FC]",
    icon: (
      <svg
        viewBox="0 0 20 20"
        fill="currentColor"
        aria-hidden="true"
        className="w-5 h-5"
      >
        <path
          fillRule="evenodd"
          d="M10 2.5a7.5 7.5 0 1 0 0 15 7.5 7.5 0 0 0 0-15Zm0 1.5a6 6 0 1 1 0 12 6 6 0 0 1 0-12Zm0 2.5a1 1 0 0 1 1 1v4a1 1 0 1 1-2 0V7.5a1 1 0 0 1 1-1Zm0 7a1 1 0 1 1 0 2 1 1 0 0 1 0-2Z"
          clipRule="evenodd"
        />
      </svg>
    ),
  },
};

function ToastCard({ item }: { item: ToastItem }) {
  const style = typeStyles[item.type];

  return (
    <div
      role="status"
      dir="rtl"
      className="toast-item pointer-events-auto flex items-start gap-3 w-full bg-white border border-black/10 rounded-2xl shadow-[0_10px_30px_rgba(20,32,51,0.15)] px-4 py-3"
    >
      <span
        className={`shrink-0 w-8 h-8 rounded-xl flex items-center justify-center ${style.chip}`}
      >
        {style.icon}
      </span>

      <p className="flex-1 text-sm font-semibold text-[#1A1D2A] leading-relaxed pt-1">
        {item.message}
      </p>

      <button
        type="button"
        onClick={() => toast.dismiss(item.id)}
        aria-label="إغلاق الرسالة"
        className="shrink-0 w-7 h-7 rounded-lg flex items-center justify-center text-[#94A3B8] hover:text-[#1A1D2A] hover:bg-[#F1F5F9] transition-colors"
      >
        <svg
          viewBox="0 0 20 20"
          fill="currentColor"
          aria-hidden="true"
          className="w-4 h-4"
        >
          <path d="M5.3 5.3a1 1 0 0 1 1.4 0L10 8.6l3.3-3.3a1 1 0 1 1 1.4 1.4L11.4 10l3.3 3.3a1 1 0 0 1-1.4 1.4L10 11.4l-3.3 3.3a1 1 0 0 1-1.4-1.4L8.6 10 5.3 6.7a1 1 0 0 1 0-1.4Z" />
        </svg>
      </button>
    </div>
  );
}

/**
 * حاوية الرسائل — ضعها مرة واحدة داخل layout.tsx.
 * تراقب المتجر الداخلي وتعرض الرسائل الجديدة تلقائياً أعلى الشاشة.
 */
export function Toaster() {
  const items = useSyncExternalStore(subscribe, getSnapshot, getServerSnapshot);

  return (
    <div
      aria-live="polite"
      aria-atomic="false"
      className="fixed top-4 left-1/2 -translate-x-1/2 z-[100] flex flex-col gap-2 w-[min(92vw,420px)] pointer-events-none"
    >
      {items.map((item) => (
        <ToastCard key={item.id} item={item} />
      ))}
    </div>
  );
}
