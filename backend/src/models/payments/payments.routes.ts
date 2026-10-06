import express from "express";
import { cancelPayment, processPayment } from "./payments.controller.js";
import { protect } from "../../middlewares/auth.js";

const router = express.Router();

router.post("/payments/process", protect, processPayment);
router.post("/payments/:orderId/cancel", protect, cancelPayment);

export default router;
