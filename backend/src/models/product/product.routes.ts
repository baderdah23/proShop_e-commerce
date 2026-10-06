import { Router } from "express";
import {
  createProduct,
  deleteProduct,
  getProducts,
  getProductById,
  updateProduct,
} from "./product.controller.js";
import { allowedTo } from "../../middlewares/allowedTo.js";

const router = Router();

router.post("/products", allowedTo, createProduct);
router.get("/products", getProducts);
router.get("/products/:id", getProductById);
router.patch("/products/:id", allowedTo, updateProduct);
router.delete("/products/:id", allowedTo, deleteProduct);

export default router;
