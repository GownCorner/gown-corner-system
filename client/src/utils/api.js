import axios from "axios";

// Use REACT_APP_API_BASE_URL from environment variables or fallback to local
export const url = process.env.REACT_APP_API_BASE_URL || "http://localhost:5000/api";

// Create Axios instance with base URL
const api = axios.create({
  baseURL: url,
  headers: {
    "Content-Type": "application/json",
  },
});

// Intercept request to include Authorization header if token exists
api.interceptors.request.use((config) => {
  const token = localStorage.getItem("token");
  if (token) {
    config.headers.Authorization = `Bearer ${token}`;
  }
  console.log("Outgoing Request:", config); // Debug log
  return config;
});

// Intercept responses
api.interceptors.response.use(
  (response) => {
    console.log("Incoming Response:", response); // Debug log
    return response;
  },
  (error) => {
    console.error("Response Error:", error.response || error.message);
    return Promise.reject(error);
  }
);

export default api;
