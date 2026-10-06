import { Router } from "express";
import {
  forgetPassword,
  getUser,
  login,
  logout,
  resetPassword,
  sginup,
  verifyResetCode,
  updateUserProfile,
} from "./auth.controller.js";
import { protect } from "../../middlewares/auth.js";

const router = Router();

router.post("/auth/signup", sginup);
router.post("/auth/login", login);
router.get("/auth/me", protect, getUser);
router.patch("/auth/me", protect, updateUserProfile);
router.post("/auth/logout", protect, logout);
router.post("/auth/forgot-password", forgetPassword);
router.post("/auth/verify-reset-code", verifyResetCode);
router.post("/auth/reset-password", resetPassword);

export default router;
