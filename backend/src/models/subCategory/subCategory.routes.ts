import { Router } from "express";
import {
  createSubCategory,
  deleteSubCategory,
  getSubCategories,
  getSubCategoryById,
  updateSubCategory,
} from "./subCategory.controller.js";
import { allowedTo } from "../../middlewares/allowedTo.js";
import { protect } from "../../middlewares/auth.js";

const router = Router();

router.post("/sub-categories", allowedTo, createSubCategory);
router.get("/sub-categories", protect, getSubCategories);
router.get("/sub-categories/:id", protect, getSubCategoryById);
router.patch("/sub-categories/:id", allowedTo, updateSubCategory);
router.delete("/sub-categories/:id", allowedTo, deleteSubCategory);

export default router;
