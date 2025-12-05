const stripe = require("stripe")(process.env.STRIPE_SECRET_KEY);
const db = require("../config/db");

class PaymentService {
  constructor() {
    this.stripe = stripe;
  }

  /**
   * Create a payment intent for processing a payment
   * @param {number} amount - Amount in cents (Stripe expects cents)
   * @param {string} currency - Currency code (default: 'usd')
   * @param {object} metadata - Additional metadata
   * @returns {object} Payment intent object
   */
  async createPaymentIntent(amount, currency = "usd", metadata = {}) {
    try {
      const paymentIntent = await this.stripe.paymentIntents.create({
        amount: Math.round(amount * 100), // Convert to cents
        currency,
        metadata,
        automatic_payment_methods: {
          enabled: true,
        },
        description: metadata.description || "Shoe purchase",
        receipt_email: metadata.customer_email,
      });

      return {
        success: true,
        paymentIntent: {
          id: paymentIntent.id,
          client_secret: paymentIntent.client_secret,
          amount: paymentIntent.amount,
          currency: paymentIntent.currency,
          status: paymentIntent.status,
        },
      };
    } catch (error) {
      console.error("Error creating payment intent:", error);
      return {
        success: false,
        error: error.message,
      };
    }
  }

  /**
   * Retrieve a payment intent by ID
   * @param {string} paymentIntentId - Stripe payment intent ID
   * @returns {object} Payment intent details
   */
  async retrievePaymentIntent(paymentIntentId) {
    try {
      const paymentIntent = await this.stripe.paymentIntents.retrieve(
        paymentIntentId
      );

      return {
        success: true,
        paymentIntent: {
          id: paymentIntent.id,
          amount: paymentIntent.amount,
          currency: paymentIntent.currency,
          status: paymentIntent.status,
          metadata: paymentIntent.metadata,
        },
      };
    } catch (error) {
      console.error("Error retrieving payment intent:", error);
      return {
        success: false,
        error: error.message,
      };
    }
  }

  /**
   * Confirm a payment intent
   * @param {string} paymentIntentId - Stripe payment intent ID
   * @param {string} paymentMethodId - Stripe payment method ID
   * @returns {object} Confirmed payment details
   */
  async confirmPaymentIntent(paymentIntentId, paymentMethodId) {
    try {
      const paymentIntent = await this.stripe.paymentIntents.confirm(
        paymentIntentId,
        {
          payment_method: paymentMethodId,
          return_url: `${process.env.CLIENT_URL}/checkout/confirmation`,
        }
      );

      return {
        success: true,
        paymentIntent: {
          id: paymentIntent.id,
          status: paymentIntent.status,
          amount: paymentIntent.amount,
          currency: paymentIntent.currency,
        },
      };
    } catch (error) {
      console.error("Error confirming payment intent:", error);
      return {
        success: false,
        error: error.message,
      };
    }
  }

  /**
   * Create a Stripe customer
   * @param {string} email - Customer email
   * @param {string} name - Customer name
   * @param {object} metadata - Additional metadata
   * @returns {object} Customer details
   */
  async createCustomer(email, name, metadata = {}) {
    try {
      const customer = await this.stripe.customers.create({
        email,
        name,
        metadata: {
          ...metadata,
          source: "womens-shoe-store",
        },
      });

      return {
        success: true,
        customer: {
          id: customer.id,
          email: customer.email,
          name: customer.name,
        },
      };
    } catch (error) {
      console.error("Error creating customer:", error);
      return {
        success: false,
        error: error.message,
      };
    }
  }

