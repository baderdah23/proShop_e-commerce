import { Request } from "express";
import { ProductSchema } from "./product.validation.js";
import slugify from "slugify";
import {
  getProductByIdQuery,
  createProductQuery,
  getAllProducts,
  updateProductQuery,
  deleteProductQuery,
  checkCategoryQuery,
  checkSubCategoryQuery,
  checkBrandQuery,
} from "./product.repo.js";
import apiError from "../../utils/apiError.js";
import { getCategorieByIdQuery } from "../category/category.repo.js";
import {
  deleteHandler,
  getByIdHandler,
  updateHandler,
  createHandler,
  getAllHandler,
} from "../../utils/handlersFactory.js";

export type ProductFilters = {
  brand?: string;
  category?: string;
  subcategory?: string;
  minPrice?: number;
  maxPrice?: number;
  sort?: string;
  search?: string;
};

type ProductInputType = {
  sku: string;
  name: string;
  description_ar: string;
  description_en: string;
  specs_ar: string;
  specs_en: string;
  category_id: number;
  sub_category_id: number;
  brand_id: number;
  price: number;
  discount_price: number;
  currency: string;
  rating_avg: number;
  rating_count: number;
  stock_quantity: number;
  is_featured: boolean;
  images: { image_url: string; is_primary: boolean; sort_order: number }[];
};

const createProduct = createHandler(async (req: Request) => {
  const result = ProductSchema.safeParse(req.body);
  if (!result.success) {
    throw new apiError("Invalid request body", 400);
  }
  const {
    sku,
    name,
    description_ar,
    description_en,
    specs_ar,
    specs_en,
    category_id,
    sub_category_id,
    brand_id,
    price,
    discount_price,
    currency,
    rating_avg,
    rating_count,
    stock_quantity,
    is_featured,
    images,
  } = result.data as ProductInputType;

  const checkCategory = await checkCategoryQuery(category_id);
  if (!checkCategory) {
    throw new apiError("category not found", 404);
  }

  if (sub_category_id) {
    const checksubCategory = await checkSubCategoryQuery(sub_category_id);
    if (!checksubCategory) {
      throw new apiError("sub category not found", 404);
    }

    const categoryData = await getCategorieByIdQuery(category_id);
    const isSubCategoryBelongToCategory =
      categoryData &&
      categoryData[0].subcategories.find(
        (subCategory: any) => subCategory.sub_category_id === sub_category_id,
      );

    if (!isSubCategoryBelongToCategory) {
      throw new apiError("category not identify this subcategory", 404);
    }
  }

  const checkBrand = await checkBrandQuery(brand_id);
  if (!checkBrand) {
    throw new apiError("brand not found", 404);
  }

  return createProductQuery(
    sku,
    slugify(name).toLowerCase(),
    name,
    description_ar,
    description_en,
    specs_ar,
    specs_en,
    category_id,
    sub_category_id,
    brand_id,
    price,
    discount_price,
    currency,
    rating_avg,
    rating_count,
    stock_quantity,
    is_featured,
    images,
  );
}, "Product");

const getProducts = getAllHandler(
  (req: Request) => {
    const page = parseInt(req.query.page as string) || 1;
    const limit = parseInt(req.query.limit as string) || 20;
    const offset = (page - 1) * limit;

    const filters: ProductFilters = {
      brand: req.query.brand as string,
      category: req.query.category as string,
      subcategory: req.query.subcategory as string,
      minPrice: req.query.minPrice ? Number(req.query.minPrice) : undefined,
      maxPrice: req.query.maxPrice ? Number(req.query.maxPrice) : undefined,
      sort: (req.query.sort as string) || "newest",
      search: req.query.search as string,
    };

    return getAllProducts(limit, offset, filters);
  },
  "Product",
  "products",
);

const getProductById = getByIdHandler(
  (id: string) => getProductByIdQuery(id),
  "Product",
);

const updateProduct = updateHandler(async (req: Request) => {
  const id = req.params.id as string;
  const {
    sku,
    name,
    description_ar,
    description_en,
    specs_ar,
    specs_en,
    category_id,
    sub_category_id,
    brand_id,
    price,
    discount_price,
    currency,
    rating_avg,
    rating_count,
    stock_quantity,
    is_featured,
    images,
  } = req.body;

  const checkCategory = await checkCategoryQuery(category_id);
  if (!checkCategory) {
    throw new apiError("category not found", 404);
  }
  const checksubCategory = await checkSubCategoryQuery(sub_category_id);
  if (!checksubCategory) {
    throw new apiError("sub category not found", 404);
  }
  const checkBrand = await checkBrandQuery(brand_id);
  if (!checkBrand) {
    throw new apiError("brand not found", 404);
  }

  return updateProductQuery(
    id,
    sku,
    slugify(name),
    name,
    description_ar,
    description_en,
    specs_ar,
    specs_en,
    category_id,
    sub_category_id,
    brand_id,
    price,
    discount_price,
    currency,
    rating_avg,
    rating_count,
    stock_quantity,
    is_featured,
    images,
  );
}, "Product");

const deleteProduct = deleteHandler(
  (id: string) => deleteProductQuery(id),
  "Product",
);

export {
  createProduct,
  getProducts,
  getProductById,
  updateProduct,
  deleteProduct,
};
