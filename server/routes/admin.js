const express = require("express");
const router = express.Router();
const {
  getDashboardStats,
  getInventoryLogs,
} = require("../controllers/adminController");
const auth = require("../middleware/auth");

// Middleware to check if user is admin (simplified)
const adminAuth = (req, res, next) => {
  if (req.user && req.user.role === "admin") {
    next();
  } else {
    res.status(403).json({ msg: "Access denied. Admin only." });
  }
};

// @route   GET api/admin/stats
// @desc    Get dashboard stats
// @access  Private (Admin)
router.get("/stats", auth, adminAuth, getDashboardStats);

// @route   GET api/orders
// @desc    Get all orders (Admin only)
// @access  Private (Admin)
router.get(
  "/orders",
  auth,
  adminAuth,
  require("../controllers/orderController").getAllOrders
);

// @route   GET api/users
// @desc    Get all users (Admin only)
// @access  Private (Admin)
router.get(
  "/users",
  auth,
  adminAuth,
  require("../controllers/userController").getAllUsers
);

// @route   PUT api/orders/:id
// @desc    Update order status (Admin only)
// @access  Private (Admin)
router.put(
  "/orders/:id",
  auth,
  adminAuth,
  require("../controllers/orderController").updateOrderStatusAdmin
);

// @route   GET api/admin/inventory-logs
// @desc    Get inventory logs
// @access  Private (Admin)
router.get("/inventory-logs", auth, adminAuth, getInventoryLogs);

module.exports = router;
