import { NextFunction, Request, Response } from "express";
import { createWishlistItemSchema } from "./wishlist.validation.js";
import {
  findWishlistItem,
  insertWishlistItem,
  findWishlistByUserId,
  deleteWishlistItemFromDb,
} from "./wishlist.repo.js";
import apiError from "../../utils/apiError.js";

export const addToWishlist = async (
  req: Request,
  res: Response,
  next: NextFunction,
) => {
  try {
    const validation = createWishlistItemSchema.safeParse(req.body);
    if (!validation.success) {
      const err = new apiError(validation.error.issues[0].message, 400);
      next(err);
      return;
    }

    const { productId } = validation.data;
    const userId = (req as any).user.user_id as string;

    const existingItem = await findWishlistItem(userId, productId);
    if (existingItem) {
      const err = new apiError("Product is already in your wishlist.", 400);
      next(err);
      return;
    }

    const newItem = await insertWishlistItem(userId, productId);

    return res.status(201).json({
      success: true,
      message: "Product added to wishlist successfully.",
      data: newItem,
    });
  } catch (error: any) {
    const err = new apiError(error.message, 500);
    next(err);
    return;
  }
};

export const getWishlist = async (
  req: Request,
  res: Response,
  next: NextFunction,
) => {
  try {
    const userId = (req as any).user.user_id as string;

    const wishlist = await findWishlistByUserId(userId);

    return res.status(200).json({
      success: true,
      message: "Wishlist fetched successfully.",
      data: wishlist,
    });
  } catch (error: any) {
    const err = new apiError(error.message, 500);
    next(err);
    return;
  }
};

export const removeFromWishlist = async (
  req: Request,
  res: Response,
  next: NextFunction,
) => {
  try {
    const { productId } = req.params;
    const userId = (req as any).user.user_id as string;

    if (!productId) {
      const err = new apiError("Product ID is required.", 400);
      next(err);
      return;
    }

    const existingItem = await findWishlistItem(userId, productId as string);
    if (!existingItem) {
      const err = new apiError("Product not found in your wishlist.", 404);
      next(err);
      return;
    }

    const deletedItem = await deleteWishlistItemFromDb(
      userId,
      productId as string,
    );

    if (!deletedItem) {
      const err = new apiError("Failed to delete product from wishlist.", 500);
      next(err);
      return;
    }

    return res.status(200).json({
      success: true,
      message: "Product removed from wishlist successfully.",
      data: deletedItem,
    });
  } catch (error: any) {
    const err = new apiError(error.message, 500);
    next(err);
    return;
  }
};
