import { z } from "zod";

export const createPaymentSchema = z.object({
  orderId: z.string().uuid({
    message: "Invalid Order ID format.",
  }),

  method: z.union([z.literal("credit_card"), z.literal("cash_on_delivery")], {
    message:
      "Payment method must be either 'credit_card' or 'cash_on_delivery'.",
  }),
});

export type CreatePaymentInput = z.infer<typeof createPaymentSchema>;
