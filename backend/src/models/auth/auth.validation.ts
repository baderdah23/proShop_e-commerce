import { z } from "zod";

export const UserSchema = z.object({
  full_name: z.string().min(3, "Full name must be at least 3 characters long"),
  email: z.string().email("Invalid email address"),
  phone: z
    .string()
    .min(9, "Phone number must be at least 9 digits long")
    .max(20, "Phone number must be at most 20 characters long")
    .regex(/^\+?\d+$/, "Phone number must contain only digits (and an optional leading +)"),
  password: z
    .string()
    .min(6, "Password must be at least 6 characters long")
    .regex(/[A-Z]/, "Password must contain at least one uppercase letter")
    .regex(/[a-z]/, "Password must contain at least one lowercase letter")
    .regex(/[0-9]/, "Password must contain at least one number")
    .regex(
      /[^a-zA-Z0-9]/,
      "Password must contain at least one special character",
    ),
  role: z.enum(["customer", "admin"]).default("customer"),
  is_active: z.coerce.boolean().default(true),
});

export const newPasswordSchema = z.object({
  email: z.string().email("Invalid email address"),
  password: z
    .string()
    .min(6, "Password must be at least 6 characters long")
    .regex(/[A-Z]/, "Password must contain at least one uppercase letter")
    .regex(/[a-z]/, "Password must contain at least one lowercase letter")
    .regex(/[0-9]/, "Password must contain at least one number")
    .regex(
      /[^a-zA-Z0-9]/,
      "Password must contain at least one special character",
    ),
  resetCode: z
    .string()
    .min(6, "Reset code must be at least 6 digits long")
    .max(6, "Reset code must be at most 6 digits long"),
});

export const LoginSchema = z.object({
  email: z.string().email("Invalid email address"),
  password: z.string().min(1, "Password is required"),
});

export const profileUpdateSchema = z.object({
  full_name: z.string().min(3).max(150),
  email: z.string().email(),
  phone: z.string().min(7).max(20),
});
