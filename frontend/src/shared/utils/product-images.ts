import type { Category, Product } from "@/shared/types";

const categoryImageFallbacks: Record<string, string> = {
  "phones-tablets":
    "https://images.unsplash.com/photo-1511707171634-5f897ff02aa9?auto=format&fit=crop&w=1000&q=85",
  monitors:
    "https://images.unsplash.com/photo-1527443224154-c4a3942d3acf?auto=format&fit=crop&w=1000&q=85",
  accessories:
    "https://images.unsplash.com/photo-1587829741301-dc798b83add3?auto=format&fit=crop&w=1000&q=85",
  "graphics-cards":
    "https://images.unsplash.com/photo-1591488320449-011701bb6704?auto=format&fit=crop&w=1000&q=85",
};

export function getCategoryFallbackImage(category: Category): string {
  return (
    categoryImageFallbacks[category.slug || category.category_slug || ""] ||
    category.image_url ||
    categoryImageFallbacks.accessories
  );
}

export function getCategoryImage(category: Category): string {
  const categoryKey = category.slug || category.category_slug || "";
  return (
    categoryImageFallbacks[categoryKey] ||
    category.image_url ||
    "/file.svg"
  );
}

export function getProductImageSources(product: Product): string[] {
  return [
    product.image_url,
    ...(product.images || [])
      .slice()
      .sort((first, second) => {
        if (first.is_primary !== second.is_primary) {
          return Number(second.is_primary) - Number(first.is_primary);
        }
        return first.sort_order - second.sort_order;
      })
      .map((image) => image.image_url),
  ].filter((image, index, images): image is string =>
    Boolean(image) && images.indexOf(image) === index,
  );
}

export function isExcludedProduct(product: Pick<Product, "name" | "slug">): boolean {
  return (
    product.slug === "samsung-smart-monitor-m8-32" ||
    product.name.trim().toLowerCase() === 'samsung smart monitor m8 32"'
  );
}
