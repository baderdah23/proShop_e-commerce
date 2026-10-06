import { NextFunction, Request, Response } from "express";
import {
  createCouponSchema,
  validateCouponSchema,
} from "./coupons.validation.js";
import {
  findCouponByCode,
  insertCoupon,
  findAllCoupons,
  deleteCouponFromDb,
  getCouponInvalidReason,
} from "./coupons.repo.js";
import apiError from "../../utils/apiError.js";

export const createCoupon = async (
  req: Request,
  res: Response,
  next: NextFunction,
) => {
  try {
    const validation = createCouponSchema.safeParse(req.body);
    if (!validation.success) {
      const err = new apiError(validation.error.issues[0].message, 400);
      next(err);
      return;
    }

    const existingCoupon = await findCouponByCode(validation.data.code);
    if (existingCoupon) {
      const err = new apiError("Coupon code already exists.", 400);
      next(err);
      return;
    }

    const newCoupon = await insertCoupon(validation.data);

    return res.status(201).json({
      success: true,
      message: "Coupon created successfully.",
      data: newCoupon,
    });
  } catch (error: any) {
    const err = new apiError(error.message, 500);
    next(err);
    return;
  }
};

export const validateCoupon = async (
  req: Request,
  res: Response,
  next: NextFunction,
) => {
  try {
    const validation = validateCouponSchema.safeParse(req.body);
    if (!validation.success) {
      const err = new apiError(validation.error.issues[0].message, 400);
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

    return res.status(200).json({
      success: true,
      message: "Coupon is valid.",
      data: {
        coupon_id: coupon.coupon_id,
        code: coupon.code,
        discount_type: coupon.discount_type,
        discount_value: coupon.discount_value,
      },
    });
  } catch (error: any) {
    const err = new apiError(error.message, 500);
    next(err);
    return;
  }
};

export const getAllCoupons = async (
  req: Request,
  res: Response,
  next: NextFunction,
) => {
  try {
    const coupons = await findAllCoupons();
    return res.status(200).json({
      success: true,
      message: "Coupons fetched successfully.",
      data: coupons,
    });
  } catch (error: any) {
    const err = new apiError(error.message, 500);
    next(err);
    return;
  }
};

export const deleteCoupon = async (
  req: Request,
  res: Response,
  next: NextFunction,
) => {
  try {
    const { couponId } = req.params;
    const deletedCoupon = await deleteCouponFromDb(couponId as string);

    if (!deletedCoupon) {
      const err = new apiError("Coupon not found or failed to delete.", 404);
      next(err);
      return;
    }

    return res.status(200).json({
      success: true,
      message: "Coupon deleted successfully.",
      data: deletedCoupon,
    });
  } catch (error: any) {
    const err = new apiError(error.message, 500);
    next(err);
    return;
  }
};
