const fs = require("fs");
const path = require("path");
require("dotenv").config();
const pool = require("./pool");

async function createTables() {
  try {
    console.log("Creating database tables...");

    // Test connection first
    await pool.query("SELECT NOW()");
    console.log("✅ Database connection successful");

    // Read the schema file
    const schemaPath = path.join(__dirname, "schema.sql");
    const schema = fs.readFileSync(schemaPath, "utf8");

    // Execute the schema
    await pool.query(schema);

    console.log("✅ Database tables created successfully!");
    console.log("Tables created:");
    console.log("- users");
    console.log("- movies");
    console.log("- saved_movies");
    console.log("- user_preferences");
    console.log("- tags");
    console.log("- movie_tags");
    console.log("- Sample data inserted");
  } catch (error) {
    console.error("❌ Error creating tables:", error);
    console.error(
      "Make sure you have created the .env file with your Supabase credentials"
    );
  } finally {
    await pool.end();
  }
}

// Run the function
createTables();
