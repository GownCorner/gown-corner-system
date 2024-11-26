const Booking = require("../models/Booking");
const Gown = require("../models/Gown");

// Create a booking
exports.createBooking = async (req, res) => {
  const { gownId, userId, pickupDate, returnDate, totalPrice } = req.body;

  try {
    // Ensure the gown exists
    const gown = await Gown.findById(gownId);
    if (!gown) {
      return res.status(404).json({ message: "Gown not found" });
    }

    // Create the booking
    const newBooking = new Booking({
      gownId,
      userId,
      pickupDate,
      returnDate,
      totalPrice,
    });

    await newBooking.save();
    res.status(201).json({ message: "Booking created successfully", booking: newBooking });
  } catch (error) {
    console.error("Error creating booking:", error.message);
    res.status(500).json({ message: "Error creating booking", error });
  }
};

// Get all bookings
exports.getBookings = async (req, res) => {
  try {
    const { paymentStatus } = req.query; // Optional query parameter
    const filter = paymentStatus ? { paymentStatus } : {}; // Filter by status if provided

    const bookings = await Booking.find(filter)
      .populate("userId", "email") // Populate user email
      .populate("gownId", "name"); // Populate gown name

    res.status(200).json(bookings);
  } catch (error) {
    console.error("Error fetching bookings:", error.message);
    res.status(500).json({ message: "Error fetching bookings", error });
  }
};


// Delete a booking
exports.deleteBooking = async (req, res) => {
  try {
    const { id } = req.params;
    const deletedBooking = await Booking.findByIdAndDelete(id);

    if (!deletedBooking) {
      return res.status(404).json({ message: "Booking not found" });
    }

    res.status(200).json({ message: "Booking deleted successfully" });
  } catch (error) {
    console.error("Error deleting booking:", error.message);
    res.status(500).json({ message: "Error deleting booking", error });
  }
};
