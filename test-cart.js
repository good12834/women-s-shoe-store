// Test script for cart functionality
const testCartFunctionality = async () => {
  const token =
    "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJ1c2VyIjp7ImlkIjoxLCJyb2xlIjoiY3VzdG9tZXIifSwiaWF0IjoxNzY0MzU4MTY4LCJleHAiOjE3NjQ3MTgxNjh9.ez7ZHSgSUQc5nMH0OOfikHGDNh0wR-Yp_b0WAejzTR4";

  console.log("Testing cart functionality...");

  // Test 1: Get cart
  try {
    const getCartResponse = await fetch("http://localhost:5000/api/cart", {
      headers: {
        "x-auth-token": token,
      },
    });
    console.log("Get cart status:", getCartResponse.status);
    const getCartData = await getCartResponse.text();
    console.log("Get cart response:", getCartData);
  } catch (err) {
    console.error("Get cart error:", err);
  }

  // Test 2: Add to cart
  try {
    const addToCartResponse = await fetch("http://localhost:5000/api/cart", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        "x-auth-token": token,
      },
      body: JSON.stringify({
        productId: 1,
        quantity: 1,
        size: "36",
        color: "Red",
      }),
    });
    console.log("Add to cart status:", addToCartResponse.status);
    const addToCartData = await addToCartResponse.text();
    console.log("Add to cart response:", addToCartData);
  } catch (err) {
    console.error("Add to cart error:", err);
  }
};

testCartFunctionality();
