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
    ref
  ) => {
    const sizeClasses = {
      xs: "px-3 py-1.5 text-xs rounded-lg gap-1.5",
      sm: "px-3.5 py-2 text-sm rounded-xl gap-2",
      md: "px-5 py-2.5 text-sm rounded-xl gap-2.5",
      lg: "px-6 py-3 text-base rounded-xl gap-3",
      xl: "px-8 py-4 text-base font-semibold rounded-2xl gap-3.5",
    };

    const variantClasses = {
      primary: "bg-[#2B70BA] text-white hover:bg-[#205B9B] font-semibold shadow-[0_8px_20px_rgba(43,112,186,0.22)] transition-colors",
      secondary: "bg-[#EAF3FC] text-[#245F9E] hover:bg-[#D7E9FA] font-medium border border-[#BBD9F6] transition-colors",
      outline: "border-[1.5px] border-[#4F8FD8] text-[#245F9E] bg-transparent hover:bg-[#EAF3FC] font-medium transition-colors",
      ghost: "text-[#64748B] hover:text-[#142033] hover:bg-[#EAF1F8] font-medium transition-colors",
      danger: "bg-[#EF4444] text-white hover:bg-[#DC2626] font-medium shadow-sm transition-colors",
      success: "bg-[#22C55E] text-white hover:bg-[#16A34A] font-medium shadow-sm transition-colors",
    };

    return (
      <button
        ref={ref}
        disabled={disabled || isLoading}
        className={cn(
          "inline-flex items-center justify-center select-none active:scale-[0.98] transition-all cursor-pointer disabled:opacity-50 disabled:pointer-events-none disabled:cursor-not-allowed",
          sizeClasses[size],
          variantClasses[variant],
          className
        )}
        {...props}
      >
        {isLoading && (
          <span className="w-4 h-4 border-2 border-current border-t-transparent rounded-full animate-spin" />
        )}
        {children}
      </button>
    );
  }
);

Button.displayName = "Button";
