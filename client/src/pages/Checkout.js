import React, { useState } from "react";
import { useLocation, useNavigate } from "react-router-dom";
import axios from "../utils/api";

const Checkout = () => {
  const location = useLocation();
  const navigate = useNavigate();
  const { cartItems, totalPrice } = location.state || {};

  const [formData, setFormData] = useState({
    addressLine1: "",
    addressLine2: "",
    city: "",
    postcode: "",
    country: "",
    phoneNumber: "",
  });
  const [loading, setLoading] = useState(false);

  const handleInputChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handlePlaceOrder = async () => {
    try {
      setLoading(true);
      const token = localStorage.getItem("token");
      if (!token) {
        alert("You must log in to place an order.");
        navigate("/login");
        return;
      }

      const response = await axios.post(
        "/orders",
        { cartItems, totalPrice, shippingDetails: formData },
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      );

      // Redirect to PayMongo checkout
      window.location.href = response.data.checkoutUrl;
    } catch (error) {
      console.error("Error placing order:", error.response?.data || error.message);
      alert("Failed to place order. Please try again.");
    } finally {
      setLoading(false);
    }
  };

  if (!cartItems || cartItems.length === 0) {
    return <p className="text-center text-lg font-semibold">No items in your cart to checkout.</p>;
  }

  return (
    <div className="max-w-6xl mx-auto p-4">
      <h1 className="text-2xl font-bold text-center mb-6">Checkout</h1>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Shipping Details */}
        <div className="bg-white p-6 shadow-lg rounded-md">
          <h2 className="text-lg font-semibold mb-4">Shipping Details</h2>
          <form className="grid grid-cols-1 gap-4">
            <input
              type="text"
              name="addressLine1"
              placeholder="Address Line 1"
              value={formData.addressLine1}
              onChange={handleInputChange}
              className="border p-3 rounded w-full"
              required
            />
            <input
              type="text"
              name="addressLine2"
              placeholder="Address Line 2"
              value={formData.addressLine2}
              onChange={handleInputChange}
              className="border p-3 rounded w-full"
            />
            <input
              type="text"
              name="city"
              placeholder="City"
              value={formData.city}
              onChange={handleInputChange}
              className="border p-3 rounded w-full"
              required
            />
            <input
              type="text"
              name="postcode"
              placeholder="Postcode"
              value={formData.postcode}
              onChange={handleInputChange}
              className="border p-3 rounded w-full"
              required
            />
            <input
              type="text"
              name="country"
              placeholder="Country"
              value={formData.country}
              onChange={handleInputChange}
              className="border p-3 rounded w-full"
              required
            />
            <input
              type="text"
              name="phoneNumber"
              placeholder="Phone Number"
              value={formData.phoneNumber}
              onChange={handleInputChange}
              className="border p-3 rounded w-full"
              required
            />
          </form>
        </div>

        {/* Order Summary */}
        <div className="bg-white p-6 shadow-lg rounded-md">
          <h2 className="text-lg font-semibold mb-4">Order Summary</h2>
          <ul className="space-y-2 mb-4">
            {cartItems.map((item, index) => (
              <li key={index} className="text-sm">
                <strong>Gown:</strong> {item.gownId}, <strong>Price:</strong> ₱{item.price}, <strong>Start Date:</strong>{" "}
                {new Date(item.startDate).toLocaleDateString()}, <strong>End Date:</strong>{" "}
                {new Date(item.endDate).toLocaleDateString()}
              </li>
            ))}
          </ul>
          <h3 className="text-xl font-semibold">Total Price: ₱{totalPrice}</h3>
        </div>
      </div>

      <div className="mt-6 text-center">
        <button
          onClick={handlePlaceOrder}
          disabled={loading}
          className={`px-6 py-3 rounded-md text-white ${
            loading ? "bg-gray-500 cursor-not-allowed" : "bg-green-600 hover:bg-green-700"
          }`}
        >
          {loading ? "Processing..." : "Place Order"}
        </button>
      </div>
    </div>
  );
};

export default Checkout;
