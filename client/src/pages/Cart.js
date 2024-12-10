import React, { useEffect, useState } from "react";
import axios from "../utils/api";
import { useNavigate } from "react-router-dom";

const Cart = () => {
  const [cartItems, setCartItems] = useState([]);
  const [totalPrice, setTotalPrice] = useState(0);
  const navigate = useNavigate();

  useEffect(() => {
    const fetchCart = async () => {
      try {
        const token = localStorage.getItem("token");
        console.log("Token fetched:", token); // Debug

        if (!token) {
          alert("Please log in to view your cart.");
          navigate("/login");
          return;
        }

        const response = await axios.get("/cart", {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        });

        console.log("Cart Response:", response.data); // Debug
        setCartItems(response.data.cartItems);
        setTotalPrice(response.data.totalPrice);
      } catch (error) {
        console.error("Error fetching cart:", error);
        if (error.response && error.response.status === 401) {
          alert("Session expired. Please log in again.");
          navigate("/login");
        }
      }
    };

    fetchCart();
  }, [navigate]);

  const handleCheckout = () => {
    if (cartItems.length === 0) {
      alert("Your cart is empty!");
      return;
    }

    console.log("Navigating to checkout with:", { cartItems, totalPrice }); // Debug
    navigate("/checkout", { state: { cartItems, totalPrice } });
  };

  return (
    <div>
      <h1>Your Cart</h1>
      {cartItems.length > 0 ? (
        <ul>
          {cartItems.map((item, index) => (
            <li key={index}>
              Gown ID: {item.gownId}, Price: ₱{item.price}, Start Date:{" "}
              {new Date(item.startDate).toISOString()}, End Date:{" "}
              {new Date(item.endDate).toISOString()}
            </li>
          ))}
        </ul>
      ) : (
        <p>Your cart is empty!</p>
      )}
      <h2>Total Price: ₱{totalPrice}</h2>
      <button onClick={handleCheckout}>Proceed to Checkout</button>
    </div>
  );
};

export default Cart;
