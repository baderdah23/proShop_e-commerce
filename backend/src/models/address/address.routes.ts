import { Router } from "express";
import {
  getAddress,
  createAddress,
  updateAddress,
  deleteAddress,
} from "./address.controller.js";
import { protect } from "../../middlewares/auth.js";

const router = Router();

router.get("/addresses", protect, getAddress);
router.post("/addresses", protect, createAddress);
router.patch("/addresses/:addressId", protect, updateAddress);
router.delete("/addresses/:addressId", protect, deleteAddress);

export default router;
