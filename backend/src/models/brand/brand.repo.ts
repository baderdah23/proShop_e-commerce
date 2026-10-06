import pool from "../../config/db.js";

// CREATE TABLE brands (
//     brand_id        SERIAL PRIMARY KEY,
//     "name**           VARCHAR(100) NOT NULL UNIQUE,
//     "slug**            VARCHAR(100) NOT NULL UNIQUE,
//     "logo_url**        VARCHAR(255) NOT NULL,
//     created_at      TIMESTAMP NOT NULL DEFAULT NOW(),
//     updated_at      TIMESTAMP NOT NULL DEFAULT NOW()
// );

const createBrandQuery = async (
  name: string,
  slug: string,
  logo_url: string,
) => {
  const qurey = `INSERT INTO brands (name, slug, logo_url) VALUES ($1, $2, $3) RETURNING *`;
  const result = await pool.query(qurey, [name, slug, logo_url]);
  return result;
};

const getAllBrands = async () => {
  const qurey = `SELECT * FROM brands`;
  const result = await pool.query(qurey);
  return result;
};

const getBrandByIdQuery = async (id: string) => {
  const qurey = `SELECT * FROM brands WHERE brand_id = $1`;
  const result = await pool.query(qurey, [id]);
  return result;
};

const updateBrandQuery = async (
  id?: string,
  name?: string,
  slug?: string,
  logo_url?: string,
) => {
  const query = `
    UPDATE brands 
    SET 
      name = COALESCE($1, name), 
      slug = COALESCE($2, slug), 
      logo_url = COALESCE($3, logo_url),
      updated_at = NOW()
    WHERE brand_id = $4 
    RETURNING *`;
  const result = await pool.query(query, [
    name ?? null,
    slug ?? null,
    logo_url ?? null,
    id,
  ]);
  return result;
};

const deleteBrandQuery = async (id: string) => {
  const qurey = `DELETE FROM brands WHERE brand_id = $1 RETURNING *`;
  const result = await pool.query(qurey, [id]);
  return result;
};

export {
  createBrandQuery,
  getAllBrands,
  getBrandByIdQuery,
  updateBrandQuery,
  deleteBrandQuery,
};
