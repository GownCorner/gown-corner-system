import axios from "axios";

// Use REACT_APP_API_BASE_URL from environment variables or fallback to localhost
export const url = process.env.REACT_APP_API_BASE_URL || "http://localhost:5000/api";

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
    console.error("Response Error:", {
      message: error.message,
      response: error.response ? error.response.data : "No response data",
    });
    return Promise.reject(error);
  }
);

export default api;
