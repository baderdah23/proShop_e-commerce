import { NextFunction, Request, Response } from "express";
import { addToCartSchema, updateCartItemSchema, applyCouponSchema } from "./cart.validation.js";
import {
  findOrCreateCartByUserId,
  findCartDetailsWithProducts,
  findCartItem,
  insertCartItem,
  updateCartItemQuantityInDb,
  deleteCartItemFromDb,
  clearCartItemsFromDb,
  applyCouponToCartInDb,
  removeCouponFromCartInDb,
} from "./cart.repo.js";
import { findCouponByCode, getCouponInvalidReason } from "../coupons/coupons.repo.js";
import apiError from "../../utils/apiError.js";

export const getCart = async (
  req: Request,
  res: Response,
  next: NextFunction,
) => {
  try {
    const userId = (req as any).user.user_id as string;
    const cart = await findOrCreateCartByUserId(userId);
    if (!cart) {
      const err = new apiError("Cart not found.", 404);
      next(err);
      return;
    }
    const items = await findCartDetailsWithProducts(cart.cart_id);

    const subtotal = items.reduce(
      (sum: number, item: any) => sum + Number(item.total_item_price),
      0,
    );

    let coupon = null;
    if (cart.coupon) {
      coupon = {
        coupon_id: cart.coupon.coupon_id,
        code: cart.coupon.code,
        discount_type: cart.coupon.discount_type,
        discount_value: Number(cart.coupon.discount_value),
      };
    }

    return res.status(200).json({
      success: true,
      message: "Cart fetched successfully.",
      data: {
        cart_id: cart.cart_id,
        items,
        total_items: items.length,
        subtotal,
        applied_coupon: coupon,
      },
    });
  } catch (error: any) {
    const err = new apiError(error.message, 500);
    next(err);
    return;
  }
};

export const applyCouponToCart = async (
  req: Request,
  res: Response,
  next: NextFunction,
) => {
  try {
    const validation = applyCouponSchema.safeParse(req.body);
    if (!validation.success) {
      const err = new apiError(validation.error.issues[0].message, 400);
      next(err);
      return;
    }

    const userId = (req as any).user.user_id as string;
    const cart = await findOrCreateCartByUserId(userId);
    if (!cart) {
      const err = new apiError("Cart not found.", 404);
      next(err);
      return;
    }

    const coupon = await findCouponByCode(validation.data.code);
    const invalidReason = getCouponInvalidReason(coupon);
    if (invalidReason) {
      const err = new apiError(invalidReason, coupon ? 400 : 404);
      next(err);
      return;
    }

    await applyCouponToCartInDb(cart.cart_id, coupon.coupon_id);

    return res.status(200).json({
      success: true,
      message: "Coupon applied successfully.",
      data: {
        coupon_id: coupon.coupon_id,
        code: coupon.code,
        discount_type: coupon.discount_type,
        discount_value: Number(coupon.discount_value),
      },
    });
  } catch (error: any) {
    const err = new apiError(error.message, 500);
    next(err);
    return;
  }
};

export const removeCouponFromCart = async (
  req: Request,
  res: Response,
  next: NextFunction,
) => {
  try {
    const userId = (req as any).user.user_id as string;
    const cart = await findOrCreateCartByUserId(userId);
    if (!cart) {
      const err = new apiError("Cart not found.", 404);
      next(err);
      return;
    }

    await removeCouponFromCartInDb(cart.cart_id);

    return res.status(200).json({
      success: true,
      message: "Coupon removed from cart.",
      data: null,
    });
  } catch (error: any) {
    const err = new apiError(error.message, 500);
    next(err);
    return;
  }
};

export const addItemToCart = async (
  req: Request,
  res: Response,
  next: NextFunction,
) => {
  try {
    const validation = addToCartSchema.safeParse(req.body);
    if (!validation.success) {
      const err = new apiError(validation.error.issues[0].message, 400);
      next(err);
      return;
    }

    const { productId, quantity } = validation.data;
    const userId = (req as any).user.user_id as string;

    const cart = await findOrCreateCartByUserId(userId);
    if (!cart) {
      const err = new apiError("Cart not found.", 404);
      next(err);
      return;
    }
    const existingItem = await findCartItem(cart.cart_id, productId);

    let resultItem;
    if (existingItem) {
      const newQuantity = existingItem.quantity + quantity;
      resultItem = await updateCartItemQuantityInDb(
        existingItem.cart_item_id,
        newQuantity,
      );
    } else {
      resultItem = await insertCartItem(cart.cart_id, productId, quantity);
    }

    return res.status(200).json({
      success: true,
      message: "Item added to cart successfully.",
      data: resultItem,
    });
  } catch (error: any) {
    const err = new apiError(error.message, 500);
    next(err);
    return;
  }
};

export const updateCartItem = async (
  req: Request,
  res: Response,
  next: NextFunction,
) => {
  try {
    const { cartItemId } = req.params;
    const validation = updateCartItemSchema.safeParse(req.body);

    if (!validation.success) {
      const err = new apiError(validation.error.issues[0].message, 400);
      next(err);
      return;
    }

    const { quantity } = validation.data;
    const updatedItem = await updateCartItemQuantityInDb(
      cartItemId as string,
      quantity,
    );

    if (!updatedItem) {
      const err = new apiError("Cart item not found.", 404);
      next(err);
      return;
    }

    return res.status(200).json({
      success: true,
      message: "Cart item quantity updated.",
      data: updatedItem,
    });
  } catch (error: any) {
    const err = new apiError(error.message, 500);
    next(err);
    return;
  }
};

export const removeCartItem = async (
  req: Request,
  res: Response,
  next: NextFunction,
) => {
  try {
    const { cartItemId } = req.params;
    const userId = (req as any).user.user_id as string;
    const deletedItem = await deleteCartItemFromDb(
      cartItemId as string,
      userId,
    );

    if (!deletedItem) {
      const err = new apiError("Cart item not found or already removed.", 404);
      next(err);
      return;
    }

    return res.status(200).json({
      success: true,
      message: "Item removed from cart successfully.",
      data: deletedItem,
    });
  } catch (error: any) {
    const err = new apiError(error.message, 500);
    next(err);
    return;
  }
};

export const clearCart = async (
  req: Request,
  res: Response,
  next: NextFunction,
) => {
  try {
    const userId = (req as any).user.user_id as string;
    const cart = await findOrCreateCartByUserId(userId);
    if (!cart) {
      const err = new apiError("Cart not found.", 404);
      next(err);
      return;
    }
    const deletedCartItems = await clearCartItemsFromDb(cart.cart_id);

    if (!deletedCartItems) {
      const err = new apiError("Cart items not found or already cleared.", 404);
      next(err);
      return;
    }

    return res.status(200).json({
      success: true,
      message: "Cart cleared successfully.",
      data: deletedCartItems,
    });
  } catch (error: any) {
    const err = new apiError(error.message, 500);
    next(err);
    return;
  }
};
