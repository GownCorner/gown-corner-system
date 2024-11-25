const express = require("express");
const mongoose = require("mongoose");
const dotenv = require("dotenv");
const cors = require("cors");

// Load environment variables
dotenv.config();

// Debug environment variables
console.log("MONGO_URI:", process.env.MONGO_URI || "Not Found");
console.log("JWT_SECRET:", process.env.JWT_SECRET || "Not Found");
console.log("PayMongo Secret Key:", process.env.PAYMONGO_SECRET_KEY || "Not Found");

// Initialize Express app
const app = express();

// Middleware
app.use(cors({
  origin: "http://localhost:3000", // Frontend URL
  credentials: true,
}));
app.use(express.json()); // Parse JSON requests

// MongoDB connection
mongoose
  .connect(process.env.MONGO_URI, { useNewUrlParser: true, useUnifiedTopology: true })
  .then(() => console.log("MongoDB Connected"))
  .catch((err) => {
    console.error("MongoDB Connection Error:", err.message);
    process.exit(1); // Exit if MongoDB connection fails
  });

// Route imports
const gownRoutes = require("./routes/gownRoutes");
const authRoutes = require("./routes/authRoutes");
const cartRoutes = require("./routes/cartRoutes");
const orderRoutes = require("./routes/orderRoutes");

// Use routes
app.use("/api/auth", authRoutes);
app.use("/api/gowns", gownRoutes);
app.use("/api/cart", cartRoutes);
app.use("/api/orders", orderRoutes);

// Default 404 handler
app.use((req, res) => {
  res.status(404).json({ message: "Endpoint not found" });
});

// Global error handler
app.use((err, req, res, next) => {
  console.error("Server Error:", err.stack);
  res.status(500).json({ message: "Server Error", error: err.message });
});

// Start the server
const PORT = process.env.PORT || 5000;
app.listen(PORT, () => console.log(`Server running on port ${PORT}`));
