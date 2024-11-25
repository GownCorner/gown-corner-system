import React, { useState, useEffect } from "react";
import axios from "../utils/api";
import { DateRangePicker } from "react-date-range";
import { useNavigate } from "react-router-dom";
import "./Collection.css";

const Collection = () => {
  const [gowns, setGowns] = useState([]);
  const [searchQuery, setSearchQuery] = useState("");
  const [selectedGown, setSelectedGown] = useState(null);
  const [availabilityModal, setAvailabilityModal] = useState(false);
  const [selectedDates, setSelectedDates] = useState([
    {
      startDate: new Date(),
      endDate: new Date(),
      key: "selection",
    },
  ]);
  const [availabilityMessage, setAvailabilityMessage] = useState("");
  const navigate = useNavigate();

  useEffect(() => {
    const fetchGowns = async () => {
      try {
        const { data } = await axios.get("/gowns"); // Directly destructure the response
        setGowns(data);
      } catch (error) {
        console.error("Error fetching gowns:", error);
      }
    };
    fetchGowns();
  }, []);

  const handleCheckAvailability = async () => {
    if (!selectedGown) return;

    const { startDate, endDate } = selectedDates[0];
    try {
      const { data } = await axios.post("/gowns/availability", {
        gownId: selectedGown._id,
        startDate,
        endDate,
      });

      setAvailabilityMessage(data.message);
    } catch (error) {
      console.error("Error checking availability:", error);
      setAvailabilityMessage(
        error.response?.data.message || "An error occurred while checking availability."
      );
    }
  };

  const handleAddToCart = async () => {
    const { startDate, endDate } = selectedDates[0];
    try {
      if (availabilityMessage === "Gown available") {
        const token = localStorage.getItem("token"); // Ensure the token is present
        if (!token) {
          alert("You need to log in to add items to your cart.");
          navigate("/login"); // Redirect to login page if not authenticated
          return;
        }

        await axios.post(
          "/cart/add",
          {
            gownId: selectedGown._id,
            startDate,
            endDate,
            price: selectedGown.price,
          },
          {
            headers: {
              Authorization: `Bearer ${token}`,
            },
          }
        );

        alert("Gown added to cart!");
        navigate("/cart"); // Navigate to cart page after adding
      }
    } catch (error) {
      console.error("Error adding to cart:", error);
      alert(
        error.response?.data.message || "An error occurred while adding the gown to the cart."
      );
    }
  };

  const filteredGowns = gowns.filter((gown) =>
    gown.name.toLowerCase().includes(searchQuery.toLowerCase())
  );

  return (
    <div className="collection">
      <h1>Our Collection</h1>
      <input
        type="text"
        placeholder="Search gowns..."
        value={searchQuery}
        onChange={(e) => setSearchQuery(e.target.value)}
        className="search-bar"
      />
      <div className="gown-list">
        {filteredGowns.length > 0 ? (
          filteredGowns.map((gown) => (
            <div key={gown._id} className="gown-card">
              <img src={gown.image} alt={gown.name} className="gown-image" />
              <h2>{gown.name}</h2>
              <p>Category: {gown.category}</p>
              <p>Price: ₱{gown.price}</p>
              <button
                onClick={() => {
                  setSelectedGown(gown);
                  setAvailabilityModal(true);
                }}
              >
                Check Availability
              </button>
            </div>
          ))
        ) : (
          <p>No gowns found.</p>
        )}
      </div>

      {availabilityModal && (
        <div className="modal-overlay">
          <div className="availability-modal">
            <h2>Check Availability for {selectedGown?.name}</h2>
            <DateRangePicker
              ranges={selectedDates}
              onChange={(item) => setSelectedDates([item.selection])}
              minDate={new Date()}
            />
            <button onClick={handleCheckAvailability}>Confirm Dates</button>
            {availabilityMessage && (
              <p
                className={`availability-message ${
                  availabilityMessage === "Gown available" ? "success" : "error"
                }`}
              >
                {availabilityMessage}
              </p>
            )}
            {availabilityMessage === "Gown available" && (
              <button onClick={handleAddToCart}>Add to Cart</button>
            )}
            <button onClick={() => setAvailabilityModal(false)}>Close</button>
          </div>
        </div>
      )}
    </div>
  );
};

export default Collection;
