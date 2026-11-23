import React from "react";
import { cn } from "@/shared/utils";

interface InputProps extends React.InputHTMLAttributes<HTMLInputElement> {
  label?: string;
  error?: string;
  icon?: React.ReactNode;
  inputId?: string;
}

export const Input = React.forwardRef<HTMLInputElement, InputProps>(
  ({ label, error, icon, inputId, className, ...props }, ref) => {
    return (
      <div className="flex w-full flex-col gap-2 text-start">
        {label && (
          <label
            htmlFor={inputId}
            className="text-[12px] font-bold text-ink/75"
          >
            {label}
          </label>
        )}
        <div className="relative flex items-center">
          {icon && (
            <div className="pointer-events-none absolute start-4 flex items-center justify-center text-muted">
              {icon}
            </div>
          )}
          <input
            id={inputId}
            ref={ref}
            className={cn(
              "h-12 w-full rounded-xl border border-line bg-surface px-4 text-[13px] text-ink outline-none transition-all placeholder:text-muted/70",
              "hover:border-ink/20 focus:border-brand focus:ring-4 focus:ring-brand/10",
              icon && "ps-11",
              error && "border-sale bg-[#fff5f5] focus:border-sale focus:ring-sale/10",
              className,
            )}
            {...props}
          />
        </div>
        {error && <p className="text-[11px] font-semibold text-sale">{error}</p>}
      </div>
    );
  },
);

Input.displayName = "Input";
