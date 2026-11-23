import Link from "next/link";
import { StarIcon, ShoppingBag01Icon, FavouriteIcon } from "hugeicons-react";
import type { Product } from "@/shared/types";
import { formatPrice } from "@/shared/utils";

interface ProductCardProps {
  product: Product;
}

export function ProductCard({ product }: ProductCardProps) {
  const hasDiscount = product.discount_price < product.price;
  const discountPercent = hasDiscount
    ? Math.round(((product.price - product.discount_price) / product.price) * 100)
    : 0;

  return (
    <div className="group relative flex h-full flex-col overflow-hidden rounded-xl border border-line bg-surface p-3 transition-all duration-300 hover:-translate-y-1 hover:border-ink/25 hover:shadow-[0_18px_40px_rgba(10,11,10,0.08)]">
      <span
        aria-hidden="true"
        className="absolute inset-x-0 top-0 h-0.5 bg-signal opacity-0 transition-opacity duration-300 group-hover:opacity-100"
      />

      <div className="relative mb-4 aspect-[4/3] overflow-hidden rounded-lg bg-paper p-5">
        <img
          src={product.image_url}
          alt={product.name}
          loading="lazy"
          className="size-full object-contain object-center transition-transform duration-500 group-hover:scale-[1.06]"
        />

        {hasDiscount && (
          <span className="absolute top-3 start-3 rounded-md bg-sale px-2.5 py-1 font-latin text-[11px] font-bold text-white shadow-sm">
            -{discountPercent}%
          </span>
        )}

        <button
          type="button"
          aria-label="إضافة للمفضلة"
          className="absolute end-3 top-3 grid size-8 place-items-center rounded-lg border border-line bg-surface/90 text-muted backdrop-blur-sm transition-colors hover:border-brand hover:text-brand"
        >
          <FavouriteIcon size={16} />
        </button>
      </div>

      <div className="mb-2 flex items-center justify-between gap-2 px-1">
        <span className="flex min-w-0 items-center gap-1.5 text-[11px] font-semibold text-muted">
          <span
            aria-hidden="true"
            className="size-1.5 shrink-0 rounded-full bg-signal"
          />
          <span className="truncate">
            {product.category_name || "عتاد تقني"}
          </span>
        </span>
        <span className="font-latin shrink-0 text-[10px] font-bold uppercase tracking-[0.14em] text-brand">
          {product.brand_name}
        </span>
      </div>

      <Link
        href={`/products/${encodeURIComponent(product.slug)}?id=${encodeURIComponent(product.product_id)}`}
        className="px-1 transition-colors group-hover:text-brand"
      >
        <h3 className="line-clamp-2 text-[14px] font-bold leading-snug text-ink">
          {product.name}
        </h3>
      </Link>

      <div className="mt-2.5 flex items-center gap-1.5 px-1 text-[11px]">
        <StarIcon size={13} className="fill-brand text-brand" />
        <span className="font-latin font-bold text-ink">{product.rating_avg}</span>
        <span className="text-muted">({product.rating_count} تقييم)</span>
      </div>

      <div className="mt-auto flex items-end justify-between gap-2 border-t border-line px-1 pt-4">
        <div>
          <div className="font-latin text-[17px] font-extrabold tracking-tight text-ink">
            {formatPrice(product.discount_price || product.price)}
          </div>
          {hasDiscount && (
            <div className="font-latin mt-0.5 text-[11px] font-medium text-muted/70 line-through">
              {formatPrice(product.price)}
            </div>
          )}
        </div>

        <button
          type="button"
          className="inline-flex h-9 shrink-0 items-center gap-1.5 rounded-lg bg-brand px-3 text-[11px] font-bold text-white transition-colors hover:bg-ink"
        >
          <ShoppingBag01Icon size={14} />
          <span>إضافة</span>
        </button>
      </div>
    </div>
  );
}
