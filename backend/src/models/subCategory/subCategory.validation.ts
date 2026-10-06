import { z } from "zod";

export const SubCategorySchema = z.object({
  name_ar: z
    .string()
    .min(3, "Name must be at least 3 characters long")
    .max(100),
  name_en: z
    .string()
    .min(3, "Name must be at least 3 characters long")
    .max(100),
});
