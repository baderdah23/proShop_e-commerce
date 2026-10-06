import Stripe from "stripe";

const stripeSecretKey = process.env.STRIPE_SECRET_KEY;

export const stripe = new Stripe(stripeSecretKey as string, {
  apiVersion: "2026-09-30.endive",
});

export const createStripePaymentIntent = async (
  amount: number,
  currency: string = "usd",
  metadata: { orderId: string; userId: string },
) => {
  const amountInCents = Math.round(amount * 100);

  const paymentIntent = await stripe.paymentIntents.create({
    amount: amountInCents,
    currency: currency.toLowerCase(),
    automatic_payment_methods: {
      enabled: true,
    },
    metadata: {
      orderId: metadata.orderId,
      userId: metadata.userId,
    },
  });

  return {
    paymentIntentId: paymentIntent.id,
    clientSecret: paymentIntent.client_secret,
  };
};

export const verifyStripeWebhookEvent = (
  rawBody: string | Buffer,
  signature: string,
): Stripe.Event => {
  const webhookSecret = process.env.STRIPE_WEBHOOK_SECRET || "";
  return stripe.webhooks.constructEvent(rawBody, signature, webhookSecret);
};

/**
 * Retrieves the current status of a Stripe PaymentIntent.
 *
 * Used by the client-side payment confirmation endpoint: the frontend is
 * not trusted to claim a payment succeeded — the server re-checks Stripe
 * before marking the order paid / clearing the cart. Returns null when the
 * intent cannot be retrieved (unknown id, missing Stripe keys).
 *
 * @param paymentIntentId - The Stripe PaymentIntent id stored in `payments.transaction_ref`.
 * @returns The Stripe status (e.g. "succeeded", "requires_payment_method") or null.
 */
export const getStripePaymentIntentStatus = async (
  paymentIntentId: string,
): Promise<string | null> => {
  try {
    const intent = await stripe.paymentIntents.retrieve(paymentIntentId);
    return intent.status;
  } catch {
    return null;
  }
};
