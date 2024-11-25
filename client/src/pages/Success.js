import React, { useEffect, useState } from "react";
import { useLocation } from "react-router-dom";
import axios from "../utils/api";

const Success = () => {
  const location = useLocation();
  const [order, setOrder] = useState(null);
  const [loading, setLoading] = useState(true);

  // Extract the orderId from the URL query parameters
  const orderId = new URLSearchParams(location.search).get("orderId");

  useEffect(() => {
    const fetchOrder = async () => {
      try {
        if (!orderId) throw new Error("Order ID is missing!");

        const token = localStorage.getItem("token");
        const response = await axios.get(`/orders/${orderId}`, {
          headers: { Authorization: `Bearer ${token}` },
        });
        setOrder(response.data);
        setLoading(false);
      } catch (error) {
        console.error("Error fetching order details:", error.message);
        setLoading(false);
      }
    };

    fetchOrder();
  }, [orderId]);

  if (loading) return <p>Loading...</p>;
  if (!order) return <p>Order not found.</p>;

  return (
    <div>
      <h1>Payment Successful!</h1>
      <p>Thank you for your payment. Your order details are as follows:</p>
      <ul>
        {order.items.map((item, index) => (
          <li key={index}>
            Gown ID: {item.gownId}, Price: ₱{item.price}, Rental Period:{" "}
            {new Date(item.startDate).toLocaleDateString()} -{" "}
            {new Date(item.endDate).toLocaleDateString()}
          </li>
        ))}
      </ul>
      <h3>Total Price: ₱{order.totalPrice}</h3>
      <p>Shipping to: {order.shippingDetails.addressLine1}, {order.shippingDetails.city}</p>
    </div>
  );
};

export default Success;
