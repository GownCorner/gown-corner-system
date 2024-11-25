const express = require("express");
const router = express.Router();
const authMiddleware = require("../middleware/authMiddleware");
const { createOrder } = require("../controllers/orderController"); // Import from controller

// Route to create an order and integrate with PayMongo
router.post("/", authMiddleware, createOrder);

module.exports = router;
