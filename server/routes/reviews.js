const express = require('express');
const router = express.Router();
const { addReview, getProductReviews } = require('../controllers/reviewController');
const auth = require('../middleware/auth');

// @route   POST api/reviews
// @desc    Add a review
// @access  Private
router.post('/', auth, addReview);

// @route   GET api/reviews/:productId
// @desc    Get reviews for a product
// @access  Public
router.get('/:productId', getProductReviews);

module.exports = router;
