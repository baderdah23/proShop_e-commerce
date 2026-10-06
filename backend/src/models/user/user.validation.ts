import { z } from "zod";

export const UserSchema = z.object({
  full_name: z.string().min(3, "Full name must be at least 3 characters long"),
  email: z.string().email("Invalid email address"),
  phone: z.string().min(11, "Phone number must be at least 11 digits long"),
  password: z
    .string()
    .min(6, "Password must be at least 6 characters long")
    .regex(
      /[^a-zA-Z0-9]/,
      "Password must contain at least one special character",
    ),
  role: z.coerce.boolean().default(false),
  is_active: z.coerce.boolean().default(true),
});
