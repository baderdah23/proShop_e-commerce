import { Router } from "express";
import {
  createOrder,
  getAllOrders,
  updateOrderStatus,
  getMyOrders,
  getOrderInvoice,
} from "./orders.controller.js";
import { protect } from "../../middlewares/auth.js";
import { allowedTo } from "../../middlewares/allowedTo.js";

const router = Router();

router.post("/orders", protect, createOrder);
router.get("/orders", allowedTo, getAllOrders);
router.patch("/orders/:orderId/status", allowedTo, updateOrderStatus);
router.get("/orders/my-orders", protect, getMyOrders);
router.get("/orders/:orderId/invoice", protect, getOrderInvoice);

export default router;
