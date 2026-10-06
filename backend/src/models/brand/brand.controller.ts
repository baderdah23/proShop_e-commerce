import { Request } from "express";
import { BrandSchema } from "./brand.validation.js";
import slugify from "slugify";
import {
  getBrandByIdQuery,
  createBrandQuery,
  getAllBrands,
  updateBrandQuery,
  deleteBrandQuery,
} from "./brand.repo.js";
import apiError from "../../utils/apiError.js";
import {
  deleteHandler,
  getByIdHandler,
  updateHandler,
  createHandler,
  getAllHandler,
} from "../../utils/handlersFactory.js";

const createBrand = createHandler(async (req: Request) => {
  const result = BrandSchema.safeParse(req.body);
  if (!result.success) {
    throw new apiError("Invalid request body", 400);
  }

  const { name, logo_url } = result.data as {
    name: string;
    slug: string;
    logo_url: string;
  };

  return createBrandQuery(name, slugify(name), logo_url);
}, "Brand");

const getBrands = getAllHandler(() => getAllBrands(), "Brand", "brands");

const getBrandById = getByIdHandler(
  (id: string) => getBrandByIdQuery(id),
  "Brand",
);

const updateBrand = updateHandler(async (req: Request) => {
  const id = req.params.id as string;
  const { name, logo_url } = req.body;
  const slug = name ? slugify(name).toLowerCase() : undefined;
  return updateBrandQuery(id, name, slug, logo_url);
}, "Brand");

const deleteBrand = deleteHandler(
  (id: string) => deleteBrandQuery(id),
  "Brand",
);

export { createBrand, getBrands, getBrandById, updateBrand, deleteBrand };
