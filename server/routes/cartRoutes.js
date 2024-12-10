const express = require("express");
const { addToCart, getCart, removeFromCart } = require("../controllers/cartController");
const authMiddleware = require("../middleware/authMiddleware");

const router = express.Router();

// Route to add an item to the cart
router.post("/add", authMiddleware, addToCart);

// Route to get the user's cart
router.get("/", authMiddleware, getCart);

// Route to remove an item from the cart
router.delete("/:gownId", authMiddleware, removeFromCart);

module.exports = router;
