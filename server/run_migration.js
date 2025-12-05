const fs = require("fs");
const path = require("path");
const db = require("./config/db");

async function runMigration() {
  try {
    console.log("Starting enhanced order management migration...");

    // Read the migration file
    const sql = fs.readFileSync(
      path.join(__dirname, "migrations", "migration.sql"),
      "utf8"
    );

    // Split by semicolon and filter out empty statements
    const statements = sql
      .split(";")
      .filter((stmt) => stmt.trim() !== "" && !stmt.trim().startsWith("--"));

    console.log(`Executing ${statements.length} SQL statements...`);

    // Execute each statement
    for (let i = 0; i < statements.length; i++) {
      const statement = statements[i].trim();
      if (statement) {
        console.log(`Executing statement ${i + 1}/${statements.length}...`);
        await db.query(statement);
      }
    }

    console.log("Migration completed successfully!");
    console.log("\nNew features added:");
    console.log("- Stripe payment integration fields in orders table");
    console.log("- Order status history tracking");
    console.log("- Refund processing system");
    console.log("- Inventory alerts and notifications");
    console.log("- Supplier management system");
    console.log("- Purchase order management");
    console.log("- Admin notification system");
    console.log("- Order splitting capabilities");

    process.exit(0);
  } catch (error) {
    console.error("Migration failed:", error);
    process.exit(1);
  }
}

// Run the migration
runMigration();
