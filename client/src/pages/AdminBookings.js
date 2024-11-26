import React, { useEffect, useState } from "react";
import { fetchBookings, deleteBooking } from "../services/api";

const AdminBookings = () => {
  const [bookings, setBookings] = useState([]);

  useEffect(() => {
    const fetchAllBookings = async () => {
      try {
        const data = await fetchBookings();
        setBookings(data);
      } catch (error) {
        console.error("Error fetching bookings:", error.message);
      }
    };

    fetchAllBookings();
  }, []);

  const handleDelete = async (bookingId) => {
    try {
      await deleteBooking(bookingId);
      setBookings(bookings.filter((booking) => booking._id !== bookingId));
      console.log("Booking deleted successfully.");
    } catch (error) {
      console.error("Error deleting booking:", error.message);
    }
  };

  return (
    <div className="p-6">
      <h1 className="text-3xl font-bold mb-4">Bookings Management</h1>
      <table className="min-w-full bg-white border">
        <thead>
          <tr>
            <th className="px-4 py-2 border">Booking ID</th>
            <th className="px-4 py-2 border">Client Email</th>
            <th className="px-4 py-2 border">Gown Name</th>
            <th className="px-4 py-2 border">Pickup Date</th>
            <th className="px-4 py-2 border">Return Date</th>
            <th className="px-4 py-2 border">Total Price</th>
            <th className="px-4 py-2 border">Actions</th>
          </tr>
        </thead>
        <tbody>
          {bookings.map((booking) => (
            <tr key={booking._id}>
              <td className="px-4 py-2 border">{booking._id}</td>
              <td className="px-4 py-2 border">{booking.userId?.email}</td>
              <td className="px-4 py-2 border">{booking.gownId?.name}</td>
              <td className="px-4 py-2 border">{new Date(booking.pickupDate).toLocaleDateString()}</td>
              <td className="px-4 py-2 border">{new Date(booking.returnDate).toLocaleDateString()}</td>
              <td className="px-4 py-2 border">{booking.totalPrice}</td>
              <td className="px-4 py-2 border">
                <button
                  onClick={() => handleDelete(booking._id)}
                  className="bg-red-500 px-2 py-1 rounded text-white"
                >
                  Delete
                </button>
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
};

export default AdminBookings;
