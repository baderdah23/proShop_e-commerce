import { Request } from "express";
import { SubCategorySchema } from "./subCategory.validation.js";
import slugify from "slugify";
import {
  getSubCategorieByIdQuery,
  addSubCategorieQuery,
  getAllSubCategories,
  updateSubCategoryQuery,
  deleteSubCategoryQuery,
} from "./subCategory.repo.js";
import apiError from "../../utils/apiError.js";
import {
  deleteHandler,
  getByIdHandler,
  updateHandler,
  createHandler,
  getAllHandler,
} from "../../utils/handlersFactory.js";

const createSubCategory = createHandler(async (req: Request) => {
  const result = SubCategorySchema.safeParse(req.body);
  if (!result.success) {
    throw new apiError(result.error.message, 400);
  }

  const { name_ar, name_en, category_id } = result.data as {
    name_ar: string;
    name_en: string;
    slug: string;
    category_id: string;
  };

  return addSubCategorieQuery(
    name_ar,
    name_en,
    slugify(name_en).toLowerCase(),
    category_id,
  );
}, "subCategory");

const getSubCategories = getAllHandler(
  () => getAllSubCategories(),
  "subCategory",
  "subCategories",
);

const getSubCategoryById = getByIdHandler(
  (id: string) => getSubCategorieByIdQuery(id),
  "subCategory",
);

const updateSubCategory = updateHandler(async (req: Request) => {
  const id = req.params.id as string;
  const { name_ar, name_en, category_id } = req.body;
  const slug = name_en ? slugify(name_en).toLowerCase() : undefined;
  return updateSubCategoryQuery(id, name_ar, name_en, slug, category_id);
}, "subCategory");

const deleteSubCategory = deleteHandler(
  (id: string) => deleteSubCategoryQuery(id),
  "subCategory",
);

export {
  createSubCategory,
  getSubCategories,
  getSubCategoryById,
  updateSubCategory,
  deleteSubCategory,
};
