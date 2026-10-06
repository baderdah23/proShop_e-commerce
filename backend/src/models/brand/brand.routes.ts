import { Router } from "express";
import {
  createBrand,
  deleteBrand,
  getBrands,
  getBrandById,
  updateBrand,
} from "./brand.controller.js";
import { allowedTo } from "../../middlewares/allowedTo.js";

const router = Router();

router.post("/brands", allowedTo, createBrand);
router.get("/brands", getBrands);
router.get("/brands/:id", getBrandById);
router.patch("/brands/:id", allowedTo, updateBrand);
router.delete("/brands/:id", allowedTo, deleteBrand);

export default router;
