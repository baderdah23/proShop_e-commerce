import { Router } from "express";
import {
  addToWishlist,
  getWishlist,
  removeFromWishlist,
} from "./wishlist.controller.js";
import { protect } from "../../middlewares/auth.js";

const router = Router();

router.post("/wishlists", protect, addToWishlist);
router.get("/wishlists", protect, getWishlist);
router.delete("/wishlists/:productId", protect, removeFromWishlist);

export default router;
