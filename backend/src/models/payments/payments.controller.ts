import { Request, Response } from "express";
import asyncHandler from "express-async-handler";
import { createPaymentSchema } from "./payments.validation.js";
import {
  createPaymentInDb,
  updatePaymentStatusByRefFromDb,
  findOrderIdByPaymentRefFromDb,
  findPaymentsByOrderIdFromDb,
} from "./payments.repo.js";
import {
  findOrderByIdFromDb,
  updateOrderStatusInDb,
} from "../orders/orders.repo.js";
import { cancelPendingOrderAndReleaseReservation } from "../orders/orders.repo.js";
import { clearCartAfterPurchaseFromDb } from "../cart/cart.repo.js";
import {
  createStripePaymentIntent,
  verifyStripeWebhookEvent,
  getStripePaymentIntentStatus,
} from "../../services/stripe.service.js";
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

    if (method === "cash_on_delivery") {
      const paymentRecord = await createPaymentInDb({
        orderId: order.order_id,
        userId,
        method: "cash_on_delivery",
        status: "pending",
        amount: Number(order.total_amount),
        transactionRef: null,
      });

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

      res.status(201).json({
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
    const order = await cancelPendingOrderAndReleaseReservation(
      orderId,
      userId,
    );
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

export const confirmCardPayment = asyncHandler(
  async (req: Request, res: Response): Promise<void> => {
    const userId = (req as any).user.user_id as string;
    const orderId = Array.isArray(req.params.orderId)
      ? req.params.orderId[0]
      : req.params.orderId;

    const order = await findOrderByIdFromDb(orderId, userId);
    if (!order) {
      throw new apiError("Order not found or unauthorized.", 404);
    }

    const payments = await findPaymentsByOrderIdFromDb(orderId);
    const cardPayment = payments.find(
      (payment) => payment.method === "credit_card" && payment.transaction_ref,
    );

    if (cardPayment) {
      if (cardPayment.status === "paid") {
        await clearCartAfterPurchaseFromDb(userId);
        res
          .status(200)
          .json({ success: true, message: "Payment already confirmed." });
        return;
      }

      const intentStatus = await getStripePaymentIntentStatus(
        cardPayment.transaction_ref,
      );

      if (intentStatus !== "succeeded") {
        throw new apiError(
          intentStatus === null
            ? "تعذر التحقق من حالة الدفع لدى Stripe."
            : "الدفع لم يكتمل بعد.",
          409,
        );
      }

      await updatePaymentStatusByRefFromDb(cardPayment.transaction_ref, "paid");
      await updateOrderStatusInDb(orderId, "processing");
    }

    await clearCartAfterPurchaseFromDb(userId);

    res.status(200).json({
      success: true,
      message: "Payment confirmed.",
      data: { orderId },
    });
  },
);

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
      throw new apiError(
        `Webhook signature verification failed: ${error.message}`,
        400,
      );
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
