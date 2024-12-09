import axios from "axios";

// Determine the base URL based on the environment
const API_BASE_URL =
  process.env.NODE_ENV === "production"
    ? "https://gown-booking-system.onrender.com/api" // Production backend URL
    : "http://localhost:5000/api"; // Development backend URL

// Create an Axios instance
const api = axios.create({
  baseURL: "https://gown-booking-system.onrender.com/api", // Correct backend URL
  headers: {
    "Content-Type": "application/json",
  },
});

  },
});

// Add an interceptor to include the authorization token in every request
api.interceptors.request.use(
  (config) => {
    const token = localStorage.getItem("token"); // Retrieve token from localStorage
    if (token) {
      config.headers.Authorization = `Bearer ${token}`; // Add Authorization header
    }
    return config;
  },
  (error) => {
    return Promise.reject(error); // Handle request errors
  }
);

// Add an interceptor to handle responses globally
api.interceptors.response.use(
  (response) => {
    return response; // Pass through successful responses
  },
  (error) => {
    // Handle response errors globally (e.g., 401 Unauthorized)
    if (error.response && error.response.status === 401) {
      console.error("Unauthorized access - logging out...");
      localStorage.removeItem("token"); // Clear token
      window.location.href = "/login"; // Redirect to login
    }
    return Promise.reject(error); // Pass through other errors
  }
);

export default api;
