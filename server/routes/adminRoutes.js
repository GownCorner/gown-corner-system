const express = require("express");
const router = express.Router();
const { isAdmin } = require("../middleware/adminMiddleware");
const {
    getAllBookings,
    editBooking,
    deleteBooking,
} = require("../controllers/adminController");

// Admin routes
router.get("/bookings", isAdmin, getAllBookings); // Fetch all bookings
router.put("/booking/:id", isAdmin, editBooking); // Edit booking
router.delete("/booking/:id", isAdmin, deleteBooking); // Delete booking

module.exports = router;
