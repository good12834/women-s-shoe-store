const express = require('express');
const router = express.Router();
const { registerUser, loginUser, getUser } = require('../controllers/userController');
const auth = require('../middleware/auth');

// @route   POST api/users/register
// @desc    Register user
// @access  Public
router.post('/register', registerUser);

// @route   POST api/users/login
// @desc    Login user & get token
// @access  Public
router.post('/login', loginUser);

// @route   GET api/users/me
// @desc    Get current user
// @access  Private
router.get('/me', auth, getUser);

// @route   POST api/users/address
// @desc    Add address
// @access  Private
router.post('/address', auth, require('../controllers/userController').addAddress);

// @route   GET api/users/address
// @desc    Get user addresses
// @access  Private
router.get('/address', auth, require('../controllers/userController').getAddresses);

module.exports = router;
