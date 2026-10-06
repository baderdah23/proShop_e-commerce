import { Router } from "express";
import {
  createCoupon,
  validateCoupon,
  getAllCoupons,
  deleteCoupon,
} from "./coupons.controller.js";
import { allowedTo } from "../../middlewares/allowedTo.js";
import { protect } from "../../middlewares/auth.js";

const router = Router();

router.post("/coupons/validate", protect, validateCoupon);
router.post("/coupons", allowedTo, createCoupon);
router.get("/coupons", allowedTo, getAllCoupons);
router.delete("/coupons/:couponId", allowedTo, deleteCoupon);

export default router;
