import pool from "../../config/db.js";
import { ProductFilters } from "./product.controller.js";
import apiError from "../../utils/apiError.js";

const createProductQuery = async (
  sku: string,
  slug: string,
  name: string,
  description_ar: string,
  description_en: string,
  specs_ar: string,
  specs_en: string,
  category_id: number,
  sub_category_id: number,
  brand_id: number,
  price: number,
  discount_price: number,
  currency: string,
  rating_avg: number,
  rating_count: number,
  stock_quantity: number,
  is_featured: boolean,
  images: { image_url: string; is_primary: boolean; sort_order: number }[],
) => {
  const qurey = `INSERT INTO products (sku, slug, name, description_ar, description_en, specs_ar, specs_en, category_id, sub_category_id, brand_id, price, discount_price, currency, rating_avg, rating_count, stock_quantity, is_featured) VALUES ($1, $2, $3, $4, $5, $6, $7, $8, $9, $10, $11, $12, $13, $14, $15, $16, $17) RETURNING *`;
  const result = await pool.query(qurey, [
    sku,
    slug,
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
  ]);

  for (const image of images) {
    const imageQuery = `INSERT INTO product_images (product_id, image_url, is_primary, sort_order) VALUES ($1, $2, $3, $4)`;
    await pool.query(imageQuery, [
      result.rows[0].product_id,
      image.image_url,
      image.is_primary,
      image.sort_order,
    ]);
  }
  return result;
};

const checkCategoryQuery = async (id: number) => {
  const query = `SELECT * FROM categories WHERE category_id = $1`;
  const result = await pool.query(query, [id]);
  return result.rows[0];
};

const checkSubCategoryQuery = async (id: number) => {
  const query = `SELECT * FROM sub_categories WHERE sub_category_id = $1`;
  const result = await pool.query(query, [id]);
  return result.rows[0];
};

const checkBrandQuery = async (id: number) => {
  const query = `SELECT * FROM brands WHERE brand_id = $1`;
  const result = await pool.query(query, [id]);
  return result.rows[0];
};

const getAllProducts = async (
  limit: number,
  offset: number,
  filters: ProductFilters,
) => {
  let valuesNames;
  const conditions: string[] = [];
  const values: (number | string)[] = [limit, offset];

  const sortMap = {
    price_asc: "products.price ASC",
    price_desc: "products.price DESC",
    newest: "products.created_at DESC",
    oldest: "products.created_at ASC",
  };

  if (filters.search) {
    values.push(`%${filters.search}%`);

    conditions.push(`products.name ILIKE $${values.length}`);
  }

  const brandId = filters.brand ? Number(filters.brand) : NaN;
  const categoryId = filters.category ? Number(filters.category) : NaN;
  const subcategoryId = filters.subcategory ? Number(filters.subcategory) : NaN;

  if (
    (filters.brand && Number.isNaN(brandId)) ||
    (filters.category && Number.isNaN(categoryId)) ||
    (filters.subcategory && Number.isNaN(subcategoryId))
  ) {
    valuesNames = await pool.query(
      `SELECT
    (SELECT brand_id FROM brands WHERE name = $1) AS brand_id,
    (SELECT category_id FROM categories WHERE name_en = $2) AS category_id,
    (SELECT sub_category_id FROM sub_categories WHERE name_en = $3) AS sub_category_id;`,
      [filters.brand, filters.category, filters.subcategory],
    );
  }

  if (filters.brand) {
    const resolvedBrandId = Number.isNaN(brandId)
      ? valuesNames?.rows[0].brand_id
      : brandId;
    if (resolvedBrandId === null || resolvedBrandId === undefined) {
      throw new apiError("Brand not found", 404);
    }
    values.push(resolvedBrandId);
    conditions.push(`products.brand_id = $${values.length}`);
  }

  if (filters.category) {
    const resolvedCategoryId = Number.isNaN(categoryId)
      ? valuesNames?.rows[0].category_id
      : categoryId;
    if (resolvedCategoryId === null || resolvedCategoryId === undefined) {
      throw new apiError("Category not found", 404);
    }
    values.push(resolvedCategoryId);
    conditions.push(`products.category_id = $${values.length}`);
  }

  if (filters.subcategory) {
    const resolvedSubcategoryId = Number.isNaN(subcategoryId)
      ? valuesNames?.rows[0].sub_category_id
      : subcategoryId;
    if (resolvedSubcategoryId === null || resolvedSubcategoryId === undefined) {
      throw new apiError("Sub category not found", 404);
    }
    values.push(resolvedSubcategoryId);
    conditions.push(`products.sub_category_id = $${values.length}`);
  }

  if (filters.minPrice !== undefined && !Number.isNaN(filters.minPrice)) {
    values.push(filters.minPrice);
    conditions.push(`products.price >= $${values.length}`);
  }

  if (filters.maxPrice !== undefined && !Number.isNaN(filters.maxPrice)) {
    values.push(filters.maxPrice);
    conditions.push(`products.price <= $${values.length}`);
  }

  const orderBy =
    sortMap[filters.sort as keyof typeof sortMap] || sortMap.newest;

  const query = `
    SELECT
      products.*,
      categories.name_ar AS category_name,
      categories.image_url AS category_image_url,
      brands.name AS brand_name,
      COUNT(*) OVER() AS total_count,
      COALESCE(
        JSON_AGG(
          JSON_BUILD_OBJECT(
            'image_id', product_images.image_id,
            'product_id', product_images.product_id,
            'image_url', product_images.image_url,
            'is_primary', product_images.is_primary,
            'sort_order', product_images.sort_order
          ) ORDER BY product_images.is_primary DESC, product_images.sort_order ASC
        ) FILTER (WHERE product_images.image_id IS NOT NULL),
        '[]'::json
      ) AS images,
      COALESCE(
        MAX(product_images.image_url) FILTER (WHERE product_images.is_primary = TRUE),
        MIN(product_images.image_url)
      ) AS image_url
    FROM products
    LEFT JOIN product_images ON product_images.product_id = products.product_id
    LEFT JOIN categories ON categories.category_id = products.category_id
    LEFT JOIN brands ON brands.brand_id = products.brand_id
    ${conditions.length > 0 ? `WHERE ${conditions.join(" AND ")}` : ""}
    GROUP BY products.product_id, categories.name_ar, categories.image_url, brands.name
    ORDER BY ${orderBy}
    LIMIT $1 OFFSET $2
  `;
  const result = await pool.query(query, [...values]);
  return result;
};

