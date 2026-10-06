import { NextFunction, Request, Response } from "express";
import { createOrderSchema } from "./orders.validation.js";
import {
  createOrderWithTransaction,
  findOrdersByUserIdFromDb,
  findOrderByIdFromDb,
  findAllOrdersFromDb,
  updateOrderStatusInDb,
} from "./orders.repo.js";
import {
  findOrCreateCartByUserId,
  findCartDetailsWithProducts,
} from "../cart/cart.repo.js";
import { findCouponByCode, getCouponInvalidReason } from "../coupons/coupons.repo.js";
import { findPaymentsByOrderIdFromDb } from "../payments/payments.repo.js";
import { findAddressByIdAndUserId } from "../address/address.repo.js";
import apiError from "../../utils/apiError.js";

export const createOrder = async (
  req: Request,
  res: Response,
  next: NextFunction,
) => {
  try {
    const userId = (req as any).user.user_id as string;

    const validation = createOrderSchema.safeParse(req.body);
    if (!validation.success) {
      const err = new apiError(validation.error.issues[0].message, 400);
      next(err);
      return;
    }

    const { addressId, couponCode, shippingFee } = validation.data;

    const address = await findAddressByIdAndUserId(addressId, userId);
    if (!address) {
      const err = new apiError("Address not found.", 404);
      next(err);
      return;
    }

    const cart = await findOrCreateCartByUserId(userId);
    const cartItems = await findCartDetailsWithProducts(cart.cart_id);

    if (cartItems.length === 0) {
      const err = new apiError("Your cart is empty.", 400);
      next(err);
      return;
    }

    const subtotal = cartItems.reduce(
      (sum: number, item: any) => sum + Number(item.total_item_price),
      0,
    );

    let discountAmount = 0;
    let couponId: string | null = null;

    // The applied coupon is stored on the cart server-side so the checkout
    // page and the order share a single source of truth. couponCode remains
    // accepted as a fallback for legacy callers.
    const appliedCoupon = cart.coupon || null;
    const couponCodeToUse = appliedCoupon?.code || couponCode;

    if (couponCodeToUse) {
      const coupon = appliedCoupon || (await findCouponByCode(couponCodeToUse));
      const invalidReason = getCouponInvalidReason(coupon);
      if (invalidReason) {
        const err = new apiError(invalidReason, coupon ? 400 : 404);
        next(err);
        return;
      }

      couponId = coupon.coupon_id;
      if (coupon.discount_type === "percentage") {
        discountAmount = (subtotal * Number(coupon.discount_value)) / 100;
      } else if (coupon.discount_type === "fixed") {
        discountAmount = Number(coupon.discount_value);
      }
    }

    const totalAmount = Math.max(0, subtotal - discountAmount + shippingFee);
    const orderNumber = `ORD-${Date.now()}-${Math.floor(1000 + Math.random() * 9000)}`;

    const order = await createOrderWithTransaction({
      orderNumber,
      userId,
      addressId,
      couponId,
      subtotal,
      discountAmount,
      shippingFee,
      totalAmount,
      orderStatus: "pending",
      items: cartItems,
    });

    return res.status(201).json({
      success: true,
      message: "Order created successfully.",
      data: order,
    });
  } catch (error: any) {
    const err = new apiError(error.message, 500);
    next(err);
    return;
  }
};

export const getMyOrders = async (
  req: Request,
  res: Response,
  next: NextFunction,
) => {
  try {
    const userId = (req as any).user.user_id as string;
    const orders = await findOrdersByUserIdFromDb(userId);

    return res.status(200).json({
      success: true,
      message: "Orders fetched successfully.",
      data: orders,
    });
  } catch (error: any) {
    const err = new apiError(error.message, 500);
    next(err);
    return;
  }
};

export const getAllOrders = async (
  req: Request,
  res: Response,
  next: NextFunction,
) => {
  try {
    const orders = await findAllOrdersFromDb();
    res.status(200).json({
      success: true,
      message: "Orders fetched successfully.",
      data: orders,
    });
  } catch (error: any) {
    next(new apiError(error.message, 500));
  }
};

export const updateOrderStatus = async (
  req: Request,
  res: Response,
  next: NextFunction,
) => {
  try {
    const allowedStatuses = ["pending", "processing", "shipped", "delivered", "cancelled"];
    const { status } = req.body as { status?: string };
    if (!status || !allowedStatuses.includes(status)) {
      next(new apiError("Invalid order status.", 400));
      return;
    }
    const orderId = Array.isArray(req.params.orderId)
      ? req.params.orderId[0]
      : req.params.orderId;
    const order = await updateOrderStatusInDb(orderId, status);
    if (!order) {
      next(new apiError("Order not found.", 404));
      return;
    }
    res.status(200).json({ success: true, data: order });
  } catch (error: any) {
    next(new apiError(error.message, 500));
  }
};

export const getOrderInvoice = async (
  req: Request,
  res: Response,
  next: NextFunction,
) => {
  try {
    const userId = (req as any).user.user_id as string;
    const orderId = Array.isArray(req.params.orderId)
      ? req.params.orderId[0]
      : req.params.orderId;

    const order = await findOrderByIdFromDb(orderId, userId);

    if (!order) {
      const err = new apiError("Order not found.", 404);
      next(err);
      return;
    }

    // Include the most recent payment record so the invoice can show
    // the method used (credit_card / cash_on_delivery) and its status.
    const payments = await findPaymentsByOrderIdFromDb(orderId);
    const latestPayment = payments[0]
      ? { method: payments[0].method, status: payments[0].status }
      : null;

    return res.status(200).json({
      success: true,
      message: "Invoice fetched successfully.",
      data: {
        invoiceNumber: `INV-${order.order_number}`,
        createdAt: order.created_at,
        order,
        payment: latestPayment,
      },
    });
  } catch (error: any) {
    const err = new apiError(error.message, 500);
    next(err);
    return;
  }
};
