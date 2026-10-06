import React from "react";
import { cn } from "@/shared/utils";

interface InputProps extends React.InputHTMLAttributes<HTMLInputElement> {
  label?: string;
  error?: string;
  icon?: React.ReactNode;
}

export const Input = React.forwardRef<HTMLInputElement, InputProps>(
  ({ label, error, icon, className, id, ...props }, ref) => {
    const inputId = id || (label ? label.replace(/\s+/g, "-").toLowerCase() : undefined);

    return (
      <div className="w-full flex flex-col gap-1.5 text-start">
        {label && (
          <label htmlFor={inputId} className="text-xs font-semibold text-[#475569]">
            {label}
          </label>
        )}
        <div className="relative flex items-center">
          {icon && (
            <div className="absolute start-3.5 text-[#94A3B8] pointer-events-none flex items-center justify-center">
              {icon}
            </div>
          )}
          <input
            id={inputId}
            ref={ref}
            className={cn(
              "w-full px-4 py-2.5 rounded-xl text-sm bg-white border transition-all duration-200 placeholder:text-[#94A3B8]",
              "border-black/10 focus:border-[#6AABF0] focus:ring-2 focus:ring-[#6AABF0]/20 focus:outline-none",
              icon ? "ps-10" : "",
              error && "border-[#EF4444] bg-[#FEF2F2] focus:border-[#EF4444] focus:ring-[#EF4444]/20",
              className
            )}
            {...props}
          />
        </div>
        {error && <p className="text-xs text-[#EF4444] font-medium">{error}</p>}
      </div>
    );
  }
);

Input.displayName = "Input";
