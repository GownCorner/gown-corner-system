const mongoose = require("mongoose");

const BookingSchema = new mongoose.Schema(
  {
    userId: { type: mongoose.Schema.Types.ObjectId, ref: "User", required: true },
    gownId: { type: mongoose.Schema.Types.ObjectId, ref: "Gown", required: true },
    startDate: { type: Date, required: true },
    endDate: { type: Date, required: true },
    totalPrice: { type: Number, required: true },
    paymentStatus: { 
      type: String, 
      enum: ["PENDING", "SUCCESS", "FAILED"], 
      default: "PENDING" 
    },
  },
  { timestamps: true }
);

module.exports = mongoose.model("Booking", BookingSchema, "bookings"); // Explicitly use "bookings" collection
