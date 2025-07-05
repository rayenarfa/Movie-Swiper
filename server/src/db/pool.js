const { Pool } = require("pg");
require("dotenv").config();

// Database configuration
const pool = new Pool({
  // Try connection string first (preferred for Supabase)
  connectionString: process.env.DATABASE_URL,

  // Fallback to individual parameters if no connection string
  user: process.env.DB_USER || "postgres",
  host: process.env.DB_HOST || "localhost",
  database: process.env.DB_NAME || "postgres",
  password: process.env.DB_PASSWORD || "password",
  port: process.env.DB_PORT || 5432,

  // Always use SSL for Supabase
  ssl:
    process.env.DATABASE_URL ||
    (process.env.DB_HOST && process.env.DB_HOST.includes("supabase.co"))
      ? { rejectUnauthorized: false }
      : false,

  max: 20, // Maximum number of connections
  idleTimeoutMillis: 30000, // Close idle clients after 30 seconds
  connectionTimeoutMillis: 10000, // Return an error after 10 seconds if connection could not be established
});

// Test the connection
pool.on("connect", () => {
  console.log("✅ Connected to PostgreSQL database");
});

pool.on("error", (err) => {
  console.error("❌ Unexpected error on idle client", err);
  process.exit(-1);
});

module.exports = pool;
