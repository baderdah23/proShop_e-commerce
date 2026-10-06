import { Request, Response, NextFunction } from "express";
import { CategorySchema } from "./category.validation.js";
import slugify from "slugify";
import {
  getCategorieByIdQuery,
  addCategorieQuery,
  getAllCategories,
  updateCategoryQuery,
  deleteCategoryQuery,
} from "./category.repo.js";
import asyncHandler from "express-async-handler";
import apiError from "../../utils/apiError.js";
import {
  createHandler,
  deleteHandler,
  getByIdHandler,
  updateHandler,
  getAllHandler,
} from "../../utils/handlersFactory.js";

// const createCategory = asyncHandler(
//   async (req: Request, res: Response, next: NextFunction) => {
//     const result = CategorySchema.safeParse(req.body);
//     if (!result.success) {
//       const error = new apiError(result.error.message, 400);
//       next(error);
//       return;
//     }

//     const { name_ar, name_en, image_url } = result.data as {
//       name_ar: string;
//       name_en: string;
//       slug: string;
//       image_url: string;
//     };

//     const queryResult = await addCategorieQuery(
//       name_ar,
//       name_en,
//       slugify(name_en).toLowerCase(),
//       image_url,
//     );
//     if (queryResult.rows.length > 0) {
//       res.status(201).json({
//         message: "Category added successfully",
//         result: queryResult.rows[0],
//       });
//     } else {
//       throw Error("Failed to add category");
//     }
//   },
// );

const createCategory = createHandler(
  async (req: Request, res: Response, next: NextFunction) => {
    const result = CategorySchema.safeParse(req.body);
    if (!result.success) {
      const error = new apiError(result.error.message, 400);
      next(error);
      return;
    }

    const { name_ar, name_en, image_url } = result.data as {
      name_ar: string;
      name_en: string;
      slug: string;
      image_url: string;
    };

    return addCategorieQuery(
      name_ar,
      name_en,
      slugify(name_en).toLowerCase(),
      image_url,
    );
  },
  "Category",
);

const getCategories = getAllHandler((req: Request) => {
  const page = Number(req.query.page) || 1;
  const limit = Number(req.query.limit) || 10;
  const offset = (page - 1) * limit;
  return getAllCategories(limit, offset);
}, "Category", "categories");

const getCategoryById = getByIdHandler(
  (id: string) => getCategorieByIdQuery(Number(id)),
  "Category",
);

const updateCategory = updateHandler(async (req: Request) => {
  const id = req.params.id as string;
  const { name_ar, name_en, image_url } = req.body;
  const slug = name_en ? slugify(name_en).toLowerCase() : undefined;
  return updateCategoryQuery(id, name_ar, name_en, slug, image_url);
}, "Category");

const deleteCategory = deleteHandler(
  (id: string) => deleteCategoryQuery(id),
  "Category",
);

export {
  createCategory,
  getCategories,
  getCategoryById,
  updateCategory,
  deleteCategory,
};
