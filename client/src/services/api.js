import axios from "axios";

// Create Axios instance
const API = axios.create({
  baseURL: "http://localhost:5000/api", // Backend base URL
  headers: {
    "Content-Type": "application/json",
  },
});

// Include authorization token in requests
API.interceptors.request.use(
  (config) => {
    const token = localStorage.getItem("token");
    if (token) {
      config.headers.Authorization = `Bearer ${token}`;
    }
    return config;
  },
  (error) => Promise.reject(error)
);

// Handle unauthorized responses
API.interceptors.response.use(
  (response) => response,
  (error) => {
    if (error.response && error.response.status === 401) {
      console.error("Unauthorized - Redirecting to login...");
      localStorage.removeItem("token");
      window.location.href = "/login";
    }
    return Promise.reject(error);
  }
);

////////////////////
// Gowns API
////////////////////

export const fetchGowns = async () => {
  try {
    const response = await API.get("/gowns");
    return response.data;
  } catch (error) {
    console.error("Error fetching gowns:", error.response?.data || error.message);
    throw error;
  }
};

export const addGown = async (gownData) => {
  try {
    const response = await API.post("/gowns", gownData);
    return response.data;
  } catch (error) {
    console.error("Error adding gown:", error.response?.data || error.message);
    throw error;
  }
};

export const editGown = async (gownId, updatedData) => {
  try {
    const response = await API.put(`/gowns/${gownId}`, updatedData);
    return response.data;
  } catch (error) {
    console.error("Error updating gown:", error.response?.data || error.message);
    throw error;
  }
};

export const deleteGown = async (gownId) => {
  try {
    const response = await API.delete(`/gowns/${gownId}`);
    return response.data;
  } catch (error) {
    console.error("Error deleting gown:", error.response?.data || error.message);
    throw error;
  }
};

////////////////////
// Users API
////////////////////

export const getAllUsers = async () => {
  try {
    const response = await API.get("/users");
    return response.data;
  } catch (error) {
    console.error("Error fetching users:", error.response?.data || error.message);
    throw error;
  }
};

export const editUser = async (userId, updatedData) => {
  try {
    const response = await API.put(`/users/${userId}`, updatedData);
    return response.data;
  } catch (error) {
    console.error("Error updating user:", error.response?.data || error.message);
    throw error;
  }
};

export const deleteUser = async (userId) => {
  try {
    const response = await API.delete(`/users/${userId}`);
    return response.data;
  } catch (error) {
    console.error("Error deleting user:", error.response?.data || error.message);
    throw error;
  }
};

////////////////////
// Orders API (Fetching Orders Instead of Bookings)
////////////////////

export const fetchOrders = async (status = "") => {
  try {
    const response = await API.get("/orders", {
      params: { status }, // Pass status as a query parameter
    });
    return response.data;
  } catch (error) {
    console.error("Error fetching orders:", error.response?.data || error.message);
    throw error;
  }
};

export const updateOrderStatus = async (orderId, status) => {
  try {
    const response = await API.put(`/orders/${orderId}`, { status });
    return response.data;
  } catch (error) {
    console.error("Error updating order status:", error.response?.data || error.message);
    throw error;
  }
};

export const deleteOrder = async (orderId) => {
  try {
    const response = await API.delete(`/orders/${orderId}`);
    return response.data;
  } catch (error) {
    console.error("Error deleting order:", error.response?.data || error.message);
    throw error;
  }
};

export const fetchBookings = async (status = "") => {
  try {
    const response = await API.get("/orders", {
      params: { status }, // Adjust filter for orders
    });
    return response.data;
  } catch (error) {
    console.error("Error fetching orders:", error.response?.data || error.message);
    throw error;
  }
};

export default API;
