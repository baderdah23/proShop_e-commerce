import { z } from "zod";

export const createCouponSchema = z.object({
  code: z.string().min(3).max(50),
  discount_type: z.enum(["percentage", "fixed"]),
  discount_value: z.number().positive(),
  max_uses: z.number().int().positive(),
  valid_from: z.string(),
  valid_until: z.string(),
  is_active: z.boolean().optional().default(true),
});

export const validateCouponSchema = z.object({
  code: z.string().min(1, "Coupon code is required."),
});
