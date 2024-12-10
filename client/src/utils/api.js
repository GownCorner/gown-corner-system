import axios from "axios";

// Dynamically configure base URL using environment variable or fallback
const api = axios.create({
  baseURL: process.env.REACT_APP_API_BASE_URL || "http://localhost:5000/api", // Use backend deployed or local URL
  timeout: 20000, // Set timeout to 20 seconds for slow server responses
  headers: {
    "Content-Type": "application/json", // Default content type
  },
});

// Add an interceptor to include the authorization token in every request
api.interceptors.request.use(
  (config) => {
    const token = localStorage.getItem("token"); // Retrieve token from localStorage
    if (token) {
      config.headers.Authorization = `Bearer ${token}`; // Add Authorization header
    }
    console.log("Outgoing Request:", {
      url: config.url,
      method: config.method,
      headers: config.headers,
      data: config.data,
    }); // Debug log for outgoing requests
    return config;
  },
  (error) => {
    console.error("Request Error:", error.message); // Debug log for request errors
    return Promise.reject(error); // Handle request errors
  }
);

// Add an interceptor to handle responses globally
api.interceptors.response.use(
  (response) => {
    console.log("Incoming Response:", {
      status: response.status,
      data: response.data,
      headers: response.headers,
    }); // Debug log for successful responses
    return response; // Pass through successful responses
  },
  (error) => {
    console.error("Response Error:", {
      message: error.message,
      response: error.response ? error.response.data : "No response data",
    }); // Debug log for response errors
    // Handle 401 Unauthorized globally
    if (error.response && error.response.status === 401) {
      console.error("Unauthorized access - logging out...");
      localStorage.removeItem("token"); // Clear token
      window.location.href = "/login"; // Redirect to login
    }
    if (error.code === "ECONNABORTED") {
      // Timeout error
      console.error("Timeout Error:", error.message);
      return Promise.reject(new Error("Request timeout. Please try again later."));
    }
    return Promise.reject(error); // Pass through other errors
  }
);

export default api;
