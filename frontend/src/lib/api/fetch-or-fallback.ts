import { serverFetch } from "./server";

/**
 * Fetches JSON from the backend and returns a fallback value on failure.
 *
 * Exists because the factory handlers on the backend return 404 for empty
 * results (not just missing routes), and the backend may be down entirely —
 * without this, any failed fetch would crash the whole page instead of
 * rendering its empty state.
 *
 * Server-only: `serverFetch` uses `import "server-only"`, so importing this
 * from a client component breaks the build. Call it from server components
 * or server actions only.
 *
 * @param path - Path appended to `BACKEND_URL` (e.g. `/products?limit=4`).
 * @param fallback - Value returned when the request fails.
 * @returns The parsed response, or `fallback` on any error.
 *
 * @example
 * const res = await fetchOrFallback<ProductsResponse | null>(
 *   "products?limit=4",
 *   null,
 * );
 * const products = res?.products ?? [];
 */
export async function fetchOrFallback<T>(
  path: string,
  fallback: T,
): Promise<T> {
  try {
    return await serverFetch<T>(path);
  } catch (error) {
    // Next.js throws this digest when a no-store fetch blocks static
    // prerendering — rethrow so the route is marked dynamic (ƒ) instead of
    // being swallowed and logged as a real failure during the build.
    if (
      error instanceof Error &&
      "digest" in error &&
      error.digest === "DYNAMIC_SERVER_USAGE"
    ) {
      throw error;
    }
    console.error(`Failed to fetch ${path}:`, error);
    return fallback;
  }
}
