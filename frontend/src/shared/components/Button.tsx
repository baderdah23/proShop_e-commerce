"use client";

import React from "react";
import { cn } from "@/shared/utils";

interface ButtonProps extends React.ButtonHTMLAttributes<HTMLButtonElement> {
  variant?: "primary" | "secondary" | "outline" | "ghost" | "danger" | "success";
  size?: "xs" | "sm" | "md" | "lg" | "xl";
  isLoading?: boolean;
}

export const Button = React.forwardRef<HTMLButtonElement, ButtonProps>(
  (
    {
      children,
      className,
      variant = "primary",
      size = "md",
      isLoading = false,
      disabled,
      ...props
    },
    ref,
  ) => {
    const sizeClasses = {
      xs: "h-8 px-3 text-[11px] rounded-lg gap-1.5",
      sm: "h-10 px-4 text-xs rounded-xl gap-2",
      md: "h-11 px-5 text-[13px] rounded-xl gap-2",
      lg: "h-12 px-6 text-sm rounded-xl gap-2.5",
      xl: "h-14 px-8 text-sm rounded-2xl gap-3",
    };

    const variantClasses = {
      primary: "liquid-glass-btn font-bold",
      secondary: "bg-brand-soft text-brand-deep hover:bg-[#dfeafa] font-bold",
      outline: "border border-ink/15 bg-surface text-ink hover:border-brand hover:text-brand font-semibold",
      ghost: "text-muted hover:bg-ink/5 hover:text-ink font-semibold",
      danger: "bg-sale text-white hover:brightness-95 font-semibold shadow-[0_6px_18px_rgba(229,72,77,0.22)]",
      success: "bg-[#169f68] text-white hover:brightness-95 font-semibold",
    };

    return (
      <button
        ref={ref}
        disabled={disabled || isLoading}
        className={cn(
          "inline-flex shrink-0 items-center justify-center whitespace-nowrap select-none active:scale-[0.985] disabled:pointer-events-none disabled:opacity-50",
          sizeClasses[size],
          variantClasses[variant],
          className,
        )}
        {...props}
      >
        {isLoading && (
          <span className="size-4 animate-spin rounded-full border-2 border-current border-t-transparent" />
        )}
        {children}
      </button>
    );
  },
);

Button.displayName = "Button";
