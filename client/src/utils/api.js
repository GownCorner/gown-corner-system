import React, { createContext, useState, useEffect } from "react";
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
  return config;
});

// Create AuthContext
export const AuthContext = createContext();

export const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(null);

  // Fetch current user on initial load
  useEffect(() => {
    const fetchUser = async () => {
      const token = localStorage.getItem("token");
      if (token) {
        try {
          const { exp } = JSON.parse(atob(token.split(".")[1])); // Decode JWT token
          if (Date.now() >= exp * 1000) {
            localStorage.removeItem("token"); // Remove expired token
            setUser(null);
            return;
          }

          // Use Axios instance to fetch user data
          const response = await api.get("/auth/me");
          setUser(response.data);
        } catch (error) {
          console.error("Error fetching user:", error.message);
          localStorage.removeItem("token");
          setUser(null);
        }
      }
    };
    fetchUser();
  }, []);

  // Login function
  const login = async (email, password) => {
    try {
      const response = await api.post("/auth/login", { email, password });
      localStorage.setItem("token", response.data.token); // Save token
      setUser(response.data.user); // Update user state
    } catch (error) {
      console.error("Login failed:", error.message);
      throw error;
    }
  };

  // Logout function
  const logout = () => {
    setUser(null);
    localStorage.removeItem("token");
  };

  return (
    <AuthContext.Provider value={{ user, login, logout }}>
      {children}
    </AuthContext.Provider>
  );
};

export default api; // Export Axios instance for reuse
