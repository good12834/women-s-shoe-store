const db = require("../config/db");

exports.getProducts = async (req, res) => {
  try {
    const {
      category,
      size,
      color,
      minPrice,
      maxPrice,
      heel,
      material,
      occasion,
      brand,
      sort,
    } = req.query;
    let query = `
      SELECT DISTINCT p.*, c.name as category_name 
      FROM products p 
      JOIN categories c ON p.category_id = c.id 
      LEFT JOIN product_variants pv ON p.id = pv.product_id
      LEFT JOIN sizes s ON pv.size_id = s.id
      LEFT JOIN colors co ON pv.color_id = co.id
      WHERE 1=1
    `;
    const params = [];

    if (category) {
      query += " AND c.name = ?";
      params.push(category);
    }

    if (minPrice) {
      query += " AND p.price >= ?";
      params.push(minPrice);
    }

    if (maxPrice) {
      query += " AND p.price <= ?";
      params.push(maxPrice);
    }

    if (size) {
      query += " AND s.size = ?";
      params.push(size);
    }

    if (color) {
      query += " AND co.color_name = ?";
      params.push(color);
    }

    if (heel) {
      query += " AND p.heel_height = ?";
      params.push(heel);
    }

    if (material) {
      query += " AND p.material = ?";
      params.push(material);
    }

    if (occasion) {
      query += " AND p.occasion = ?";
      params.push(occasion);
    }

    if (brand) {
      query += " AND p.brand = ?";
      params.push(brand);
    }

    // Sorting
    if (sort) {
      switch (sort) {
        case "price_asc":
          query += " ORDER BY p.price ASC";
          break;
        case "price_desc":
          query += " ORDER BY p.price DESC";
          break;
        case "rating":
          query += " ORDER BY p.rating DESC";
          break;
        case "newest":
          query += " ORDER BY p.created_at DESC";
          break;
        case "name":
          query += " ORDER BY p.name ASC";
          break;
        default:
          query += " ORDER BY p.created_at DESC";
      }
    } else {
      query += " ORDER BY p.created_at DESC";
    }

    const [products] = await db.query(query, params);
    res.json(products);
  } catch (err) {
    console.error(err.message);
    res.status(500).send("Server error");
  }
};

exports.getProductById = async (req, res) => {
  try {
    const [product] = await db.query("SELECT * FROM products WHERE id = ?", [
      req.params.id,
    ]);
    if (product.length === 0) {
      return res.status(404).json({ msg: "Product not found" });
    }

    // Get variants
    const [variants] = await db.query(
      `
      SELECT pv.id, s.size, co.color_name, co.hex_code, pv.stock 
      FROM product_variants pv
      JOIN sizes s ON pv.size_id = s.id
      JOIN colors co ON pv.color_id = co.id
      WHERE pv.product_id = ?
    `,
      [req.params.id]
    );

    res.json({ ...product[0], variants });
  } catch (err) {
    console.error(err.message);
    res.status(500).send("Server error");
  }
};

exports.createProduct = async (req, res) => {
  // Admin only - to be implemented with auth middleware check
  const { name, description, price, category_id, image_url } = req.body;
  try {
    const [result] = await db.query(
      "INSERT INTO products (name, description, price, category_id, image_url) VALUES (?, ?, ?, ?, ?)",
      [name, description, price, category_id, image_url]
    );
    res.json({ id: result.insertId, ...req.body });
  } catch (err) {
    console.error(err.message);
    res.status(500).send("Server error");
  }
};

exports.updateProduct = async (req, res) => {
  const { id } = req.params;
  const { name, description, price, category_id, image_url } = req.body;
  try {
    await db.query(
      "UPDATE products SET name = ?, description = ?, price = ?, category_id = ?, image_url = ? WHERE id = ?",
      [name, description, price, category_id, image_url, id]
    );
    res.json({ msg: "Product updated successfully" });
  } catch (err) {
    console.error(err.message);
    res.status(500).send("Server error");
  }
};

exports.deleteProduct = async (req, res) => {
  const { id } = req.params;
  try {
    await db.query("DELETE FROM products WHERE id = ?", [id]);
    res.json({ msg: "Product deleted successfully" });
  } catch (err) {
    console.error(err.message);
    res.status(500).send("Server error");
  }
};

exports.getRecommendations = async (req, res) => {
  // Basic recommendation logic: Random products for now
  // In a real app, use user_activity table to find similar categories/tags
  try {
    const [products] = await db.query(
      "SELECT * FROM products ORDER BY RAND() LIMIT 4"
    );
    res.json(products);
  } catch (err) {
    console.error(err.message);
    res.status(500).send("Server error");
  }
};
