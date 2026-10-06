import { Router } from "express";
import {
  createCategory,
  deleteCategory,
  getCategories,
  getCategoryById,
  updateCategory,
} from "./category.controller.js";
import { allowedTo } from "../../middlewares/allowedTo.js";

const router = Router();

router.post("/categories", allowedTo, createCategory);
router.get("/categories", getCategories);
router.get("/categories/:id", getCategoryById);
router.patch("/categories/:id", allowedTo, updateCategory);
router.delete("/categories/:id", allowedTo, deleteCategory);

export default router;
