import { z } from "zod";

export const addToCartSchema = z.object({
  productId: z.string().uuid({ message: "Invalid product ID format." }),
  quantity: z
    .number()
    .int()
    .positive({ message: "Quantity must be at least 1." }),
});

export const updateCartItemSchema = z.object({
  quantity: z
    .number()
    .int()
    .positive({ message: "Quantity must be at least 1." }),
});

export const applyCouponSchema = z.object({
  code: z.string().min(1, "Coupon code is required."),
});
