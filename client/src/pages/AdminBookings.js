import React, { useEffect, useState } from "react";
import axios from "../services/api";

const AdminBookings = () => {
  const [bookings, setBookings] = useState([]);

  useEffect(() => {
    const fetchBookings = async () => {
      try {
        const response = await axios.get("/bookings");
        setBookings(response.data);
      } catch (error) {
        console.error("Error fetching bookings:", error);
      }
    };
    fetchBookings();
  }, []);

  return (
    <div className="p-6">
      <h1 className="text-3xl font-bold mb-4">Bookings Management</h1>
      <table className="min-w-full bg-white border">
        <thead>
          <tr>
            <th className="px-4 py-2 border">Booking ID</th>
            <th className="px-4 py-2 border">Client Email</th>
            <th className="px-4 py-2 border">Status</th>
            <th className="px-4 py-2 border">Actions</th>
          </tr>
        </thead>
        <tbody>
          {bookings.map((booking) => (
            <tr key={booking._id}>
              <td className="px-4 py-2 border">{booking._id}</td>
              <td className="px-4 py-2 border">{booking.clientEmail}</td>
              <td className="px-4 py-2 border">{booking.status}</td>
              <td className="px-4 py-2 border">
                <button className="bg-yellow-400 px-2 py-1 rounded">Edit</button>
                <button className="bg-red-500 px-2 py-1 rounded text-white ml-2">Delete</button>
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
};

export default AdminBookings;