const getProductByIdQuery = async (id: string) => {
  const qurey = `
    SELECT
      products.*,
      categories.name_ar AS category_name,
      categories.image_url AS category_image_url,
      brands.name AS brand_name,
      COALESCE(
        JSON_AGG(
          JSON_BUILD_OBJECT(
            'image_id', product_images.image_id,
            'product_id', product_images.product_id,
            'image_url', product_images.image_url,
            'is_primary', product_images.is_primary,
            'sort_order', product_images.sort_order
          ) ORDER BY product_images.is_primary DESC, product_images.sort_order ASC
        ) FILTER (WHERE product_images.image_id IS NOT NULL),
        '[]'::json
      ) AS images,
      COALESCE(
        MAX(product_images.image_url) FILTER (WHERE product_images.is_primary = TRUE),
        MIN(product_images.image_url)
      ) AS image_url
    FROM products
    LEFT JOIN product_images ON product_images.product_id = products.product_id
    LEFT JOIN categories ON categories.category_id = products.category_id
    LEFT JOIN brands ON brands.brand_id = products.brand_id
    WHERE products.product_id::text = $1
    GROUP BY products.product_id, categories.name_ar, categories.image_url, brands.name
  `;
  const result = await pool.query(qurey, [id]);

  return result;
};

const updateProductQuery = async (
  id?: string,
  sku?: string,
  slug?: string,
  name?: string,
  description_ar?: string,
  description_en?: string,
  specs_ar?: string,
  specs_en?: string,
  category_id?: number,
  sub_category_id?: number,
  brand_id?: number,
  price?: number,
  discount_price?: number,
  currency?: string,
  rating_avg?: number,
  rating_count?: number,
  stock_quantity?: number,
  is_featured?: boolean,
  images?: { image_url: string; is_primary: boolean; sort_order: number }[],
) => {
  const query = `
    UPDATE products 
    SET 
      sku = COALESCE($1, sku),
      slug = COALESCE($2, slug),
      name = COALESCE($3, name),
      description_ar = COALESCE($4, description_ar),
      description_en = COALESCE($5, description_en),
      specs_ar = COALESCE($6, specs_ar),
      specs_en = COALESCE($7, specs_en),
      category_id = COALESCE($8, category_id),
      sub_category_id = COALESCE($9, sub_category_id),
      brand_id = COALESCE($10, brand_id),
      price = COALESCE($11, price),
      discount_price = COALESCE($12, discount_price),
      currency = COALESCE($13, currency),
      rating_avg = COALESCE($14, rating_avg),
      rating_count = COALESCE($15, rating_count),
      stock_quantity = COALESCE($16, stock_quantity),
      is_featured = COALESCE($17, is_featured),
      updated_at = NOW()
    WHERE product_id = $18 
    RETURNING *`;
  const result = await pool.query(query, [
    sku ?? null,
    slug ?? null,
    name ?? null,
    description_ar ?? null,
    description_en ?? null,
    specs_ar ?? null,
    specs_en ?? null,
    category_id ?? null,
    sub_category_id ?? null,
    brand_id ?? null,
    price ?? null,
    discount_price ?? null,
    currency ?? null,
    rating_avg ?? null,
    rating_count ?? null,
    stock_quantity ?? null,
    is_featured ?? null,
    id,
  ]);

  if (images) {
    const deleteImagesQuery = `DELETE FROM product_images WHERE product_id = $1`;
    await pool.query(deleteImagesQuery, [id]);

    for (const image of images) {
      const imageQuery = `INSERT INTO product_images (product_id, image_url, is_primary, sort_order) VALUES ($1, $2, $3, $4)`;
      await pool.query(imageQuery, [
        id,
        image.image_url,
        image.is_primary,
        image.sort_order,
      ]);
    }
  }
  return result;
};

const deleteProductQuery = async (id: string) => {
  const qurey = `DELETE FROM products WHERE product_id = $1 RETURNING *`;
  const result = await pool.query(qurey, [id]);
  return result;
};

export {
  createProductQuery,
  getAllProducts,
  getProductByIdQuery,
  updateProductQuery,
  deleteProductQuery,
  checkCategoryQuery,
  checkSubCategoryQuery,
  checkBrandQuery,
};
