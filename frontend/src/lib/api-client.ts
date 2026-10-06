import type {
  Address,
  AppliedCoupon,
  Brand,
  CartItem,
  Category,
  Coupon,
  Order,
  Product,
  Review,
  WishlistItem,
} from "@/shared/types";

const BACKEND_BASE_URL =
  process.env.NEXT_PUBLIC_API_URL || "http://localhost:8000";

function notifyDataChanged(resource: "cart" | "wishlist") {
  if (typeof window !== "undefined") {
    window.dispatchEvent(new CustomEvent(`prostore:${resource}-updated`));
  }
}

interface ApiEnvelope<T> {
  success: boolean;
  message?: string;
  data?: T;
  products?: Product[];
  categories?: Category[];
  brands?: Brand[];
  product?: Product;
  users?: unknown[];
  reviews?: Review[];
  total?: number;
}

async function request<T>(endpoint: string, options?: RequestInit): Promise<T> {
  const response = await fetch(`${BACKEND_BASE_URL}${endpoint}`, {
    credentials: "include",
    headers: {
      "Content-Type": "application/json",
      ...(options?.headers || {}),
    },
    ...options,
  });

  const payload = (await response.json()) as ApiEnvelope<T> & {
    error?: string | { message?: string };
  };
  if (!response.ok || !payload.success) {
    const nested = typeof payload.error === "object" ? payload.error.message : undefined;
    throw new Error(
      payload.message ||
        nested ||
        (typeof payload.error === "string" ? payload.error : undefined) ||
        `تعذر تنفيذ الطلب (${response.status}).`,
    );
  }

  return (payload.data !== undefined ? payload.data : payload) as T;
}

function buildQuery(params: Record<string, string | number | undefined>) {
  const searchParams = new URLSearchParams();
  Object.entries(params).forEach(([key, value]) => {
    if (value !== undefined && value !== "") {
      searchParams.set(key, String(value));
    }
  });
  const query = searchParams.toString();
  return query ? `?${query}` : "";
}

export interface ProductListResult {
  products: Product[];
  total: number;
  page: number;
  limit: number;
}

export const ProductsApi = {
  async getAll(filters?: {
    categoryId?: number;
    brandId?: number;
    search?: string;
    page?: number;
    limit?: number;
    sort?: string;
  }): Promise<ProductListResult> {
    const page = filters?.page || 1;
    const limit = filters?.limit || 12;
    const payload = await request<ApiEnvelope<Product[]>>(
      `/products${buildQuery({
        category: filters?.categoryId,
        brand: filters?.brandId,
        search: filters?.search,
        page,
        limit,
        sort: filters?.sort,
      })}`,
    );

    return {
      products: payload.products || [],
      total: payload.total || 0,
      page,
      limit,
    };
  },

  async getById(productId: string): Promise<Product | null> {
    const payload = await request<Product | ApiEnvelope<Product>>(
      `/products/${encodeURIComponent(productId)}`,
    );
    if ("product" in payload) {
      return payload.product || null;
    }
    return "product_id" in payload ? payload : null;
  },

  async create(data: Partial<Product>): Promise<Product> {
    return request<Product>("/products", {
      method: "POST",
      body: JSON.stringify(data),
    });
  },

  async remove(productId: string): Promise<void> {
    await request(`/products/${productId}`, { method: "DELETE" });
  },

  async update(productId: string, data: Partial<Product>): Promise<Product> {
    return request(`/products/${productId}`, {
      method: "PATCH",
      body: JSON.stringify(data),
    });
  },
};

export const UsersApi = {
  async getAll(page = 1, limit = 20) {
    const payload = await request<ApiEnvelope<unknown[]>>(
      `/users?page=${page}&limit=${limit}`,
    );
    return (Array.isArray(payload) ? payload : payload.users || []) as Array<{
      user_id: string;
      full_name: string;
      email: string;
      phone: string;
      role: "admin" | "customer";
      is_active: boolean;
      created_at: string;
    }>;
  },
};

export const CategoriesApi = {
  async getAll(page = 1, limit = 100): Promise<Category[]> {
    const payload = await request<ApiEnvelope<Category[]>>(
      `/categories?page=${page}&limit=${limit}`,
    );
    return payload.categories || (Array.isArray(payload) ? payload : []);
  },

  async create(data: Pick<Category, "name_ar" | "name_en" | "image_url">) {
    return request<Category>("/categories", {
      method: "POST",
      body: JSON.stringify(data),
    });
  },

  async remove(categoryId: number) {
    await request(`/categories/${categoryId}`, { method: "DELETE" });
  },
};

export const BrandsApi = {
  async getAll(): Promise<Brand[]> {
    const payload = await request<ApiEnvelope<Brand[]>>("/brands");
    return payload.brands || (Array.isArray(payload) ? payload : []);
  },

  async create(data: Pick<Brand, "name" | "logo_url">) {
    return request<Brand>("/brands", {
      method: "POST",
      body: JSON.stringify(data),
    });
  },

  async remove(brandId: number) {
    await request(`/brands/${brandId}`, { method: "DELETE" });
  },
};

