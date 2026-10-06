import { Router } from "express";
import {
  createUser,
  deleteUser,
  getUsers,
  getUserById,
  updateUser,
} from "./user.controller.js";
import { allowedTo } from "../../middlewares/allowedTo.js";

const router = Router();

router.post("/users", allowedTo, createUser);
router.get("/users", allowedTo, getUsers);
router.get("/users/:id", allowedTo, getUserById);
router.patch("/users/:id", allowedTo, updateUser);
router.delete("/users/:id", allowedTo, deleteUser);

export default router;
