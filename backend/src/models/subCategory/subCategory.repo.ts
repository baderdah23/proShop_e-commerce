import pool from "../../config/db.js";

const getSubCategorieByIdQuery = async (id: string) => {
  const qurey = `SELECT *
                 FROM subCategories 
                 WHERE id = $1`;
  const result = await pool.query(qurey, [id]);
  if (result.rows.length > 0) {
    return result.rows;
  }
  return null;
};

const getAllSubCategories = async () => {
  const qurey = `SELECT
    s.sub_category_id,
    s.name_en AS subcategory_name,
    c.category_id,
    c.name_en AS category_name
FROM sub_categories AS s
JOIN categories AS c
    ON s.category_id = c.category_id
ORDER BY c.category_id, s.sub_category_id`;
  const result = await pool.query(qurey);
  return result;
};

const addSubCategorieQuery = async (
  name_ar: string,
  name_en: string,
  slug: string,
  category_id: string,
) => {
  const qurey = `INSERT INTO sub_categories (name_ar, name_en, slug, category_id) VALUES ($1, $2, $3, $4) RETURNING *`;
  const result = await pool.query(qurey, [name_ar, name_en, slug, category_id]);
  return result;
};

const updateSubCategoryQuery = async (
  id: string,
  name_ar?: string,
  name_en?: string,
  slug?: string,
  category_id?: string,
) => {
  const query = `
    UPDATE sub_categories 
    SET 
      name_ar = COALESCE($1, name_ar), 
      name_en = COALESCE($2, name_en), 
      slug = COALESCE($3, slug), 
      category_id = COALESCE($4, category_id),
      updated_at = NOW()
    WHERE sub_category_id = $5 
    RETURNING *`;
  const result = await pool.query(query, [
    name_ar ?? null,
    name_en ?? null,
    slug ?? null,
    category_id ?? null,
    id,
  ]);
  return result;
};

const deleteSubCategoryQuery = async (id: string) => {
  const qurey = `DELETE FROM sub_categories WHERE id = $1 RETURNING *`;
  const result = await pool.query(qurey, [id]);
  return result;
};

export {
  getSubCategorieByIdQuery,
  addSubCategorieQuery,
  getAllSubCategories,
  deleteSubCategoryQuery,
  updateSubCategoryQuery,
};
