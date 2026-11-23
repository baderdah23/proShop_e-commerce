import Link from "next/link";
import { cn } from "@/shared/utils";

interface BrandMarkProps {
  tone?: "dark" | "light";
  showWordmark?: boolean;
  className?: string;
}

export function BrandMark({
  tone = "dark",
  showWordmark = true,
  className,
}: BrandMarkProps) {
  const isLight = tone === "light";

  return (
    <Link href="/" className={cn("group inline-flex items-center gap-3 select-none", className)} aria-label="برو ستور - الصفحة الرئيسية">
      <span
        className={cn(
          "grid size-11 shrink-0 place-items-center rounded-[14px] border transition-transform duration-300 group-hover:-rotate-3",
          isLight
            ? "border-line bg-surface"
            : "border-ink bg-ink shadow-[0_8px_18px_rgba(10,11,10,0.14)]",
        )}
      >
        <svg viewBox="0 0 40 40" className="size-7" aria-hidden="true" fill="none">
          <path
            d="M11 29V11h9.2a6.4 6.4 0 0 1 0 12.8H11"
            stroke={isLight ? "#0a0b0a" : "#ffffff"}
            strokeWidth="3.2"
            strokeLinecap="round"
            strokeLinejoin="round"
          />
          <circle cx="28.5" cy="28.5" r="3.3" fill="#d9f45c" />
        </svg>
      </span>

      {showWordmark && (
        <span className="flex flex-col leading-none">
          <span className="font-latin text-[19px] font-extrabold tracking-[-0.04em] text-ink">
            PRO<span className="text-muted">STORE</span>
          </span>
          <span className="mt-1.5 text-[10px] font-semibold tracking-[0.02em] text-muted">
            عتاد احترافي · اختيار دقيق
          </span>
        </span>
      )}
    </Link>
  );
}
