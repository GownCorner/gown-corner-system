const express = require("express");
const mongoose = require("mongoose");
const dotenv = require("dotenv");
const cors = require("cors");
const cron = require("node-cron");
const compression = require("compression");
const morgan = require("morgan");
const { notifyPendingPayments } = require("./controllers/orderController");

// Load environment variables
dotenv.config();

// Validate critical environment variables
if (!process.env.MONGO_URI || !process.env.JWT_SECRET || !process.env.PAYMONGO_SECRET_KEY) {
  console.error("Critical environment variables are missing. Shutting down...");
  process.exit(1);
}

// Initialize Express app
const app = express();

// Debug environment variables (for development only)
if (process.env.NODE_ENV !== "production") {
  console.log("MONGO_URI:", process.env.MONGO_URI || "Not Found");
  console.log("JWT_SECRET:", process.env.JWT_SECRET || "Not Found");
  console.log("PayMongo Secret Key:", process.env.PAYMONGO_SECRET_KEY || "Not Found");
}

// CORS Configuration
const allowedOrigins = process.env.ALLOWED_ORIGINS?.split(",") || [
  "http://localhost:3000",
  "https://gown-booking-system-frontend1.onrender.com",
];

app.use(
  cors({
    origin: (origin, callback) => {
      if (!origin || allowedOrigins.includes(origin)) {
        callback(null, true);
      } else {
        console.error(`Blocked by CORS: ${origin}`);
        callback(new Error("Not allowed by CORS"));
      }
    },
    credentials: true, // Allow cookies and credentials
  })
);

// Middleware
app.use(express.json()); // Parse JSON requests
app.use(compression()); // Enable response compression
if (process.env.NODE_ENV !== "production") {
  app.use(morgan("dev")); // Log requests in development
}

// Webhook-specific middleware
app.use(
  "/api/webhooks",
  express.raw({ type: "application/json" }),
  (err, req, res, next) => {
    if (err) {
      console.error("Error parsing webhook payload:", err.message);
      return res.status(400).send("Invalid payload");
    }
    next();
  }
);

// MongoDB Connection
mongoose
  .connect(process.env.MONGO_URI, {
    useNewUrlParser: true,
    useUnifiedTopology: true,
  })
  .then(() => console.log("MongoDB Connected"))
  .catch((err) => {
    console.error("MongoDB Connection Error:", err.message);
    process.exit(1);
  });

// Route Imports
const gownRoutes = require("./routes/gownRoutes");
const authRoutes = require("./routes/authRoutes");
const cartRoutes = require("./routes/cartRoutes");
const orderRoutes = require("./routes/orderRoutes");
const adminRoutes = require("./routes/adminRoutes");
const userRoutes = require("./routes/userRoutes");
const bookingRoutes = require("./routes/bookingRoutes");
const webhookRoutes = require("./routes/webhookRoutes");

// Schedule daily email notifications
cron.schedule("0 9 * * *", async () => {
  console.log("Running daily notification job...");
  try {
    await notifyPendingPayments();
    console.log("Daily notification job completed.");
  } catch (err) {
    console.error("Error in daily notification job:", err.message);
  }
});

// Use Routes
app.use("/api/auth", authRoutes);
app.use("/api/gowns", gownRoutes);
app.use("/api/cart", cartRoutes);
app.use("/api/orders", orderRoutes);
app.use("/api/admin", adminRoutes);
app.use("/api/users", userRoutes);
app.use("/api/bookings", bookingRoutes);
app.use("/api/webhooks", webhookRoutes);

// Default 404 handler
app.use((req, res) => {
  console.error(`404 Error: ${req.method} ${req.url} not found`);
  res.status(404).json({ message: `Endpoint ${req.url} not found` });
});

// Global error handler
app.use((err, req, res, next) => {
  console.error("Server Error:", err.stack);
  res.status(err.status || 500).json({ message: err.message || "Server Error" });
});

// Graceful shutdown
process.on("SIGINT", async () => {
  console.log("Shutting down server...");
  await mongoose.connection.close();
  process.exit(0);
});

process.on("SIGTERM", async () => {
  console.log("SIGTERM received. Shutting down gracefully...");
  await mongoose.connection.close();
  process.exit(0);
});

// Start the Server
const PORT = process.env.PORT || 5000;
app.listen(PORT, () => console.log(`Server running on port ${PORT}`));
