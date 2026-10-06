import { z } from "zod";

export const ProductSchema = z.object({
  sku: z.string().min(3, "sku must be at least 3 characters long").max(50),
  name: z.string().min(3, "name must be at least 3 characters long").max(255),
  description_ar: z
    .string()
    .min(3, "description_ar must be at least 3 characters long")
    .max(255),
  description_en: z
    .string()
    .min(3, "description_en must be at least 3 characters long")
    .max(255),
  specs_ar: z
    .string()
    .min(3, "specs_ar must be at least 3 characters long")
    .max(255),
  specs_en: z
    .string()
    .min(3, "specs_en must be at least 3 characters long")
    .max(255),
  category_id: z.coerce
    .number()
    .int()
    .positive()
    .min(1, "category_id must be a positive integer"),
  sub_category_id: z.coerce
    .number()
    .int()
    .positive()
    .min(1, "sub_category_id must be a positive integer")
    .optional(),
  brand_id: z.coerce
    .number()
    .int()
    .positive()
    .min(1, "brand_id must be a positive integer"),
  price: z.number().positive().min(0, "price must be a positive number"),
  discount_price: z.coerce
    .number()
    .positive()
    .min(0, "discount_price must be a positive number"),
  currency: z.string().length(3).default("USD"),
  rating_avg: z.coerce
    .number()
    .positive()
    .min(0, "rating_avg must be a positive number")
    .optional(),
  rating_count: z.coerce
    .number()
    .int()
    .positive()
    .min(0, "rating_count must be a positive integer")
    .optional(),
  stock_quantity: z.coerce
    .number()
    .int()
    .positive()
    .min(0, "stock_quantity must be a positive integer"),
  is_featured: z.coerce.boolean().default(false),
  images: z.array(
    z.object({
      image_url: z.string().max(500),
      is_primary: z.coerce.boolean().default(false),
      sort_order: z.coerce.number().int().positive().min(0).default(0),
    }),
  ),
});
