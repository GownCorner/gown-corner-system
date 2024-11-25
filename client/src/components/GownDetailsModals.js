import React, { useState } from "react";

const GownDetailsModal = ({ gown, onClose }) => {
  const [selectedStartDate, setSelectedStartDate] = useState("");
  const [selectedEndDate, setSelectedEndDate] = useState("");

  const handleAddToCart = async () => {
    const token = localStorage.getItem("token");
    if (!token) {
      alert("Please log in to add items to the cart.");
      return;
    }

    try {
      const response = await fetch("http://localhost:5000/api/cart", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify({
          gownId: gown.id,
          startDate: selectedStartDate,
          endDate: selectedEndDate,
          price: gown.price,
        }),
      });

      if (!response.ok) {
        throw new Error("Failed to add item to cart");
      }

      const data = await response.json();
      alert(data.message || "Item added to cart!");
      onClose(); // Close the modal
    } catch (error) {
      console.error(error.message);
    }
  };

  return (
    <div>
      <h2>Check Availability for {gown.name}</h2>
      <label>
        Start Date:
        <input
          type="date"
          value={selectedStartDate}
          onChange={(e) => setSelectedStartDate(e.target.value)}
        />
      </label>
      <label>
        End Date:
        <input
          type="date"
          value={selectedEndDate}
          onChange={(e) => setSelectedEndDate(e.target.value)}
        />
      </label>
      <button onClick={handleAddToCart}>Add to Cart</button>
      <button onClick={onClose}>Close</button>
    </div>
  );
};

export default GownDetailsModal;