  /**
   * Create a refund for an order
   * @param {string} paymentIntentId - Stripe payment intent ID
   * @param {number} amount - Refund amount (optional, for partial refunds)
   * @param {string} reason - Refund reason
   * @returns {object} Refund details
   */
  async createRefund(
    paymentIntentId,
    amount = null,
    reason = "requested_by_customer"
  ) {
    try {
      const refundData = {
        payment_intent: paymentIntentId,
        reason,
        metadata: {
          refunded_by: "womens-shoe-store",
          refund_date: new Date().toISOString(),
        },
      };

      if (amount) {
        refundData.amount = Math.round(amount * 100); // Convert to cents
      }

      const refund = await this.stripe.refunds.create(refundData);

      return {
        success: true,
        refund: {
          id: refund.id,
          amount: refund.amount,
          currency: refund.currency,
          status: refund.status,
          reason: refund.reason,
        },
      };
    } catch (error) {
      console.error("Error creating refund:", error);
      return {
        success: false,
        error: error.message,
      };
    }
  }

  /**
   * Process a refund and update order status
   * @param {number} orderId - Order ID in database
   * @param {string} stripePaymentId - Stripe payment intent ID
   * @param {number} amount - Refund amount (optional)
   * @param {string} reason - Refund reason
   * @returns {object} Processing result
   */
  async processRefund(
    orderId,
    stripePaymentId,
    amount = null,
    reason = "requested_by_customer"
  ) {
    try {
      // Create refund in Stripe
      const refundResult = await this.createRefund(
        stripePaymentId,
        amount,
        reason
      );

      if (!refundResult.success) {
        throw new Error(refundResult.error);
      }

      // Update order status in database
      const orderUpdateQuery = `
        UPDATE orders 
        SET status = 'refunded', 
            updated_at = NOW()
        WHERE id = ? AND stripe_payment_id = ?
      `;

      await db.execute(orderUpdateQuery, [orderId, stripePaymentId]);

      // Record refund in database
      const refundRecordQuery = `
        INSERT INTO refunds (order_id, stripe_refund_id, amount, reason, status, created_at)
        VALUES (?, ?, ?, ?, ?, NOW())
      `;

      await db.execute(refundRecordQuery, [
        orderId,
        refundResult.refund.id,
        amount || refundResult.refund.amount / 100,
        reason,
        refundResult.refund.status,
      ]);

      return {
        success: true,
        orderId,
        refund: refundResult.refund,
        message: "Refund processed successfully",
      };
    } catch (error) {
      console.error("Error processing refund:", error);
      return {
        success: false,
        error: error.message,
      };
    }
  }

  /**
   * Save payment method for future use
   * @param {string} customerId - Stripe customer ID
   * @param {string} paymentMethodId - Stripe payment method ID
   * @returns {object} Result with saved payment method
   */
  async savePaymentMethod(customerId, paymentMethodId) {
    try {
      // Attach payment method to customer
      await this.stripe.paymentMethods.attach(paymentMethodId, {
        customer: customerId,
      });

      // Set as default payment method
      await this.stripe.customers.update(customerId, {
        invoice_settings: {
          default_payment_method: paymentMethodId,
        },
      });

      return {
        success: true,
        paymentMethodId,
        message: "Payment method saved successfully",
      };
    } catch (error) {
      console.error("Error saving payment method:", error);
      return {
        success: false,
        error: error.message,
      };
    }
  }

  /**
   * Get saved payment methods for a customer
   * @param {string} customerId - Stripe customer ID
   * @returns {object} List of saved payment methods
   */
  async getCustomerPaymentMethods(customerId) {
    try {
      const paymentMethods = await this.stripe.paymentMethods.list({
        customer: customerId,
        type: "card",
      });

      return {
        success: true,
        paymentMethods: paymentMethods.data.map((pm) => ({
          id: pm.id,
          brand: pm.card.brand,
          last4: pm.card.last4,
          exp_month: pm.card.exp_month,
          exp_year: pm.card.exp_year,
        })),
      };
    } catch (error) {
      console.error("Error retrieving payment methods:", error);
      return {
        success: false,
        error: error.message,
      };
    }
  }

