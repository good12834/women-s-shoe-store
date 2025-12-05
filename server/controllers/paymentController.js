const paymentService = require('../services/paymentService');
const db = require('../config/db');

// Create payment intent for Stripe checkout
exports.createPaymentIntent = async (req, res) => {
    try {
        const { amount, currency = 'usd', metadata = {} } = req.body;
        const userId = req.user?.id || 1;

        // Add user and order info to metadata
        const enrichedMetadata = {
            ...metadata,
            user_id: userId,
            customer_email: req.user?.email || metadata.customer_email,
            source: 'womens-shoe-store'
        };

        const result = await paymentService.createPaymentIntent(amount, currency, enrichedMetadata);

        if (result.success) {
            res.json(result);
        } else {
            res.status(400).json({
                success: false,
                error: result.error
            });
        }
    } catch (error) {
        console.error('Error creating payment intent:', error);
        res.status(500).json({
            success: false,
            error: 'Failed to create payment intent'
        });
    }
};

// Confirm payment intent
exports.confirmPayment = async (req, res) => {
    try {
        const { paymentIntentId, paymentMethodId } = req.body;

        const result = await paymentService.confirmPaymentIntent(paymentIntentId, paymentMethodId);

        if (result.success) {
            res.json(result);
        } else {
            res.status(400).json({
                success: false,
                error: result.error
            });
        }
    } catch (error) {
        console.error('Error confirming payment:', error);
        res.status(500).json({
            success: false,
            error: 'Failed to confirm payment'
        });
    }
};

// Retrieve payment intent
exports.retrievePaymentIntent = async (req, res) => {
    try {
        const { paymentIntentId } = req.params;

        const result = await paymentService.retrievePaymentIntent(paymentIntentId);

        if (result.success) {
            res.json(result);
        } else {
            res.status(400).json({
                success: false,
                error: result.error
            });
        }
    } catch (error) {
        console.error('Error retrieving payment intent:', error);
        res.status(500).json({
            success: false,
            error: 'Failed to retrieve payment intent'
        });
    }
};

// Create Stripe customer
exports.createCustomer = async (req, res) => {
    try {
        const { email, name, metadata = {} } = req.body;

        const result = await paymentService.createCustomer(email, name, metadata);

        if (result.success) {
            res.json(result);
        } else {
            res.status(400).json({
                success: false,
                error: result.error
            });
        }
    } catch (error) {
        console.error('Error creating customer:', error);
        res.status(500).json({
            success: false,
            error: 'Failed to create customer'
        });
    }
};

// Process refund
exports.processRefund = async (req, res) => {
    try {
        const { orderId, stripePaymentId, amount, reason } = req.body;

        const result = await paymentService.processRefund(orderId, stripePaymentId, amount, reason);

        if (result.success) {
            res.json(result);
        } else {
            res.status(400).json({
                success: false,
                error: result.error
            });
        }
    } catch (error) {
        console.error('Error processing refund:', error);
        res.status(500).json({
            success: false,
            error: 'Failed to process refund'
        });
    }
};

// Save payment method
exports.savePaymentMethod = async (req, res) => {
    try {
        const { customerId, paymentMethodId } = req.body;

        const result = await paymentService.savePaymentMethod(customerId, paymentMethodId);

        if (result.success) {
            res.json(result);
        } else {
            res.status(400).json({
                success: false,
                error: result.error
            });
        }
    } catch (error) {
        console.error('Error saving payment method:', error);
        res.status(500).json({
            success: false,
            error: 'Failed to save payment method'
        });
    }
};

// Get customer payment methods
exports.getPaymentMethods = async (req, res) => {
    try {
        const { customerId } = req.params;

        const result = await paymentService.getCustomerPaymentMethods(customerId);

        if (result.success) {
            res.json(result);
        } else {
            res.status(400).json({
                success: false,
                error: result.error
            });
        }
    } catch (error) {
        console.error('Error retrieving payment methods:', error);
        res.status(500).json({
            success: false,
            error: 'Failed to retrieve payment methods'
        });
    }
};

// Handle Stripe webhooks
exports.handleWebhook = async (req, res) => {
    try {
        const signature = req.headers['stripe-signature'];
        const payload = req.body;

        // Validate webhook signature
        const result = paymentService.validateWebhookSignature(payload, signature);

        if (!result.success) {
            return res.status(400).json({
                success: false,
                error: result.error
            });
        }

        // Process the webhook
        const webhookResult = await paymentService.handleWebhook(result.event);

        res.json(webhookResult);
    } catch (error) {
        console.error('Error handling webhook:', error);
        res.status(500).json({
            success: false,
            error: 'Failed to handle webhook'
        });
    }
};

// Process order payment (combined endpoint for checkout)
exports.processOrderPayment = async (req, res) => {
    try {
        const { 
            amount, 
            currency = 'usd', 
            paymentMethodId,
            shippingAddress,
            billingAddress,
            orderItems 
        } = req.body;
        
        const userId = req.user?.id || 1;

        // Create or retrieve customer
        let customerId;
        if (req.user?.email) {
            const customerResult = await paymentService.createCustomer(
                req.user.email,
                `${shippingAddress.firstName} ${shippingAddress.lastName}`,
                { user_id: userId }
            );
            if (customerResult.success) {
                customerId = customerResult.customer.id;
            }
        }

        // Create payment intent
        const paymentIntentResult = await paymentService.createPaymentIntent(amount, currency, {
            user_id: userId,
            customer_email: req.user?.email,
            customer_id: customerId,
            order_items: JSON.stringify(orderItems),
            shipping_address: JSON.stringify(shippingAddress),
            billing_address: JSON.stringify(billingAddress),
            source: 'womens-shoe-store'
        });

        if (!paymentIntentResult.success) {
            return res.status(400).json({
                success: false,
                error: paymentIntentResult.error
            });
        }

        // If payment method is provided, confirm the payment
        if (paymentMethodId) {
            const confirmResult = await paymentService.confirmPaymentIntent(
                paymentIntentResult.paymentIntent.id,
                paymentMethodId
            );

            if (!confirmResult.success) {
                return res.status(400).json({
                    success: false,
                    error: confirmResult.error
                });
            }
        }

        res.json({
            success: true,
            paymentIntent: paymentIntentResult.paymentIntent,
            customerId: customerId,
            message: 'Payment processed successfully'
        });

    } catch (error) {
        console.error('Error processing order payment:', error);
        res.status(500).json({
            success: false,
            error: 'Failed to process order payment'
        });
    }
};
