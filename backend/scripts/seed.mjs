import pg from "pg";
import "dotenv/config";
import fs from "fs";
import path from "path";
import { fileURLToPath } from "url";

// Seeds a (fresh) database with schema.sql + data.sql.
// Uses DATABASE_URL (Neon) when present, otherwise the local db_* variables.
const __dirname = path.dirname(fileURLToPath(import.meta.url));
const databaseUrl = process.env.DATABASE_URL;

const client = databaseUrl
  ? new pg.Client({
      connectionString: databaseUrl,
      ssl: /localhost|127\.0\.0\.1/.test(databaseUrl)
        ? false
        : { rejectUnauthorized: false },
    })
  : new pg.Client({
      host: process.env.db_host || "localhost",
      port: Number(process.env.db_port || 5432),
      user: process.env.db_user,
      password: process.env.db_password,
      database: process.env.db_database,
    });

await client.connect();
try {
  for (const file of ["schema.sql", "data.sql"]) {
    const sql = fs.readFileSync(path.join(__dirname, "../src/db", file), "utf8");
    console.log(`applying ${file}...`);
    await client.query(sql);
    console.log(`applied ${file}`);
  }
  console.log("Seed complete.");
} finally {
  await client.end();
}