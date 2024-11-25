const Booking = require("../models/Booking");

exports.getAllBookings = async (req, res) => {
    try {
        const bookings = await Booking.find().populate("userId", "email"); // Include user emails
        res.status(200).json(bookings);
    } catch (error) {
        res.status(500).json({ message: "Failed to fetch bookings", error });
    }
};

exports.editBooking = async (req, res) => {
    try {
        const { id } = req.params;
        const updatedBooking = await Booking.findByIdAndUpdate(id, req.body, {
            new: true,
        });
        res.status(200).json(updatedBooking);
    } catch (error) {
        res.status(500).json({ message: "Failed to update booking", error });
    }
};

exports.deleteBooking = async (req, res) => {
    try {
        const { id } = req.params;
        await Booking.findByIdAndDelete(id);
        res.status(200).json({ message: "Booking deleted successfully" });
    } catch (error) {
        res.status(500).json({ message: "Failed to delete booking", error });
    }
};