export const CartApi = {
  async get(): Promise<{
    cart_id: string;
    items: CartItem[];
    total_items: number;
    subtotal: number;
    applied_coupon: AppliedCoupon | null;
  }> {
    return request("/cart");
  },

  async addItem(productId: string, quantity: number): Promise<CartItem> {
    const item = await request<CartItem>("/cart/items", {
      method: "POST",
      body: JSON.stringify({ productId, quantity }),
    });
    notifyDataChanged("cart");
    return item;
  },

  async updateItem(cartItemId: string, quantity: number): Promise<CartItem> {
    const item = await request<CartItem>(`/cart/items/${cartItemId}`, {
      method: "PUT",
      body: JSON.stringify({ quantity }),
    });
    notifyDataChanged("cart");
    return item;
  },

  async removeItem(cartItemId: string): Promise<CartItem> {
    const item = await request<CartItem>(`/cart/items/${cartItemId}`, { method: "DELETE" });
    notifyDataChanged("cart");
    return item;
  },

  async clear(): Promise<CartItem[]> {
    const items = await request<CartItem[]>("/cart/clear", { method: "DELETE" });
    notifyDataChanged("cart");
    return items;
  },

  async applyCoupon(code: string): Promise<AppliedCoupon> {
    return request<AppliedCoupon>("/cart/coupon", {
      method: "POST",
      body: JSON.stringify({ code }),
    });
  },

  async removeCoupon(): Promise<void> {
    await request("/cart/coupon", { method: "DELETE" });
  },
};

export const OrdersApi = {
  async getAll(): Promise<Order[]> {
    return request("/orders");
  },

  async getMyOrders(): Promise<Order[]> {
    return request("/orders/my-orders");
  },

  async updateStatus(orderId: string, status: string): Promise<Order> {
    return request(`/orders/${orderId}/status`, {
      method: "PATCH",
      body: JSON.stringify({ status }),
    });
  },

  async create(data: {
    addressId: string;
    couponCode?: string;
    shippingFee: number;
  }): Promise<Order> {
    return request("/orders", {
      method: "POST",
      body: JSON.stringify(data),
    });
  },

  async getInvoice(orderId: string): Promise<{
    invoiceNumber: string;
    createdAt: string;
    order: Order;
    payment: { method: string; status: string } | null;
  }> {
    return request(`/orders/${orderId}/invoice`);
  },
};

export const CouponsApi = {
  async getAll(): Promise<Coupon[]> {
    return request("/coupons");
  },

  async create(data: {
    code: string;
    discount_type: "percentage" | "fixed";
    discount_value: number;
    max_uses: number;
    valid_from: string;
    valid_until: string;
  }): Promise<Coupon> {
    return request("/coupons", {
      method: "POST",
      body: JSON.stringify(data),
    });
  },

  async remove(couponId: string) {
    await request(`/coupons/${couponId}`, { method: "DELETE" });
  },

  async validate(code: string): Promise<Coupon | null> {
    try {
      return await request("/coupons/validate", {
        method: "POST",
        body: JSON.stringify({ code }),
      });
    } catch {
      return null;
    }
  },
};

export const ReviewsApi = {
  async getAll(): Promise<Review[]> {
    return request("/reviews");
  },

  async getByProduct(productId: string): Promise<Review[]> {
    const payload = await request<Review[] | ApiEnvelope<Review[]>>(
      `/reviews/product/${productId}`,
    );
    if (Array.isArray(payload)) return payload;
    return payload.reviews || (Array.isArray(payload.data) ? payload.data : []);
  },

  async getByProductId(productId: string): Promise<Review[]> {
    return this.getByProduct(productId);
  },

  async create(data: {
    product_id: string;
    customerName: string;
    rating: number;
    comment: string;
  }): Promise<Review> {
    return request("/reviews", {
      method: "POST",
      body: JSON.stringify(data),
    });
  },

  async remove(reviewId: string) {
    await request(`/reviews/${reviewId}`, { method: "DELETE" });
  },
};

export const AddressesApi = {
  async getAll(): Promise<Address[]> {
    return request<Address[]>("/addresses");
  },

  async create(data: Omit<Address, "address_id" | "user_id" | "created_at">) {
    return request<Address>("/addresses", {
      method: "POST",
      body: JSON.stringify({
        label: data.label || "المنزل",
        fullName: data.full_name,
        phone: data.phone,
        country: data.country,
        city: data.city,
        street: data.street,
        building: data.building,
        isDefault: data.is_default,
      }),
    });
  },

  async update(
    addressId: string,
    data: Partial<Omit<Address, "address_id" | "user_id" | "created_at">>,
  ) {
    return request<Address>(`/addresses/${addressId}`, {
      method: "PATCH",
      body: JSON.stringify({
        ...(data.label !== undefined ? { label: data.label } : {}),
        ...(data.full_name !== undefined ? { fullName: data.full_name } : {}),
        ...(data.phone !== undefined ? { phone: data.phone } : {}),
        ...(data.country !== undefined ? { country: data.country } : {}),
        ...(data.city !== undefined ? { city: data.city } : {}),
        ...(data.street !== undefined ? { street: data.street } : {}),
        ...(data.building !== undefined ? { building: data.building } : {}),
        ...(data.is_default !== undefined ? { isDefault: data.is_default } : {}),
      }),
    });
  },

  async remove(addressId: string) {
    await request(`/addresses/${addressId}`, { method: "DELETE" });
  },
};


export const WishlistApi = {
  async getAll(): Promise<WishlistItem[]> {
    return request("/wishlists");
  },

  async add(productId: string): Promise<WishlistItem> {
    const item = await request<WishlistItem>("/wishlists", {
      method: "POST",
      body: JSON.stringify({ productId }),
    });
    notifyDataChanged("wishlist");
    return item;
  },

  async remove(productId: string): Promise<WishlistItem> {
    const item = await request<WishlistItem>(`/wishlists/${productId}`, { method: "DELETE" });
    notifyDataChanged("wishlist");
    return item;
  },
};

export const PaymentsApi = {
  async process(
    orderId: string,
    method: "cash_on_delivery" | "credit_card",
  ): Promise<{ clientSecret?: string; payment?: unknown }> {
    return request("/payments/process", {
      method: "POST",
      body: JSON.stringify({ orderId, method }),
    });
  },

  async cancel(orderId: string) {
    await request(`/payments/${orderId}/cancel`, { method: "POST" });
  },
};
