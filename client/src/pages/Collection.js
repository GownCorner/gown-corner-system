import React, { useState, useEffect } from "react";
import axios from "../utils/api";
import { DateRangePicker } from "react-date-range";
import { useNavigate } from "react-router-dom";
import "./calendarOverride.css";

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
        const { data } = await axios.get("/gowns");
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
        const token = localStorage.getItem("token");
        if (!token) {
          alert("You need to log in to add items to your cart.");
          navigate("/login");
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
        navigate("/cart");
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
    <div className="p-6">
      <h1 className="text-3xl font-bold mb-6">Our Collection</h1>
      <input
        type="text"
        placeholder="Search gowns..."
        value={searchQuery}
        onChange={(e) => setSearchQuery(e.target.value)}
        className="mb-4 w-full p-2 border rounded shadow-sm"
      />
      <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6">
        {filteredGowns.length > 0 ? (
          filteredGowns.map((gown) => (
            <div key={gown._id} className="border rounded-lg p-4 shadow-sm">
              <img src={gown.image} alt={gown.name} className="w-full h-48 object-cover mb-4 rounded" />
              <h2 className="text-xl font-semibold">{gown.name}</h2>
              <p className="text-gray-600">Category: {gown.category}</p>
              <p className="text-gray-600">Price: ₱{gown.price}</p>
              <button
                onClick={() => {
                  setSelectedGown(gown);
                  setAvailabilityModal(true);
                }}
                className="mt-4 bg-blue-500 text-white py-2 px-4 rounded hover:bg-blue-600"
              >
                Check Availability
              </button>
            </div>
          ))
        ) : (
          <p className="text-gray-500">No gowns found.</p>
        )}
      </div>

      {availabilityModal && (
        <div className="fixed inset-0 bg-gray-800 bg-opacity-50 flex justify-center items-center z-50">
          <div className="bg-white rounded-lg shadow-lg p-6 w-full max-w-lg">
            <h2 className="text-2xl font-bold mb-4">Check Availability for {selectedGown?.name}</h2>
            <DateRangePicker
              ranges={selectedDates}
              onChange={(item) => setSelectedDates([item.selection])}
              minDate={new Date()}
            />
            <button
              onClick={handleCheckAvailability}
              className="mt-4 bg-green-500 text-white py-2 px-4 rounded hover:bg-green-600"
            >
              Confirm Dates
            </button>
            {availabilityMessage && (
              <p
                className={`mt-4 font-medium ${
                  availabilityMessage === "Gown available" ? "text-green-500" : "text-red-500"
                }`}
              >
                {availabilityMessage}
              </p>
            )}
            {availabilityMessage === "Gown available" && (
              <button
                onClick={handleAddToCart}
                className="mt-2 bg-blue-500 text-white py-2 px-4 rounded hover:bg-blue-600"
              >
                Add to Cart
              </button>
            )}
            <button
              onClick={() => setAvailabilityModal(false)}
              className="mt-4 bg-gray-500 text-white py-2 px-4 rounded hover:bg-gray-600"
            >
              Close
            </button>
          </div>
        </div>
      )}
    </div>
  );
};

export default Collection;
