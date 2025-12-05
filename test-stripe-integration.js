// Test script to verify Stripe integration
const axios = require("axios");

const API_URL = "http://localhost:5000/api";

// Test data
const testOrderData = {
  amount: 199.99,
  currency: "usd",
  metadata: {
    customer_email: "test@example.com",
    order_items: JSON.stringify([
      { id: 1, name: "Test Product", price: 99.99, quantity: 2 },
    ]),
  },
};

async function testStripeIntegration() {
  console.log("🧪 Testing Stripe Integration...\n");

  try {
    // Test 1: Create Payment Intent
    console.log("1. Creating payment intent...");
    const paymentIntentResponse = await axios.post(
      `${API_URL}/payment/create-intent`,
      testOrderData,
      {
        headers: {
          "Content-Type": "application/json",
          Authorization: "Bearer test-token", // Replace with actual token
        },
      }
    );

    if (paymentIntentResponse.data.success) {
      console.log("✅ Payment intent created successfully");
      console.log(
        `   Payment Intent ID: ${paymentIntentResponse.data.paymentIntent.id}`
      );
      console.log(
        `   Client Secret: ${paymentIntentResponse.data.paymentIntent.client_secret.substring(
          0,
          20
        )}...`
      );
    } else {
      console.log("❌ Failed to create payment intent");
      console.log(`   Error: ${paymentIntentResponse.data.error}`);
      return;
    }

    // Test 2: Retrieve Payment Intent
    console.log("\n2. Retrieving payment intent...");
    const retrieveResponse = await axios.get(
      `${API_URL}/payment/intent/${paymentIntentResponse.data.paymentIntent.id}`,
      {
        headers: {
          Authorization: "Bearer test-token",
        },
      }
    );

    if (retrieveResponse.data.success) {
      console.log("✅ Payment intent retrieved successfully");
      console.log(`   Status: ${retrieveResponse.data.paymentIntent.status}`);
      console.log(
        `   Amount: $${(
          retrieveResponse.data.paymentIntent.amount / 100
        ).toFixed(2)}`
      );
    } else {
      console.log("❌ Failed to retrieve payment intent");
    }

    console.log("\n🎉 Stripe integration test completed successfully!");
    console.log("\n📋 Next steps:");
    console.log("   1. Start your server: cd server && npm start");
    console.log("   2. Start your client: cd client && npm run dev");
    console.log(
      "   3. Navigate to checkout and test with card: 4242 4242 4242 4242"
    );
  } catch (error) {
    console.error("❌ Test failed:", error.message);
    if (error.response) {
      console.error("   Server response:", error.response.data);
    }
  }
}

// Test if server is running
async function checkServer() {
  try {
    await axios.get("http://localhost:5000/api/health");
    return true;
  } catch (error) {
    return false;
  }
}

async function main() {
  console.log("🔍 Checking server status...");
  const serverRunning = await checkServer();

  if (!serverRunning) {
    console.log("❌ Server is not running. Please start the server first:");
    console.log("   cd server && npm start");
    return;
  }

  console.log("✅ Server is running");
  await testStripeIntegration();
}

main();
