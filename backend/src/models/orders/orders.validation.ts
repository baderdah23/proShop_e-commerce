import { z } from "zod";

export const createOrderSchema = z.object({
  addressId: z.string().uuid({ message: "Invalid address ID format." }),
  couponCode: z.string().optional(),
  shippingFee: z.coerce.number().nonnegative().optional().default(0),
});
