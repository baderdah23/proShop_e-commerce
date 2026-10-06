import { clsx, type ClassValue } from "clsx";
import { twMerge } from "tailwind-merge";

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs));
}

export function formatPrice(price: number | string, currency = "$"): string {
  const num = typeof price === "string" ? parseFloat(price) : price;
  if (isNaN(num)) return `0.00 ${currency}`;
  return `${num.toLocaleString("en-US", { minimumFractionDigits: 2, maximumFractionDigits: 2 })} ${currency}`;
}

export function formatDate(dateString: string | Date): string {
  if (!dateString) return "";
  const d = new Date(dateString);
  return d.toLocaleDateString("ar-EG", {
    year: "numeric",
    month: "short",
    day: "numeric",
  });
}
