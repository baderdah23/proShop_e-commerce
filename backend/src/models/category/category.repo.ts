import pool from "../../config/db.js";

const getCategorieByIdQuery = async (id: number) => {
  const qurey = `SELECT
    c.category_id,
    c.name_ar AS category_name_ar,
    c.name_en AS category_name_en,
    c.slug AS category_slug,
    c.image_url,
    COALESCE(
        json_agg(
            json_build_object(
                'sub_category_id', s.sub_category_id,
                'name_ar', s.name_ar,
                'name_en', s.name_en,
                'slug', s.slug
            )
        ) FILTER (WHERE s.sub_category_id IS NOT NULL),
        '[]'
    ) AS subcategories
FROM categories AS c
LEFT JOIN sub_categories AS s
    ON c.category_id = s.category_id
WHERE c.category_id = $1
GROUP BY c.category_id;`;
  const result = await pool.query(qurey, [id]);
  if (result.rows.length > 0) {
    return result.rows;
  }
  return null;
};

const getAllCategories = async (limit: number, offset: number) => {
  const qurey = `SELECT
    c.category_id,
    c.name_ar AS category_name_ar,
    c.name_en AS category_name_en,
    c.slug AS category_slug,
    c.image_url,
    COALESCE(
        json_agg(
            json_build_object(
                'sub_category_id', s.sub_category_id,
                'name_ar', s.name_ar,
                'name_en', s.name_en,
                'slug', s.slug
            )
        ) FILTER (WHERE s.sub_category_id IS NOT NULL),
        '[]'
    ) AS subcategories
FROM categories AS c
LEFT JOIN sub_categories AS s
    ON c.category_id = s.category_id
GROUP BY c.category_id
ORDER BY c.category_id
      LIMIT $1
      OFFSET $2`;
  const result = await pool.query(qurey, [limit, offset]);
  return result;
};

const addCategorieQuery = async (
  name_ar: string,
  name_en: string,
  slug: string,
  image_url: string,
) => {
  const qurey = `INSERT INTO categories (name_ar, name_en, slug, image_url) VALUES ($1, $2, $3, $4) RETURNING *`;
  const result = await pool.query(qurey, [name_ar, name_en, slug, image_url]);
  return result;
};

const updateCategoryQuery = async (
  id: string,
  name_ar?: string,
  name_en?: string,
  slug?: string,
  image_url?: string,
) => {
  const query = `
    UPDATE categories 
    SET 
      name_ar = COALESCE($1, name_ar), 
      name_en = COALESCE($2, name_en), 
      slug = COALESCE($3, slug), 
      image_url = COALESCE($4, image_url),
      updated_at = NOW()
    WHERE category_id = $5 
    RETURNING *`;
  const result = await pool.query(query, [
    name_ar ?? null,
    name_en ?? null,
    slug ?? null,
    image_url ?? null,
    id,
  ]);
  return result;
};

const deleteCategoryQuery = async (id: string) => {
  const qurey = `DELETE FROM categories WHERE id = $1 RETURNING *`;
  const result = await pool.query(qurey, [id]);
  return result;
};

export {
  getCategorieByIdQuery,
  addCategorieQuery,
  getAllCategories,
  deleteCategoryQuery,
  updateCategoryQuery,
};
