import React, { useState } from "react";
import axios from "../utils/api";

const Booking = () => {
  const [gownId, setGownId] = useState("");
  const [pickupDate, setPickupDate] = useState("");
  const [returnDate, setReturnDate] = useState("");
  const [message, setMessage] = useState("");

  const handleBooking = async (e) => {
    e.preventDefault();
    try {
      const response = await axios.post("/bookings", {
        gownId,
        pickupDate,
        returnDate,
      });
      setMessage(response.data.message);
    } catch (error) {
      setMessage("Error: " + error.response.data.message);
    }
  };

  return (
    <div>
      <h1>Book a Gown</h1>
      <form onSubmit={handleBooking}>
        <div>
          <input
            type="text"
            placeholder="Gown ID"
            value={gownId}
            onChange={(e) => setGownId(e.target.value)}
          />
        </div>
        <div>
          <input
            type="date"
            placeholder="Pickup Date"
            value={pickupDate}
            onChange={(e) => setPickupDate(e.target.value)}
          />
        </div>
        <div>
          <input
            type="date"
            placeholder="Return Date"
            value={returnDate}
            onChange={(e) => setReturnDate(e.target.value)}
          />
        </div>
        <button type="submit">Confirm Booking</button>
      </form>
      {message && <p>{message}</p>}
    </div>
  );
};

export default Booking;
