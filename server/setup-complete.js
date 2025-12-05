const db = require("./config/db");
const fs = require("fs");

async function setupComplete() {
  try {
    console.log("=== Complete Database Setup ===");

    // Ensure we're using the right database
    await db.query("USE shoe_store");

    // 1. Create wishlist table if it doesn't exist
    console.log("1. Creating wishlist table...");
    try {
      await db.query(`
        CREATE TABLE wishlist (
          id INT AUTO_INCREMENT PRIMARY KEY,
          user_id INT NOT NULL,
          product_id INT NOT NULL,
          created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
          FOREIGN KEY (user_id) REFERENCES users(id),
          FOREIGN KEY (product_id) REFERENCES products(id),
          UNIQUE KEY unique_wishlist (user_id, product_id)
        )
      `);
      console.log("   ✓ Wishlist table created/verified");
    } catch (err) {
      if (err.message.includes("already exists")) {
        console.log("   ✓ Wishlist table already exists");
      } else {
        throw err;
      }
    }

    // 2. Verify all required tables exist
    console.log("\n2. Verifying table structure...");
    const requiredTables = [
      "users",
      "products",
      "cart_items",
      "wishlist",
      "categories",
    ];

    for (const table of requiredTables) {
      const [tables] = await db.query("SHOW TABLES LIKE ?", [table]);
      if (tables.length > 0) {
        console.log(`   ✓ ${table} table exists`);
      } else {
        console.log(`   ✗ ${table} table missing`);
      }
    }

    // 3. Add sample data if needed
    console.log("\n3. Ensuring sample data exists...");

    // Check and add categories
    const [categories] = await db.query(
      "SELECT COUNT(*) as count FROM categories"
    );
    if (categories[0].count === 0) {
      await db.query("INSERT INTO categories (name) VALUES (?)", ["Heels"]);
      await db.query("INSERT INTO categories (name) VALUES (?)", ["Sneakers"]);
      await db.query("INSERT INTO categories (name) VALUES (?)", ["Sandals"]);
      console.log("   ✓ Sample categories added");
    } else {
      console.log("   ✓ Categories already exist");
    }

    // Check and add products
    const [products] = await db.query("SELECT COUNT(*) as count FROM products");
    if (products[0].count === 0) {
      await db.query(
        "INSERT INTO products (name, description, price, category_id, image_url, brand) VALUES (?, ?, ?, ?, ?, ?)",
        [
          "Elegant Black Heel",
          "Beautiful black heel for special occasions",
          129.99,
          1,
          "https://example.com/heel1.jpg",
          "Designer Brand",
        ]
      );
      await db.query(
        "INSERT INTO products (name, description, price, category_id, image_url, brand) VALUES (?, ?, ?, ?, ?, ?)",
        [
          "White Sneaker",
          "Comfortable everyday white sneaker",
          89.99,
          2,
          "https://example.com/sneaker1.jpg",
          "Sport Brand",
        ]
      );
      await db.query(
        "INSERT INTO products (name, description, price, category_id, image_url, brand) VALUES (?, ?, ?, ?, ?, ?)",
        [
          "Summer Sandal",
          "Light and airy summer sandal",
          69.99,
          3,
          "https://example.com/sandal1.jpg",
          "Comfort Brand",
        ]
      );
      console.log("   ✓ Sample products added");
    } else {
      console.log("   ✓ Products already exist");
    }

    // 4. Test the wishlist query
    console.log("\n4. Testing wishlist functionality...");
    try {
      const [testResult] = await db.query(
        `
        SELECT p.*, w.created_at as added_at 
        FROM wishlist w 
        JOIN products p ON w.product_id = p.id 
        WHERE w.user_id = ?
      `,
        [3]
      );
      console.log(
        "   ✓ Wishlist query test successful, returned",
        testResult.length,
        "items"
      );
    } catch (err) {
      console.error("   ✗ Wishlist query test failed:", err.message);
      throw err;
    }

    console.log("\n=== Setup Complete ===");
    console.log("Database is now ready for wishlist and cart operations");
  } catch (err) {
    console.error("\nSetup failed:", err.message);
    console.error("Full error:", err);
    process.exit(1);
  } finally {
    process.exit(0);
  }
}

setupComplete();
