const express = require("express");
const mongoose = require("mongoose");
const dotenv = require("dotenv");
const cors = require("cors");

// Load environment variables
dotenv.config();

// Initialize Express app
const app = express();

// CORS Configuration
const allowedOrigins = process.env.ALLOWED_ORIGINS?.split(",") || [
  "http://localhost:3000",
  "https://gown-booking-system-frontend.onrender.com",
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
    credentials: true,
  })
);

// Middleware
app.use(express.json());

// MongoDB Connection
mongoose
  .connect(process.env.MONGO_URI, { useNewUrlParser: true, useUnifiedTopology: true })
  .then(() => console.log("MongoDB Connected"))
  .catch((err) => {
    console.error("MongoDB Connection Error:", err.message);
    process.exit(1);
  });

// Route Imports
const gownRoutes = require("./routes/gownRoutes");
const authRoutes = require("./routes/authRoutes");

// Use Routes
app.use("/api/auth", authRoutes);
app.use("/api/gowns", gownRoutes);

// Default Route
app.get("/", (req, res) => {
  res.send("Welcome to the Gown Booking System Backend!");
});

// Default 404 Route
app.use((req, res) => {
  res.status(404).json({ message: "Endpoint not found" });
});

// Start the server
const PORT = process.env.PORT || 5000;
app.listen(PORT, () => console.log(`Server running on port ${PORT}`));
