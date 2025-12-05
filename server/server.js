const express = require("express");
const cors = require("cors");
const dotenv = require("dotenv");
const path = require("path");
const db = require("./config/db");

dotenv.config();

const app = express();

// Middleware
app.use(cors());
app.use(express.json());

// JSON parsing error handler
app.use((err, req, res, next) => {
  if (err instanceof SyntaxError && err.status === 400 && "body" in err) {
    console.error("JSON Parse Error:", err.message);
    return res.status(400).json({
      success: false,
      error:
        "Invalid JSON format. Please ensure your request body uses double quotes for strings and is valid JSON.",
      details: err.message,
    });
  }
  next(err);
});

// Routes
app.use("/api/users", require("./routes/users"));
app.use("/api/products", require("./routes/products"));
app.use("/api/orders", require("./routes/orders"));
app.use("/api/reviews", require("./routes/reviews"));
app.use("/api/wishlist", require("./routes/wishlist"));
app.use("/api/admin", require("./routes/admin"));
app.use("/api/coupons", require("./routes/coupons"));
app.use("/api/payment", require("./routes/payment"));
app.use("/api/cart", require("./routes/cart"));

// Serve static files from the React app in production
if (process.env.NODE_ENV === "production") {
  app.use(express.static(path.join(__dirname, "../client/dist")));

  // Handle React routing, return all requests to React app
  app.get("*", (req, res) => {
    res.sendFile(path.join(__dirname, "../client/dist", "index.html"));
  });
}

// Test DB Connection
db.query("SELECT 1")
  .then(() => console.log("MySQL Database Connected"))
  .catch((err) => console.log("Database Connection Failed:", err));

const PORT = process.env.PORT || 5000;

app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});
