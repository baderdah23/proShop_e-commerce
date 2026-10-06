import { z } from "zod";

export const createReviewSchema = z.object({
  product_id: z.string().uuid({ message: "Invalid product ID format." }),
  customerName: z
    .string()
    .min(2, { message: "Customer name must be at least 2 characters." }),
  rating: z.coerce
    .number()
    .int()
    .min(1, { message: "Rating must be at least 1." })
    .max(5, { message: "Rating cannot exceed 5." }),
  comment: z
    .string()
    .min(3, { message: "Comment must be at least 3 characters long." }),
});

export const updateReviewSchema = z.object({
  rating: z.coerce
    .number()
    .int()
    .min(1, { message: "Rating must be at least 1." })
    .max(5, { message: "Rating cannot exceed 5." })
    .optional(),
  comment: z
    .string()
    .min(3, { message: "Comment must be at least 3 characters long." })
    .optional(),
});
