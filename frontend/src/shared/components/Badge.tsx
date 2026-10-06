import React from "react";
import { cn } from "@/shared/utils";

type BadgeVariant = "active" | "pending" | "cancelled" | "completed" | "draft";

interface BadgeProps extends React.HTMLAttributes<HTMLSpanElement> {
  variant?: BadgeVariant;
  children: React.ReactNode;
}

export function Badge({ variant = "active", children, className, ...props }: BadgeProps) {
  const variantStyles: Record<BadgeVariant, { bg: string; text: string; dot: string }> = {
    active: {
      bg: "bg-[#22C55E]/10",
      text: "text-[#16A34A]",
      dot: "bg-[#22C55E]",
    },
    pending: {
      bg: "bg-[#F59E0B]/10",
      text: "text-[#D97706]",
      dot: "bg-[#F59E0B]",
    },
    cancelled: {
      bg: "bg-[#EF4444]/10",
      text: "text-[#DC2626]",
      dot: "bg-[#EF4444]",
    },
    completed: {
      bg: "bg-[#6AABF0]/10",
      text: "text-[#2B7BD4]",
      dot: "bg-[#6AABF0]",
    },
    draft: {
      bg: "bg-[#94A3B8]/10",
      text: "text-[#64748B]",
      dot: "bg-[#94A3B8]",
    },
  };

  const current = variantStyles[variant];

  return (
    <span
      className={cn(
        "inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-semibold select-none",
        current.bg,
        current.text,
        className
      )}
      {...props}
    >
      <span className={cn("w-1.5 h-1.5 rounded-full shrink-0", current.dot)} />
      {children}
    </span>
  );
}
