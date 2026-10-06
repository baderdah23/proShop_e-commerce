export interface ApiResponse<T> {
  success: boolean;
  message?: string;
  data: T;
}

export interface PaginatedResponse<T> {
  success: boolean;
  total: number;
  page: number;
  limit: number;
  data: T[];
}

export type UserRole = "admin" | "customer";

export interface User {
  user_id: string;
  full_name: string;
  email: string;
  phone: string;
  role: UserRole;
  is_active: boolean;
  created_at: string;
}

export interface Category {
  category_id: number;
  name_ar?: string;
  name_en?: string;
  slug?: string;
  category_name_ar?: string;
  category_name_en?: string;
  category_slug?: string;
  image_url: string;
  created_at?: string;
}

export interface SubCategory {
  sub_category_id: number;
  category_id: number;
  name_ar: string;
  name_en: string;
  slug: string;
  image_url: string;
  created_at?: string;
}

export interface Brand {
  brand_id: number;
  name: string;
  slug: string;
  logo_url: string;
  created_at?: string;
}

export interface ProductImage {
  image_id: string;
  product_id: string;
  image_url: string;
  is_primary: boolean;
  sort_order: number;
}

export interface Product {
  product_id: string;
  sku: string;
  slug: string;
  name: string;
  description_ar: string;
  description_en: string;
  specs_ar: string;
  specs_en: string;
  category_id: number;
  category_name?: string;
  category_image_url?: string;
  sub_category_id?: number | null;
  brand_id: number;
  brand_name?: string;
  price: number;
  discount_price: number;
  currency: string;
  rating_avg: number;
  rating_count: number;
  stock_quantity: number;
  warranty_months: number;
  is_featured: boolean;
  image_url?: string;
  images?: ProductImage[];
  created_at?: string;
}

export interface Review {
  review_id: string;
  product_id: string;
  user_id: string;
  customer_name: string;
  rating: number;
  comment: string;
  review_date: string;
}

export interface CartItem {
  cart_item_id: string;
  product_id: string;
  quantity: number;
  added_at: string;
  product_name: string;
  product_price: number;
  product_image: string;
  product_images?: ProductImage[];
  category_image_url?: string;
  total_item_price: number;
}

export interface WishlistItem {
  wishlist_id: string;
  user_id: string;
  product_id: string;
  added_at: string;
  product?: Product;
}

export interface Address {
  address_id: string;
  user_id: string;
  label: string;
  full_name: string;
  phone: string;
  country: string;
  city: string;
  street: string;
  building: string;
  is_default: boolean;
  created_at?: string;
}

export type DiscountType = "percentage" | "fixed";

export interface Coupon {
  coupon_id: string;
  code: string;
  discount_type: DiscountType;
  discount_value: number;
  max_uses: number;
  used_count: number;
  valid_from: string;
  valid_until: string;
  is_active: boolean;
}

/** The coupon currently applied to a cart, as returned by the cart API. */
export type AppliedCoupon = Pick<
  Coupon,
  "coupon_id" | "code" | "discount_type" | "discount_value"
>;

export type OrderStatus = "pending" | "processing" | "shipped" | "delivered" | "cancelled";

export interface OrderItem {
  order_item_id: string;
  order_id: string;
  product_id: string;
  product_name?: string;
  product_sku?: string;
  quantity: number;
  unit_price: number;
  subtotal: number;
}

export interface Order {
  order_id: string;
  order_number: string;
  user_id: string;
  customer_name?: string;
  customer_email?: string;
  address_id: string;
  coupon_id?: string | null;
  subtotal: number;
  discount_amount: number;
  shipping_fee: number;
  total_amount: number;
  status: OrderStatus;
  items?: OrderItem[];
  created_at: string;
  full_name?: string;
  phone?: string;
  country?: string;
  city?: string;
  street?: string;
  building?: string;
}
