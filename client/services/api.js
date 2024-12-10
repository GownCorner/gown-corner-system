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
// Orders API
////////////////////

// Fetch all orders with optional status filter
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

// Update the status of an order
export const updateOrderStatus = async (orderId, status) => {
  try {
    const response = await API.put(`/orders/${orderId}`, { status }); // Corrected endpoint
    return response.data;
  } catch (error) {
    console.error("Error updating order status:", error.response?.data || error.message);
    throw error;
  }
};

// Delete an order by ID
export const deleteOrder = async (orderId) => {
  try {
    const response = await API.delete(`/orders/${orderId}`); // Corrected endpoint
    return response.data;
  } catch (error) {
    console.error("Error deleting order:", error.response?.data || error.message);
    throw error;
  }
};

export default API;
