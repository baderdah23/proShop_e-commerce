import { Pool } from "pg";
import "dotenv/config";

const databaseUrl = process.env.DATABASE_URL;

// In production (Vercel + Neon) the DATABASE_URL connection string is used.
// For local development we fall back to the discrete db_* variables.
const pool = databaseUrl
  ? new Pool({
      connectionString: databaseUrl,
      ssl: /localhost|127\.0\.0\.1/.test(databaseUrl)
        ? false
        : { rejectUnauthorized: false },
    })
  : new Pool({
      host: process.env.db_host || "localhost",
      port: Number(process.env.db_port || 5432),
      user: process.env.db_user,
      password: process.env.db_password,
      database: process.env.db_database,
    });

pool.on("connect", () => {
  console.log("Connected to PostgreSQL");
});

pool.on("error", (err) => {
  console.error("Unexpected error", err);
});

export default pool;
