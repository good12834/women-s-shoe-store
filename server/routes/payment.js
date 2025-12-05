const express = require("express");
const router = express.Router();
const {
  createPaymentIntent,
  confirmPayment,
  retrievePaymentIntent,
  createCustomer,
  processRefund,
  savePaymentMethod,
  getPaymentMethods,
  handleWebhook,
  processOrderPayment,
} = require("../controllers/paymentController");
const auth = require("../middleware/auth");

// Demo middleware - allows payment endpoints to work without authentication
const demoAuth = (req, res, next) => {
  // For demo purposes, add a mock user
  req.user = { id: 1, email: "demo@example.com" };
  next();
};

// @route   POST api/payment/create-intent
// @desc    Create Stripe payment intent
// @access  Public (demo)
router.post("/create-intent", demoAuth, createPaymentIntent);

// @route   POST api/payment/confirm
// @desc    Confirm Stripe payment intent
// @access  Public (demo)
router.post("/confirm", demoAuth, confirmPayment);

// @route   GET api/payment/intent/:paymentIntentId
// @desc    Retrieve payment intent
// @access  Public (demo)
router.get("/intent/:paymentIntentId", demoAuth, retrievePaymentIntent);

// @route   POST api/payment/customer
// @desc    Create Stripe customer
// @access  Public (demo)
router.post("/customer", demoAuth, createCustomer);

// @route   POST api/payment/refund
// @desc    Process refund
// @access  Private
router.post("/refund", auth, processRefund);

// @route   POST api/payment/save-method
// @desc    Save payment method
// @access  Private
router.post("/save-method", auth, savePaymentMethod);

// @route   GET api/payment/methods/:customerId
// @desc    Get customer payment methods
// @access  Private
router.get("/methods/:customerId", auth, getPaymentMethods);

// @route   POST api/payment/webhook
// @desc    Handle Stripe webhooks
// @access  Public (Stripe webhook)
router.post(
  "/webhook",
  express.raw({ type: "application/json" }),
  handleWebhook
);

// @route   POST api/payment/process-order
// @desc    Process complete order payment
// @access  Public (demo)
router.post("/process-order", demoAuth, processOrderPayment);

module.exports = router;
