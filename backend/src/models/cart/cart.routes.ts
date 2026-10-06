import { Router } from "express";
import {
  getCart,
  addItemToCart,
  updateCartItem,
  removeCartItem,
  clearCart,
  applyCouponToCart,
  removeCouponFromCart,
} from "./cart.controller.js";
import { protect } from "../../middlewares/auth.js";

const router = Router();

router.get("/cart/", protect, getCart);
router.post("/cart/items", protect, addItemToCart);
router.put("/cart/items/:cartItemId", protect, updateCartItem);
router.delete("/cart/items/:cartItemId", protect, removeCartItem);
router.delete("/cart/clear", protect, clearCart);
router.post("/cart/coupon", protect, applyCouponToCart);
router.delete("/cart/coupon", protect, removeCouponFromCart);

export default router;
