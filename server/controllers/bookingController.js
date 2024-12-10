const Booking = require("../models/Booking");
const Gown = require("../models/Gown");
const sendEmail = require("../utils/sendEmail");

// Create a booking
exports.createBooking = async (req, res) => {
  const { gownId, userId, pickupDate, returnDate, totalPrice } = req.body;

  try {
    const gown = await Gown.findById(gownId);
    if (!gown) {
      return res.status(404).json({ message: "Gown not found" });
    }

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
    const { paymentStatus } = req.query;
    const filter = paymentStatus ? { paymentStatus } : {};

    const bookings = await Booking.find(filter)
      .populate("userId", "email")
      .populate("gownId", "name");

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

// Update booking status and send email
exports.updateBookingStatus = async (req, res) => {
  const { id } = req.params;
  const { status } = req.body;

  try {
    const booking = await Booking.findById(id).populate("userId", "email");

    if (!booking) {
      return res.status(404).json({ message: "Booking not found" });
    }

    booking.paymentStatus = status;
    await booking.save();

    // Send email notification
    const clientEmail = booking.userId.email;
    const subject = "Booking Status Update";
    const message = `Dear Customer, your booking with ID ${booking._id} has been updated to: ${status}.`;

    try {
      await sendEmail(clientEmail, subject, message);
    } catch (emailError) {
      console.error("Error sending email:", emailError.message);
      return res.status(200).json({
        message: "Booking status updated, but email notification failed.",
      });
    }

    res.status(200).json({ message: "Booking status updated and email sent." });
  } catch (error) {
    console.error("Error updating booking status:", error.message);
    res.status(500).json({ message: "Failed to update booking status.", error });
  }
};
