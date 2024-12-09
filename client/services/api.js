import axios from "axios";

// Use REACT_APP_API_BASE_URL from environment variables or fallback to localhost
export const url = process.env.REACT_APP_API_BASE_URL || "https://gown-booking-system.onrender.com/api";

// Create Axios instance with base URL
const api = axios.create({
  baseURL: url,
  headers: {
    "Content-Type": "application/json",
  },
});

// Intercept request to include Authorization header if token exists
api.interceptors.request.use(
  (config) => {
    const token = localStorage.getItem("token");
    if (token) {
      config.headers.Authorization = `Bearer ${token}`;
    }
    console.log("Outgoing Request:", {
      url: config.url,
      method: config.method,
      headers: config.headers,
      data: config.data,
    }); // Debug log
    return config;
  },
  (error) => {
    console.error("Request Error:", error.message);
    return Promise.reject(error);
  }
);

// Intercept responses
api.interceptors.response.use(
  (response) => {
    console.log("Incoming Response:", {
      status: response.status,
      data: response.data,
      headers: response.headers,
    }); // Debug log
    return response;
  },
  (error) => {
    if (error.response && error.response.status === 401) {
      console.error("Unauthorized - Redirecting to login...");
      localStorage.removeItem("token");
      window.location.href = "/login"; // Redirect to login
    }
    console.error("Response Error:", {
      message: error.message,
      response: error.response ? error.response.data : "No response data",
    });
    return Promise.reject(error);
  }
);

// Utility function to fetch all bookings (admin view)
export const fetchBookings = async () => {
  try {
    const response = await api.get("/bookings");
    return response.data;
  } catch (error) {
    console.error("Error fetching bookings:", error.response?.data || error.message);
    throw error;
  }
};

// Utility function to delete a booking by ID
export const deleteBooking = async (bookingId) => {
  try {
    const response = await api.delete(`/bookings/${bookingId}`);
    return response.data;
  } catch (error) {
    console.error("Error deleting booking:", error.response?.data || error.message);
    throw error;
  }
};

// Utility function to fetch all gowns
export const fetchGowns = async () => {
  try {
    const response = await api.get("/gowns");
    return response.data;
  } catch (error) {
    console.error("Error fetching gowns:", error.response?.data || error.message);
    throw error;
  }
};

// Utility function to add a gown to the cart
export const addToCart = async (gownId, startDate, endDate, price) => {
  try {
    const token = localStorage.getItem("token");
    if (!token) {
      throw new Error("Unauthorized. Please log in.");
    }
    const response = await api.post(
      "/cart/add",
      { gownId, startDate, endDate, price },
      {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      }
    );
    return response.data;
  } catch (error) {
    console.error("Error adding to cart:", error.response?.data || error.message);
    throw error;
  }
};

// Export the consolidated Axios instance
export default api;
