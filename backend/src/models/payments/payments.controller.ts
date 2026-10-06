import { Request, Response } from "express";
import asyncHandler from "express-async-handler";
import { createPaymentSchema } from "./payments.validation.js";
import { createPaymentInDb, updatePaymentStatusByRefFromDb, findOrderIdByPaymentRefFromDb } from "./payments.repo.js";
import { findOrderByIdFromDb, updateOrderStatusInDb } from "../orders/orders.repo.js";
import { cancelPendingOrderAndReleaseReservation } from "../orders/orders.repo.js";
import { clearCartAfterPurchaseFromDb } from "../cart/cart.repo.js";
import { createStripePaymentIntent, verifyStripeWebhookEvent } from "../../services/stripe.service.js";
import apiError from "../../utils/apiError.js";

export const processPayment = asyncHandler(
  async (req: Request, res: Response): Promise<void> => {
    const userId = (req as any).user.user_id as string;

    const validation = createPaymentSchema.safeParse(req.body);
    if (!validation.success) {
      throw new apiError(validation.error.issues[0].message, 400);
    }

    const { orderId, method } = validation.data;

    const order = await findOrderByIdFromDb(orderId, userId);
    if (!order) {
      throw new apiError("Order not found or unauthorized.", 404);
    }

    // المسار الأول: الدفع عند الاستلام (Cash on Delivery)

    if (method === "cash_on_delivery") {
      const paymentRecord = await createPaymentInDb({
        orderId: order.order_id,
        userId,
        method: "cash_on_delivery",
        status: "pending",
        amount: Number(order.total_amount),
        transactionRef: null,
      });

      // COD is confirmed the moment the order is placed — the cart may only
      // be cleared now, not at order creation (a credit-card order is not
      // confirmed until Stripe reports the payment succeeded).
      await clearCartAfterPurchaseFromDb(userId);

      res.status(201).json({
        success: true,
        message: "Order placed with Cash on Delivery successfully.",
        data: {
          payment: paymentRecord,
        },
      });
      return;
    }

    // المسار الثاني: الدفع الإلكتروني ببطاقة الائتمان (Credit Card عبر Stripe)

    if (method === "credit_card") {
      const stripeIntent = await createStripePaymentIntent(
        Number(order.total_amount),
        "usd",
        {
          orderId: order.order_id,
          userId,
        },
      );

      const paymentRecord = await createPaymentInDb({
        orderId: order.order_id,
        userId,
        method: "credit_card",
        status: "pending",
        amount: Number(order.total_amount),
        transactionRef: stripeIntent.paymentIntentId,
      });

      res.status(200).json({
        success: true,
        message: "Payment intent created. Please complete payment on client.",
        data: {
          clientSecret: stripeIntent.clientSecret,
          payment: paymentRecord,
        },
      });
      return;
    }
  },
);

export const cancelPayment = asyncHandler(
  async (req: Request, res: Response): Promise<void> => {
    const userId = (req as any).user.user_id as string;
    const orderId = Array.isArray(req.params.orderId)
      ? req.params.orderId[0]
      : req.params.orderId;
    const order = await cancelPendingOrderAndReleaseReservation(orderId, userId);
    if (!order) {
      throw new apiError("Pending order not found.", 404);
    }
    res.status(200).json({
      success: true,
      message: "Order reservation released.",
      data: order,
    });
  },
);

/**
 * Stripe webhook receiver. Mounted with express.raw() so the raw request
 * body is available for signature verification.
 *
 * - payment_intent.succeeded: mark the matching payment as paid and move the
 *   order to "processing" (money received, fulfillment can start).
 * - payment_intent.payment_failed: mark the payment failed and release the
 *   pending order's stock reservation so the cart can be retried.
 */
export const stripeWebhook = asyncHandler(
  async (req: Request, res: Response): Promise<void> => {
    const signature =
      typeof req.headers["stripe-signature"] === "string"
        ? req.headers["stripe-signature"]
        : "";

    if (!signature) {
      throw new apiError("Missing Stripe signature header.", 400);
    }

    let event: ReturnType<typeof verifyStripeWebhookEvent>;
    try {
      event = verifyStripeWebhookEvent(req.body, signature);
    } catch (error: any) {
      throw new apiError(`Webhook signature verification failed: ${error.message}`, 400);
    }

    const paymentIntent = (event.data.object as { id?: string }) || {};

    switch (event.type) {
      case "payment_intent.succeeded": {
        if (paymentIntent.id) {
          const updatedPayment = await updatePaymentStatusByRefFromDb(
            paymentIntent.id,
            "paid",
          );
          if (updatedPayment?.order_id) {
            await updateOrderStatusInDb(updatedPayment.order_id, "processing");
            // Money received — only now does the order become a real
            // purchase and may the buyer's cart be cleared.
            if (updatedPayment.created_by) {
              await clearCartAfterPurchaseFromDb(updatedPayment.created_by);
            }
          }
        }
        break;
      }

      case "payment_intent.payment_failed": {
        if (paymentIntent.id) {
          await updatePaymentStatusByRefFromDb(paymentIntent.id, "failed");
          const orderId = await findOrderIdByPaymentRefFromDb(paymentIntent.id);
          if (orderId) {
            await cancelPendingOrderAndReleaseReservation(orderId);
          }
        }
        break;
      }

      default:
        break;
    }

    res.status(200).json({ received: true });
  },
);
