import React, { useState, useEffect } from "react";
import { fetchOrders, deleteOrder, updateOrderStatus } from "../services/api";

const AdminBookings = () => {
  const [orders, setOrders] = useState([]);
  const [filter, setFilter] = useState(""); // Default: show all
  const [loading, setLoading] = useState(false); // Loading state
  const [error, setError] = useState(null); // Error state

  useEffect(() => {
    const loadOrders = async () => {
      setLoading(true);
      setError(null);
      try {
        const ordersData = await fetchOrders(filter);
        setOrders(ordersData);
      } catch (err) {
        setError("Failed to fetch bookings. Please try again later.");
        console.error("Error fetching orders:", err);
      } finally {
        setLoading(false);
      }
    };

    loadOrders();
  }, [filter]);

  const handleDelete = async (orderId) => {
    const confirmDelete = window.confirm("Are you sure you want to delete this order?");
    if (!confirmDelete) return;

    try {
      await deleteOrder(orderId);
      setOrders(orders.filter((order) => order._id !== orderId));
    } catch (err) {
      console.error("Error deleting order:", err);
      alert("Failed to delete the order. Please try again.");
    }
  };

  const handleStatusUpdate = async (orderId, newStatus) => {
    const confirmUpdate = window.confirm(
      `Are you sure you want to update the order status to "${newStatus}"?`
    );
    if (!confirmUpdate) return;

    try {
      await updateOrderStatus(orderId, newStatus);
      setOrders(
        orders.map((order) =>
          order._id === orderId ? { ...order, status: newStatus } : order
        )
      );
      alert("Order status updated.");
    } catch (err) {
      console.error("Error updating order status:", err);
      alert("Failed to update the order status. Please try again.");
    }
  };

  return (
    <div className="p-6">
      <h1 className="text-3xl font-bold mb-4">Bookings Management</h1>

      {/* Filter Buttons */}
      <div className="mb-4">
        <button
          onClick={() => setFilter("")}
          className={`btn px-4 py-2 mr-2 ${filter === "" ? "btn-primary" : "btn-outline"}`}
        >
          All
        </button>
        <button
          onClick={() => setFilter("Pending")}
          className={`btn px-4 py-2 mr-2 ${filter === "Pending" ? "btn-warning" : "btn-outline"}`}
        >
          Pending
        </button>
        <button
          onClick={() => setFilter("Completed")}
          className={`btn px-4 py-2 ${filter === "Completed" ? "btn-success" : "btn-outline"}`}
        >
          Completed
        </button>
      </div>

      {/* Error Message */}
      {error && <div className="text-red-500 mb-4">{error}</div>}

      {/* Loading Indicator */}
      {loading ? (
        <div className="text-center">Loading bookings...</div>
      ) : (
        <table className="min-w-full bg-white border">
          <thead>
            <tr>
              <th className="px-4 py-2 border">Booking ID</th>
              <th className="px-4 py-2 border">Client Email</th>
              <th className="px-4 py-2 border">Total Price</th>
              <th className="px-4 py-2 border">Status</th>
              <th className="px-4 py-2 border">Actions</th>
            </tr>
          </thead>
          <tbody>
            {orders.length > 0 ? (
              orders.map((order) => (
                <tr key={order._id}>
                  <td className="px-4 py-2 border">{order._id}</td>
                  <td className="px-4 py-2 border">{order.userId?.email || "No Email"}</td>
                  <td className="px-4 py-2 border">₱{order.totalPrice}</td>
                  <td className="px-4 py-2 border">{order.status}</td>
                  <td className="px-4 py-2 border">
                    <div className="flex space-x-2">
                      <button
                        onClick={() => handleStatusUpdate(order._id, "SUCCESS")}
                        className="bg-green-500 text-white px-2 py-1 rounded"
                      >
                        Mark as Paid
                      </button>
                      <button
                        onClick={() => handleStatusUpdate(order._id, "FAILED")}
                        className="bg-yellow-500 text-white px-2 py-1 rounded"
                      >
                        Mark as Failed
                      </button>
                      <button
                        onClick={() => handleDelete(order._id)}
                        className="bg-red-500 text-white px-2 py-1 rounded"
                      >
                        Delete
                      </button>
                    </div>
                  </td>
                </tr>
              ))
            ) : (
              <tr>
                <td colSpan="5" className="text-center py-4">
                  No bookings found.
                </td>
              </tr>
            )}
          </tbody>
        </table>
      )}
    </div>
  );
};

export default AdminBookings;
