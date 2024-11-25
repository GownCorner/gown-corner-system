import axios from "axios";

// Create an Axios instance with a base URL
const API = axios.create({
  baseURL: "http://localhost:5000/api", // Adjust base URL if necessary
  headers: {
    "Content-Type": "application/json", // Default content type
  },
});

// Add a request interceptor to include the token automatically
API.interceptors.request.use(
  (config) => {
    const token = localStorage.getItem("token"); // Retrieve token from localStorage
    if (token) {
      config.headers.Authorization = `Bearer ${token}`; // Add Authorization header
    }
    return config;
  },
  (error) => {
    return Promise.reject(error); // Pass through request errors
  }
);

// Add a response interceptor to handle errors globally
API.interceptors.response.use(
  (response) => response, // Return successful responses
  (error) => {
    // Handle 401 Unauthorized errors
    if (error.response && error.response.status === 401) {
      console.error("Unauthorized - Redirecting to login...");
      localStorage.removeItem("token"); // Remove invalid token
      window.location.href = "/login"; // Redirect to login
    }
    return Promise.reject(error); // Pass through other errors
  }
);

// Authentication APIs
export const registerUser = async (userData) => {
  return await API.post("/auth/register", userData);
};

export const loginUser = async (userData) => {
  return await API.post("/auth/login", userData);
};

// Gown APIs
export const fetchGowns = async () => {
  return await API.get("/gowns");
};

// Order APIs
export const createOrder = async (orderData) => {
  return await API.post("/orders", orderData);
};

// Booking APIs
export const createBooking = async (bookingData) => {
  return await API.post("/bookings", bookingData);
};

export const getUserBookings = async (userId) => {
  return await API.get(`/bookings/user/${userId}`);
};

// Admin APIs
export const getAllBookings = async () => {
  return await API.get("/admin/bookings");
};

export const updateBookingStatus = async (bookingId, status) => {
  return await API.put(`/admin/bookings/${bookingId}`, { status });
};

export const getAllUsers = async () => {
  return await API.get("/admin/users");
};

export const deleteUser = async (userId) => {
  return await API.delete(`/admin/users/${userId}`);
};

export const getAllInventory = async () => {
  return await API.get("/admin/inventory");
};

export const updateInventory = async (inventoryId, inventoryData) => {
  return await API.put(`/admin/inventory/${inventoryId}`, inventoryData);
};

export const deleteInventoryItem = async (inventoryId) => {
  return await API.delete(`/admin/inventory/${inventoryId}`);
};

// Export Axios instance
export default API;
