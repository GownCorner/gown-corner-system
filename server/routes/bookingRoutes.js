const express = require("express");
const { getBookings, createBooking } = require("../controllers/bookingController");

const router = express.Router();

// Admin route to fetch bookings with optional status filter
router.get("/", getBookings);

// Route to create a booking
router.post("/", createBooking);

module.exports = router;
