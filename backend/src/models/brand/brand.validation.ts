import { z } from "zod";

export const BrandSchema = z.object({
  name: z.string().min(3, "Name must be at least 3 characters long").max(100),
  logo_url: z.string().max(255),
});
