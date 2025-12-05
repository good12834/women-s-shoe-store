const express = require("express");
const router = express.Router();
const {
  getProducts,
  getProductById,
  createProduct,
} = require("../controllers/productController");
const auth = require("../middleware/auth");

// @route   GET api/products
// @desc    Get all products with filters
// @access  Public
router.get("/", getProducts);

// @route   GET api/products/:id
// @desc    Get product by ID
// @access  Public
router.get("/:id", getProductById);

// @route   POST api/products
// @desc    Create a product
// @access  Private (Admin)
router.post("/", auth, createProduct);

// @route   PUT api/products/:id
// @desc    Update a product
// @access  Private (Admin)
router.put(
  "/:id",
  auth,
  require("../controllers/productController").updateProduct
);

// @route   DELETE api/products/:id
// @desc    Delete a product
// @access  Private (Admin)
router.delete(
  "/:id",
  auth,
  require("../controllers/productController").deleteProduct
);

// @route   GET api/products/recommendations
// @desc    Get product recommendations
// @access  Public
router.get(
  "/recommendations",
  require("../controllers/productController").getRecommendations
);

module.exports = router;