  /**
   * Handle webhook events from Stripe
   * @param {object} event - Stripe webhook event
   * @returns {object} Processing result
   */
  async handleWebhook(event) {
    try {
      const { type, data } = event;

      switch (type) {
        case "payment_intent.succeeded":
          await this.handlePaymentSuccess(data.object);
          break;

        case "payment_intent.payment_failed":
          await this.handlePaymentFailure(data.object);
          break;

        case "charge.dispute.created":
          await this.handleDisputeCreated(data.object);
          break;

        case "customer.subscription.created":
        case "customer.subscription.updated":
        case "customer.subscription.deleted":
          // Handle subscription events if needed
          break;

        default:
          console.log(`Unhandled event type: ${type}`);
      }

      return { success: true, message: "Webhook processed successfully" };
    } catch (error) {
      console.error("Error handling webhook:", error);
      return { success: false, error: error.message };
    }
  }

  /**
   * Handle successful payment
   * @param {object} paymentIntent - Stripe payment intent
   */
  async handlePaymentSuccess(paymentIntent) {
    try {
      const { id: paymentIntentId, metadata, amount } = paymentIntent;
      const { order_id } = metadata;

      if (order_id) {
        // Update order status in database
        const orderUpdateQuery = `
          UPDATE orders 
          SET status = 'confirmed', 
              stripe_payment_id = ?,
              total_price = ?,
              updated_at = NOW()
          WHERE id = ?
        `;

        await db.execute(orderUpdateQuery, [
          paymentIntentId,
          amount / 100,
          order_id,
        ]);

        // Create order status history entry
        const historyQuery = `
          INSERT INTO order_status_history (order_id, status, description, created_at)
          VALUES (?, 'confirmed', 'Payment confirmed via Stripe', NOW())
        `;

        await db.execute(historyQuery, [order_id]);
      }

      console.log(
        `Payment succeeded for order ${order_id}: ${paymentIntentId}`
      );
    } catch (error) {
      console.error("Error handling payment success:", error);
    }
  }

  /**
   * Handle failed payment
   * @param {object} paymentIntent - Stripe payment intent
   */
  async handlePaymentFailure(paymentIntent) {
    try {
      const {
        id: paymentIntentId,
        metadata,
        last_payment_error,
      } = paymentIntent;
      const { order_id } = metadata;

      if (order_id) {
        // Update order status in database
        const orderUpdateQuery = `
          UPDATE orders 
          SET status = 'payment_failed', 
              stripe_payment_id = ?,
              updated_at = NOW()
          WHERE id = ?
        `;

        await db.execute(orderUpdateQuery, [paymentIntentId, order_id]);

        // Create order status history entry
        const historyQuery = `
          INSERT INTO order_status_history (order_id, status, description, created_at)
          VALUES (?, 'payment_failed', ?, NOW())
        `;

        const errorMessage = last_payment_error
          ? last_payment_error.message
          : "Payment failed";
        await db.execute(historyQuery, [order_id, errorMessage]);
      }

      console.log(`Payment failed for order ${order_id}: ${paymentIntentId}`);
    } catch (error) {
      console.error("Error handling payment failure:", error);
    }
  }

  /**
   * Handle dispute created
   * @param {object} dispute - Stripe dispute object
   */
  async handleDisputeCreated(dispute) {
    try {
      // Log dispute for manual review
      console.log(
        `Dispute created: ${dispute.id} for charge ${dispute.charge}`
      );

      // You might want to:
      // 1. Notify admin via email
      // 2. Flag the order for review
      // 3. Create internal dispute record

      // For now, just log it
      await db.execute(
        `
        INSERT INTO admin_notifications (type, message, created_at, is_read)
        VALUES ('dispute', ?, NOW(), FALSE)
      `,
        [`Dispute created: ${dispute.id} for charge ${dispute.charge}`]
      );
    } catch (error) {
      console.error("Error handling dispute creation:", error);
    }
  }

  /**
   * Validate webhook signature
   * @param {string} payload - Raw payload
   * @param {string} signature - Stripe signature
   * @returns {object} Validated event or error
   */
  validateWebhookSignature(payload, signature) {
    try {
      const event = this.stripe.webhooks.constructEvent(
        payload,
        signature,
        process.env.STRIPE_WEBHOOK_SECRET
      );

      return { success: true, event };
    } catch (error) {
      console.error("Webhook signature verification failed:", error);
      return { success: false, error: error.message };
    }
  }
}

module.exports = new PaymentService();
