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
