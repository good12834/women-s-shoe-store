const express = require('express');
const router = express.Router();
const { createOrder, getOrders } = require('../controllers/orderController');
const auth = require('../middleware/auth');

// @route   POST api/orders
// @desc    Create an order
// @access  Private
router.post('/', auth, createOrder);

// @route   GET api/orders
// @desc    Get user orders
// @access  Private
router.get('/', auth, getOrders);

// @route   PUT api/orders/:id/status
// @desc    Update order status
// @access  Private (Admin)
router.put('/:id/status', auth, require('../controllers/orderController').updateOrderStatus);

// @route   GET api/orders/:id/tracking
// @desc    Get order tracking history
// @access  Private
router.get('/:id/tracking', auth, require('../controllers/orderController').getOrderTracking);

module.exports = router;
