const db = require("../config/db");

exports.addToWishlist = async (req, res) => {
  const { product_id } = req.body;
  const user_id = req.user.id;

  try {
    await db.query(
      "INSERT IGNORE INTO wishlist (user_id, product_id) VALUES (?, ?)",
      [user_id, product_id]
    );
    res.json({ msg: "Added to wishlist" });
  } catch (err) {
    console.error(err.message);
    res.status(500).send("Server error");
  }
};

exports.getWishlist = async (req, res) => {
  const user_id = req.user.id;
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
    res.json(items);
  } catch (err) {
    console.error(err.message);
    res.status(500).send("Server error");
  }
};

exports.removeFromWishlist = async (req, res) => {
  const user_id = req.user.id;
  const { productId } = req.params;
  try {
    await db.query(
      "DELETE FROM wishlist WHERE user_id = ? AND product_id = ?",
      [user_id, productId]
    );
    res.json({ msg: "Removed from wishlist" });
  } catch (err) {
    console.error(err.message);
    res.status(500).send("Server error");
  }
};
