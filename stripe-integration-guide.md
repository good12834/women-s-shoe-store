# Stripe Payment Integration Guide

## Overview

This guide explains how the Stripe payment integration has been implemented in the Women's Shoe Store project.

## What Was Implemented

### 1. Server-Side Changes

#### Environment Variables (.env)

- Added Stripe keys to `server/.env`:
  - `STRIPE_SECRET_KEY`: Your Stripe secret key
  - `STRIPE_PUBLISHABLE_KEY`: Your Stripe publishable key
  - `CLIENT_URL`: Your client application URL

#### Updated Payment Controller (`server/controllers/paymentController.js`)

- Replaced mock payment processing with real Stripe integration
- Added endpoints for:
  - `createPaymentIntent`: Create payment intents for checkout
  - `confirmPayment`: Confirm payment intents
  - `processOrderPayment`: Complete order processing with payment
  - `handleWebhook`: Process Stripe webhooks
  - `processRefund`: Handle refunds

#### Updated Payment Routes (`server/routes/payment.js`)

- Added comprehensive payment endpoints
- Proper authentication middleware
- Webhook endpoint for Stripe events

#### Payment Service (`server/services/paymentService.js`)

- Complete Stripe integration with:
  - Payment intent creation and management
  - Customer management
  - Refund processing
  - Webhook handling
  - Payment method management

### 2. Client-Side Changes

#### Stripe Configuration (`client/src/config/stripe.js`)

- Stripe initialization with publishable key
- Export configuration for use across the app

#### Stripe Checkout Component (`client/src/components/StripeCheckout.jsx`)

- Complete Stripe Elements integration
- Card form with real-time validation
- Payment processing with success/error handling
- Professional UI with loading states

#### Updated Checkout Page (`client/src/pages/Checkout.jsx`)

- Integrated Stripe checkout flow
- Added Step 4 for payment processing
- Real payment processing instead of mock
- Error handling and user feedback

## How to Use

### 1. Starting the Application

```bash
# Start the server
cd server
npm install
npm start

# Start the client (in another terminal)
cd client
npm install
npm run dev
```

### 2. Testing Payment Flow

1. Navigate to the checkout page
2. Fill in shipping information
3. Select "Credit/Debit Card" payment method
4. Review order details
5. Click "Place Order" - this will redirect to Step 4
6. Use Stripe's test card: `4242 4242 4242 4242`
7. Complete the payment

### 3. Test Cards

Use these test cards in Stripe's test mode:

- **Success**: 4242 4242 4242 4242
- **Declined**: 4000 0000 0000 0002
- **Insufficient funds**: 4000 0000 0000 9995

### 4. Webhooks (Optional)

To test webhooks locally:

1. Install Stripe CLI: https://stripe.com/docs/stripe-cli
2. Run: `stripe listen --forward-to localhost:5000/api/payment/webhook`
3. The CLI will provide a webhook signing secret to add to your `.env`

## Security Features

1. **Environment Variables**: All sensitive keys stored securely
2. **Server-Side Processing**: Payment processing happens on the server
3. **Webhook Verification**: Stripe webhook signatures are verified
4. **PCI Compliance**: Card details never touch your servers
5. **HTTPS**: Use HTTPS in production

## API Endpoints

- `POST /api/payment/create-intent` - Create payment intent
- `POST /api/payment/confirm` - Confirm payment
- `POST /api/payment/process-order` - Process complete order
- `POST /api/payment/webhook` - Handle webhooks
- `POST /api/payment/refund` - Process refunds

## Troubleshooting

### Common Issues

1. **CORS Errors**: Ensure server CORS is configured for your client URL
2. **Webhook Failures**: Check webhook signature verification
3. **Payment Fails**: Verify test card numbers and Stripe test mode
4. **Environment Variables**: Ensure all required Stripe keys are set

### Debug Steps

1. Check browser console for client-side errors
2. Check server logs for backend errors
3. Verify Stripe dashboard for payment attempts
4. Test with Stripe CLI for webhook debugging

## Production Deployment

### 1. Environment Variables

- Switch to production Stripe keys
- Update `CLIENT_URL` to your production domain
- Add production webhook endpoints

### 2. HTTPS Required

- Stripe requires HTTPS in production
- Use SSL certificates (Let's Encrypt, etc.)

### 3. Webhook Security

- Store webhook signing secrets securely
- Monitor webhook delivery in Stripe dashboard

## Support

For Stripe integration issues:

1. Check Stripe documentation: https://stripe.com/docs
2. Review Stripe status page
3. Contact Stripe support if needed

For project-specific issues:

1. Check server logs for errors
2. Verify environment variable configuration
3. Test payment flow step by step
