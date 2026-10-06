import { NextFunction, Request, Response } from "express";
import { addressSchema, updateAddressSchema } from "./address.validation.js";
import {
  findAddressesByUserId,
  findAddressByIdAndUserId,
  insertAddress,
  updateAddressInDb,
  deleteAddressFromDb,
} from "./address.repo.js";
import expressAsyncHandler from "express-async-handler";
import apiError from "../../utils/apiError.js";

export const getAddress = expressAsyncHandler(
  async (req: Request, res: Response, next: NextFunction) => {
    try {
      const userId = (req as any).user.user_id as string;

      const addresses = await findAddressesByUserId(userId);

      res.status(200).json({
        success: true,
        message: "Address retrieved successfully.",
        data: addresses,
      });
      return;
    } catch (error: any) {
      res.status(500).json({
        success: false,
        message: error.message || "Internal server error.",
      });
      return;
    }
  },
);

export const createAddress = async (
  req: Request,
  res: Response,
  next: NextFunction,
) => {
  try {
    const validation = addressSchema.safeParse(req.body);
    if (!validation.success) {
      const err = new apiError(validation.error.issues[0].message, 400);
      next(err);
      return;
    }

    const userId = (req as any).user.user_id as string;

    const newAddress = await insertAddress(userId, validation.data);

    return res.status(201).json({
      success: true,
      message: "Address created successfully.",
      data: newAddress,
    });
  } catch (error: any) {
    return res.status(500).json({
      success: false,
      message: error.message || "Internal server error.",
    });
  }
};

export const updateAddress = async (
  req: Request,
  res: Response,
  next: NextFunction,
) => {
  try {
    const validation = updateAddressSchema.safeParse(req.body);
    if (!validation.success) {
      const err = new apiError(validation.error.issues[0].message, 400);
      next(err);
      return;
    }

    const userId = (req as any).user.user_id as string;
    const addressId = String(req.params.addressId || "");
    const existingAddress = await findAddressByIdAndUserId(addressId, userId);
    if (!existingAddress) {
      next(new apiError("Address not found.", 404));
      return;
    }
    const updatedAddress = await updateAddressInDb(addressId, userId, validation.data);

    return res.status(200).json({
      success: true,
      message: "Address updated successfully.",
      data: updatedAddress,
    });
  } catch (error: any) {
    return res.status(500).json({
      success: false,
      message: error.message || "Internal server error.",
    });
  }
};

export const deleteAddress = async (
  req: Request,
  res: Response,
  next: NextFunction,
) => {
  try {
    const userId = (req as any).user.user_id as string;
    const addressId = String(req.params.addressId || "");
    const deletedAddress = await deleteAddressFromDb(addressId, userId);

    if (!deletedAddress) {
      const err = new apiError(
        "Failed to delete address. Please try again later.",
        500,
      );
      next(err);
      return;
    }

    return res.status(200).json({
      success: true,
      message: "Address deleted successfully.",
      data: deletedAddress,
    });
  } catch (error: any) {
    return res.status(500).json({
      success: false,
      message: error.message || "Internal server error.",
    });
  }
};
