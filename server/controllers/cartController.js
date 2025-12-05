const db = require("../config/db");

exports.getCart = async (req, res) => {
  try {
    const [cartItems] = await db.query(
      `
            SELECT ci.id, ci.product_id, ci.quantity, ci.size, ci.color,
                   p.name, p.price, p.image_url, p.brand
            FROM cart_items ci
            JOIN products p ON ci.product_id = p.id
            WHERE ci.user_id = ?
        `,
      [req.user.id]
    );

    // Transform data to match frontend format
    const formattedCart = cartItems.map((item) => ({
      id: item.product_id,
      cartItemId: item.id,
      name: item.name,
      price: parseFloat(item.price),
      image: item.image_url || item.image_url,
      image_url: item.image_url,
      quantity: item.quantity,
      size: item.size,
      color: item.color,
      brand: item.brand,
    }));

    res.json(formattedCart);
  } catch (err) {
    console.error(err.message);
    res.status(500).send("Server error");
  }
};

exports.addToCart = async (req, res) => {
  const { productId, quantity, size, color } = req.body;
  const userId = req.user.id;

  try {
    // Check if item already exists in cart
    const [existingItems] = await db.query(
      "SELECT id, quantity FROM cart_items WHERE user_id = ? AND product_id = ? AND size = ? AND color = ?",
      [userId, productId, size, color]
    );

    if (existingItems.length > 0) {
      // Update existing item
      const newQuantity = existingItems[0].quantity + quantity;
      await db.query("UPDATE cart_items SET quantity = ? WHERE id = ?", [
        newQuantity,
        existingItems[0].id,
      ]);
    } else {
      // Add new item
      await db.query(
        "INSERT INTO cart_items (user_id, product_id, quantity, size, color) VALUES (?, ?, ?, ?, ?)",
        [userId, productId, quantity, size, color]
      );
    }

    res.json({ msg: "Item added to cart successfully" });
  } catch (err) {
    console.error(err.message);
    res.status(500).send("Server error");
  }
};

exports.updateCartItem = async (req, res) => {
  const { itemId } = req.params;
  const { quantity } = req.body;
  const userId = req.user.id;

  try {
    if (quantity <= 0) {
      // Remove item if quantity is 0 or negative
      await db.query("DELETE FROM cart_items WHERE id = ? AND user_id = ?", [
        itemId,
        userId,
      ]);
      res.json({ msg: "Item removed from cart" });
    } else {
      // Update quantity
      await db.query(
        "UPDATE cart_items SET quantity = ? WHERE id = ? AND user_id = ?",
        [quantity, itemId, userId]
      );
      res.json({ msg: "Cart item updated successfully" });
    }
  } catch (err) {
    console.error(err.message);
    res.status(500).send("Server error");
  }
};

exports.removeFromCart = async (req, res) => {
  const { itemId } = req.params;
  const userId = req.user.id;

  try {
    await db.query("DELETE FROM cart_items WHERE id = ? AND user_id = ?", [
      itemId,
      userId,
    ]);
    res.json({ msg: "Item removed from cart" });
  } catch (err) {
    console.error(err.message);
    res.status(500).send("Server error");
  }
};

exports.clearCart = async (req, res) => {
  const userId = req.user.id;

  try {
    await db.query("DELETE FROM cart_items WHERE user_id = ?", [userId]);
    res.json({ msg: "Cart cleared successfully" });
  } catch (err) {
    console.error(err.message);
    res.status(500).send("Server error");
  }
};
