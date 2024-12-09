const express = require("express");
const mongoose = require("mongoose");
const dotenv = require("dotenv");
const cors = require("cors");
const cron = require("node-cron");
const { notifyPendingPayments } = require("./controllers/orderController");

// Load environment variables
dotenv.config();

// Initialize Express app
const app = express();

// Debug environment variables
if (process.env.NODE_ENV !== "production") {
  console.log("Environment Variables:");
  console.log("MONGO_URI:", process.env.MONGO_URI || "Not Found");
  console.log("JWT_SECRET:", process.env.JWT_SECRET || "Not Found");
  console.log("ALLOWED_ORIGINS:", process.env.ALLOWED_ORIGINS || "Not Found");
}

// Validate critical environment variables
if (!process.env.MONGO_URI || !process.env.JWT_SECRET) {
  console.error("Critical environment variables missing. Shutting down...");
  process.exit(1);
}

// CORS Configuration
const allowedOrigins = process.env.ALLOWED_ORIGINS?.split(",") || [
  "http://localhost:3000",
  "https://gown-booking-system-frontend.onrender.com",
];

app.use(
  cors({
    origin: (origin, callback) => {
      console.log("Incoming request origin:", origin); // Debug CORS
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

// Request Logger
app.use((req, res, next) => {
  console.log(`[${new Date().toISOString()}] ${req.method} ${req.url}`);
  next();
});

// MongoDB Connection
mongoose.set("strictQuery", false);
mongoose
  .connect(process.env.MONGO_URI, {
    useNewUrlParser: true,
    useUnifiedTopology: true,
  })
  .then(() => console.log("MongoDB Connected"))
  .catch((err) => {
    console.error("MongoDB Connection Error:", err.message);
    process.exit(1); // Exit on connection failure
  });

// Import Routes
const gownRoutes = require("./routes/gownRoutes");
const authRoutes = require("./routes/authRoutes");
const cartRoutes = require("./routes/cartRoutes");
const orderRoutes = require("./routes/orderRoutes");
const adminRoutes = require("./routes/adminRoutes");
const userRoutes = require("./routes/userRoutes");
const bookingRoutes = require("./routes/bookingRoutes");

// Use Routes
app.use("/api/auth", authRoutes);
app.use("/api/gowns", gownRoutes);
app.use("/api/cart", cartRoutes);
app.use("/api/orders", orderRoutes);
app.use("/api/admin", adminRoutes);
app.use("/api/users", userRoutes);
app.use("/api/bookings", bookingRoutes);

// Debug Endpoint
app.get("/api/debug", (req, res) => {
  res.json({ message: "Debug endpoint working!" });
});

// Default Root Route
app.get("/", (req, res) => {
  res.send("Welcome to the Gown Booking System Backend!");
});

// Default 404 Handler
app.use((req, res) => {
  console.error(`404 Error: ${req.method} ${req.url} not found`);
  res.status(404).json({ message: `Endpoint ${req.url} not found` });
});

// Global Error Handler
app.use((err, req, res, next) => {
  console.error("Server Error:", err.stack);
  res.status(500).json({ message: "Server Error", error: err.message });
});

// Graceful Shutdown
process.on("SIGINT", async () => {
  console.log("Shutting down server...");
  await mongoose.connection.close();
  process.exit(0);
});

// Cron Job for Pending Payments
if (process.env.NODE_ENV === "production") {
  cron.schedule("0 9 * * *", async () => {
    console.log("Running daily notification job...");
    try {
      await notifyPendingPayments();
      console.log("Daily notification job completed.");
    } catch (err) {
      console.error("Error in daily notification job:", err.message);
    }
  });
}

// Start the Server
const PORT = process.env.PORT || 5000;
app.listen(PORT, () => console.log(`Server running on port ${PORT}`));
