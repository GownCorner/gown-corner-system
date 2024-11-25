const express = require("express");
const jwt = require("jsonwebtoken");
const User = require("../models/User");
const {
  registerUser,
  loginUser,
  getCurrentUser,
} = require("../controllers/authController");
const authMiddleware = require("../middleware/authMiddleware"); // Middleware for token verification
const router = express.Router();

// Login User (Using Controller Logic)
router.post("/login", loginUser);

// Register User (Using Controller Logic)
router.post("/register", registerUser);

// Get Current User Info (Protected Route)
router.get("/me", authMiddleware, async (req, res) => {
  try {
    // Fetch user by ID from decoded token
    const user = await User.findById(req.user.id).select("-password"); // Exclude password
    if (!user) {
      return res.status(404).json({ message: "User not found" });
    }
    res.status(200).json(user); // Respond with user data
  } catch (error) {
    console.error("Error fetching user info:", error.message);
    res.status(500).json({ message: "Server error", error: error.message });
  }
});

module.exports = router;
