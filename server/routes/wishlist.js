const express = require('express');
const router = express.Router();
const { addToWishlist, getWishlist, removeFromWishlist } = require('../controllers/wishlistController');
const auth = require('../middleware/auth');

// @route   POST api/wishlist
// @desc    Add to wishlist
// @access  Private
router.post('/', auth, addToWishlist);

// @route   GET api/wishlist
// @desc    Get user wishlist
// @access  Private
router.get('/', auth, getWishlist);

// @route   DELETE api/wishlist/:productId
// @desc    Remove from wishlist
// @access  Private
router.delete('/:productId', auth, removeFromWishlist);

module.exports = router;
