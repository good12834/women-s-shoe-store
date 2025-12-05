const express = require('express');
const router = express.Router();
const { validateCoupon } = require('../controllers/couponController');

// @route   POST api/coupons/validate
// @desc    Validate a coupon code
// @access  Public
router.post('/validate', validateCoupon);

module.exports = router;
