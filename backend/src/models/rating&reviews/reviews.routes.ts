import { Router } from "express";
import {
  createReview,
  updateReview,
  deleteReview,
  getReviewById,
  getAllReviewsByProductId,
  getAllReviewsForAdmin,
} from "./reviews.controller.js";
import { protect } from "../../middlewares/auth.js";
import { allowedTo } from "../../middlewares/allowedTo.js";
const router = Router();

router.post("/reviews", protect, createReview);
router.get("/reviews/product/:id", getAllReviewsByProductId);
router.get("/reviews", allowedTo, getAllReviewsForAdmin);
router.get("/reviews/:id", protect, getReviewById);
router.patch("/reviews/:id", protect, updateReview);
router.delete("/reviews/:id", protect, deleteReview);

export default router;
