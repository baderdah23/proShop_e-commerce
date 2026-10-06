import { z } from "zod";

export const createWishlistItemSchema = z.object({
  productId: z.string().uuid({ message: "Invalid product ID format." }),
});
