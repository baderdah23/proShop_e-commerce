import pool from "../../config/db.js";

export interface AddressRow {
  address_id: string;
  user_id: string;
  full_name: string;
  phone: string;
  country: string;
  city: string;
  street: string;
  building: string;
  created_at: Date;
  updated_at: Date;
}

export const findAddressesByUserId = async (
  userId: string,
): Promise<AddressRow[]> => {
  const query = `
    SELECT * FROM addresses 
    WHERE user_id = $1
    ORDER BY is_default DESC, created_at DESC;
  `;
  const result = await pool.query(query, [userId]);
  return result.rows;
};

export const findAddressByIdAndUserId = async (
  addressId: string,
  userId: string,
): Promise<AddressRow | null> => {
  const query = `
    SELECT * FROM addresses
    WHERE address_id = $1 AND user_id = $2;
  `;
  const result = await pool.query(query, [addressId, userId]);
  return result.rows[0] || null;
};

export const insertAddress = async (
  userId: string,
  data: {
    label: string;
    fullName: string;
    phone: string;
    country: string;
    city: string;
    street: string;
    building: string;
    isDefault: boolean;
  },
): Promise<AddressRow> => {
  const client = await pool.connect();
  try {
    await client.query("BEGIN");
    const countResult = await client.query(
      "SELECT COUNT(*)::int AS count FROM addresses WHERE user_id = $1",
      [userId],
    );
    const shouldBeDefault = data.isDefault || countResult.rows[0].count === 0;
    if (shouldBeDefault) {
      await client.query("UPDATE addresses SET is_default = FALSE WHERE user_id = $1", [userId]);
    }
  const query = `
    INSERT INTO addresses (user_id, label, full_name, phone, country, city, street, building, is_default)
    VALUES ($1, $2, $3, $4, $5, $6, $7, $8, $9)
    RETURNING *;
  `;
  const values = [
    userId,
    data.label || "المنزل",
    data.fullName,
    data.phone,
    data.country,
    data.city,
    data.street,
    data.building,
    shouldBeDefault,
  ];
    const result = await client.query(query, values);
    await client.query("COMMIT");
    return result.rows[0];
  } catch (error) {
    await client.query("ROLLBACK");
    throw error;
  } finally {
    client.release();
  }
};

export const updateAddressInDb = async (
  addressId: string,
  userId: string,
  data: Partial<{
    label?: string;
    fullName?: string;
    phone?: string;
    country?: string;
    city?: string;
    street?: string;
    building?: string;
    isDefault?: boolean;
  }>,
) => {
  const client = await pool.connect();
  try {
    await client.query("BEGIN");
    if (data.isDefault) {
      await client.query(
        "UPDATE addresses SET is_default = FALSE WHERE user_id = $1",
        [userId],
      );
    }
    const query = `
    UPDATE addresses
    SET label = COALESCE($1, label),
        full_name = COALESCE($2, full_name),
        phone = COALESCE($3, phone),
        country = COALESCE($4, country),
        city = COALESCE($5, city),
        street = COALESCE($6, street),
        building = COALESCE($7, building),
        is_default = COALESCE($8, is_default),
        updated_at = NOW()
    WHERE address_id = $9 AND user_id = $10
    RETURNING *;
  `;
    const values = [
    data.label || null,
    data.fullName || null,
    data.phone || null,
    data.country || null,
    data.city || null,
    data.street || null,
    data.building || null,
    data.isDefault ?? null,
    addressId,
    userId,
  ];
    const result = await client.query(query, values);
    await client.query("COMMIT");
    return result.rows[0];
  } catch (error) {
    await client.query("ROLLBACK");
    throw error;
  } finally {
    client.release();
  }
};

export const deleteAddressFromDb = async (addressId: string, userId: string) => {
  const client = await pool.connect();
  try {
    await client.query("BEGIN");
    const query = `
    DELETE FROM addresses 
    WHERE address_id = $1 AND user_id = $2
    RETURNING *;
  `;
    const result = await client.query(query, [addressId, userId]);
    const deleted = result.rows[0];
    if (deleted?.is_default) {
      await client.query(
        `UPDATE addresses SET is_default = TRUE
         WHERE address_id = (
           SELECT address_id FROM addresses WHERE user_id = $1
           ORDER BY created_at DESC LIMIT 1
         )`,
        [userId],
      );
    }
    await client.query("COMMIT");
    return deleted;
  } catch (error) {
    await client.query("ROLLBACK");
    throw error;
  } finally {
    client.release();
  }
};
