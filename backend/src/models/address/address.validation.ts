import { z } from "zod";

export const addressSchema = z.object({
  label: z.preprocess(
    (value) => (value === null || value === undefined || value === "" ? "المنزل" : value),
    z.string().min(1).max(50),
  ),
  fullName: z
    .string()
    .min(2, { message: "Full name must be at least 2 characters." })
    .max(150, { message: "Full name cannot exceed 150 characters." }),
  phone: z
    .string()
    .min(7, { message: "Phone number must be at least 7 digits." })
    .max(20, { message: "Phone number cannot exceed 20 characters." }),
  country: z
    .string()
    .min(2, { message: "Country name must be at least 2 characters." }),
  city: z
    .string()
    .min(2, { message: "City name must be at least 2 characters." }),
  street: z
    .string()
    .min(3, { message: "Street name must be at least 3 characters." }),
  building: z.string().min(1, { message: "Building information is required." }),
  isDefault: z.coerce.boolean().default(false),
});

export const updateAddressSchema = addressSchema.partial();
