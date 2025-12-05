const db = require("./config/db");

async function testWishlist() {
  try {
    console.log("=== Testing Wishlist Controller Logic ===");

    // Test user ID (from JWT token: user.id = 3)
    const user_id = 3;
    console.log("Testing with user_id:", user_id);

    // Test 1: Simple wishlist query
    console.log("\n1. Testing simple wishlist query...");
    try {
      const [wishlistItems] = await db.query(
        "SELECT * FROM wishlist WHERE user_id = ?",
        [user_id]
      );
      console.log(
        "✓ Simple wishlist query successful:",
        wishlistItems.length,
        "items"
      );
    } catch (err) {
      console.error("✗ Simple wishlist query failed:", err.message);
      return;
    }

    // Test 2: Simple products query
    console.log("\n2. Testing simple products query...");
    try {
      const [products] = await db.query("SELECT * FROM products LIMIT 1");
      console.log(
        "✓ Simple products query successful:",
        products.length,
        "products"
      );
    } catch (err) {
      console.error("✗ Simple products query failed:", err.message);
      return;
    }

    // Test 3: JOIN query (exact from controller)
    console.log("\n3. Testing JOIN query (from controller)...");
    try {
      const [items] = await db.query(
        `
        SELECT p.*, w.created_at as added_at 
        FROM wishlist w 
        JOIN products p ON w.product_id = p.id 
        WHERE w.user_id = ?
      `,
        [user_id]
      );
      console.log("✓ JOIN query successful:", items.length, "items");
    } catch (err) {
      console.error("✗ JOIN query failed:", err.message);
      console.error("Full error:", err);
      return;
    }

    // Test 4: Test with actual data
    console.log("\n4. Testing with actual data...");
    try {
      // First, let's see what users exist
      const [users] = await db.query("SELECT id, name, email FROM users");
      console.log("Available users:", users);

      // See what products exist
      const [products] = await db.query("SELECT id, name, price FROM products");
      console.log("Available products:", products);

      // Check if wishlist table has the right structure
      const [columns] = await db.query("SHOW COLUMNS FROM wishlist");
      console.log(
        "Wishlist table structure:",
        columns.map((c) => c.Field)
      );
    } catch (err) {
      console.error("✗ Data inspection failed:", err.message);
    }

    console.log("\n=== Test Complete ===");
  } catch (err) {
    console.error("Overall test failed:", err.message);
  } finally {
    process.exit(0);
  }
}

testWishlist();
