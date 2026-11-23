import Link from "next/link";
import type { ReactNode } from "react";
import { ArrowRight01Icon } from "hugeicons-react";
import { cn } from "@/shared/utils";

interface SectionHeadingProps {
  index?: string;
  eyebrow?: string;
  title: string;
  description?: string;
  action?: { label: string; href: string };
  icon?: ReactNode;
  tone?: "light" | "dark";
  className?: string;
}

export function SectionHeading({
  index,
  eyebrow,
  title,
  description,
  action,
  icon,
  tone = "light",
  className,
}: SectionHeadingProps) {
  return (
    <div className={cn("flex flex-wrap items-end justify-between gap-6", className)}>
      <div className="flex items-start gap-4 sm:gap-5">
        {index && (
          <span
            className={cn(
              "font-latin pt-1 text-[11px] font-bold tracking-[0.16em]",
              tone === "dark" ? "text-ink" : "text-muted",
            )}
          >
            {index}
          </span>
        )}
        <div>
          <div className="mb-2.5 flex items-center gap-2.5">
            {icon}
            {eyebrow && <span className="eyebrow text-ink">{eyebrow}</span>}
          </div>
          <h2 className="text-[26px] font-black leading-[1.25] tracking-[-0.03em] text-ink sm:text-[34px]">
            {title}
          </h2>
          {description && (
            <p className="mt-2 text-[13px] leading-relaxed text-muted">{description}</p>
          )}
        </div>
      </div>

      {action && (
        <Link
          href={action.href}
          className="group inline-flex items-center gap-2 border-b border-line pb-1 text-[13px] font-bold text-ink transition-colors hover:border-ink"
        >
          {action.label}
          <ArrowRight01Icon size={15} className="rotate-180 transition-transform duration-300 group-hover:-translate-x-1" />
        </Link>
      )}
    </div>
  );
}
