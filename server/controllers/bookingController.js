const Booking = require("../models/Booking");
const Gown = require("../models/Gown");

// Create a booking
exports.createBooking = async (req, res) => {
  const { gownId, pickupDate, returnDate } = req.body;
  try {
    const gown = await Gown.findById(gownId);
    if (!gown) return res.status(404).json({ message: "Gown not found" });

    const newBooking = new Booking({
      gownId,
      pickupDate,
      returnDate,
    });

    await newBooking.save();
    res.status(201).json({ message: "Booking successful", booking: newBooking });
  } catch (error) {
    res.status(500).json({ message: "Error creating booking", error });
  }
};

// Get all bookings
exports.getBookings = async (req, res) => {
  try {
    const bookings = await Booking.find();
    res.status(200).json(bookings);
  } catch (error) {
    res.status(500).json({ message: "Error fetching bookings", error });
  }
};
