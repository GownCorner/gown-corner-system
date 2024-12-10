const express = require("express");
const {
  getBookings, // Adjusted to align with fetching orders
  updateBookingStatus,
  deleteBooking,
} = require("../controllers/bookingController"); // Use bookingController

const router = express.Router();

// Route to fetch all orders (with optional status filter)
router.get("/", getBookings);

// Route to update order status
router.put("/:id/status", updateBookingStatus);

// Route to delete an order
router.delete("/:id", deleteBooking);

module.exports = router;
