import { NextFunction, Request, Response } from "express";
import {
  createReviewSchema,
  updateReviewSchema,
} from "./reviews.validation.js";
import {
  findReviewByUserAndProduct,
  insertReview,
  getReviewsByProductId,
  getAllReviews,
  findReviewById,
  updateReviewInDb,
  deleteReviewFromDb,
} from "./reviews.repo.js";
import apiError from "../../utils/apiError.js";
import expressAsyncHandler from "express-async-handler";

const createReview = expressAsyncHandler(
  async (req: Request, res: Response, next: NextFunction) => {
    const result = createReviewSchema.safeParse(req.body);
    if (!result.success) {
      throw new apiError(result.error.message, 400);
    }
    const { product_id, customerName, rating, comment } = result.data;
    const user_id = (req as any).user.user_id as string;
    const review = await findReviewByUserAndProduct(product_id, user_id);
    if (review) {
      throw new apiError("Review already exists", 400);
    }
    const getData = await insertReview(
      product_id,
      user_id,
      customerName,
      Number(rating),
      comment,
    );

    if (!getData) {
      const err = new apiError("Review not found", 404);
      next(err);
      return;
    }
    res.status(200).json({
      success: true,
      message: "Review created successfully",
      data: getData,
    });
  },
);

const getAllReviewsForAdmin = expressAsyncHandler(
  async (_req: Request, res: Response) => {
    const reviews = await getAllReviews();
    res.status(200).json({
      success: true,
      message: "Reviews fetched successfully",
      data: reviews,
    });
  },
);

const updateReview = expressAsyncHandler(
  async (req: Request, res: Response, next: NextFunction) => {
    const result = updateReviewSchema.safeParse(req.body);
    if (!result.success) {
      throw new apiError(result.error.message, 400);
    }
    const review_id = req.params.id as string;
    const { rating, comment } = result.data;
    const getData = await updateReviewInDb(
      review_id,
      Number(rating),
      comment as string,
    );

    if (!getData) {
      const err = new apiError("Review not found", 404);
      next(err);
      return;
    }
    res.status(200).json({
      success: true,
      message: "Review updated successfully",
      data: getData,
    });
  },
);

const deleteReview = expressAsyncHandler(
  async (req: Request, res: Response, next: NextFunction) => {
    const id = req.params.id as string;
    if (!id) {
      const err = new apiError("Review not found", 404);
      next(err);
      return;
    }
    const result = await deleteReviewFromDb(id);
    if (!result) {
      const err = new apiError("Review not found", 404);
      next(err);
      return;
    }
    res.status(200).json({
      success: true,
      message: "Review deleted successfully",
      data: result,
    });
  },
);

const getReviewById = expressAsyncHandler(
  async (req: Request, res: Response, next: NextFunction) => {
    const id = req.params.id as string;
    if (!id) {
      const err = new apiError("Review not found", 404);
      next(err);
      return;
    }
    const review = await findReviewById(id);
    if (!review) {
      const err = new apiError("Review not found", 404);
      next(err);
      return;
    }
    res.status(200).json({
      success: true,
      message: "Review fetched successfully",
      data: review,
    });
  },
);

const getAllReviewsByProductId = expressAsyncHandler(
  async (req: Request, res: Response, next: NextFunction) => {
    const id = req.params.id as string;
    if (!id) {
      const err = new apiError("Product not found", 404);
      next(err);
      return;
    }
    const reviews = await getReviewsByProductId(id);

    if (!reviews) {
      const err = new apiError("Reviews not found", 404);
      next(err);
      return;
    }
    res.status(200).json({
      success: true,
      message: "Reviews fetched successfully",
      data: reviews,
    });
  },
);

export {
  createReview,
  updateReview,
  deleteReview,
  getReviewById,
  getAllReviewsByProductId,
  getAllReviewsForAdmin,
};
