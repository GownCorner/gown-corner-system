import React, { createContext, useState, useEffect } from "react";
import axios from "axios";

// Use environment variables or fallback to localhost for development
const baseURL = process.env.REACT_APP_API_BASE_URL || "http://localhost:5000/api";

// Create the AuthContext
export const AuthContext = createContext();

// AuthProvider component
export const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(null); // Stores the authenticated user

  // Fetch the current user on initial load
  useEffect(() => {
    const fetchUser = async () => {
      const token = localStorage.getItem("token");
      if (!token) return;

      try {
        // Decode JWT to check expiration
        const { exp } = JSON.parse(atob(token.split(".")[1]));
        if (Date.now() >= exp * 1000) {
          console.warn("Token expired, logging out...");
          logout(); // Clear token and user state
          return;
        }

        // Fetch user data from the backend
        const response = await axios.get(`${baseURL}/auth/me`, {
          headers: { Authorization: `Bearer ${token}` },
        });
        setUser(response.data); // Update user state
      } catch (error) {
        console.error("Error fetching user:", error.response?.data?.message || error.message);
        logout(); // Clear token and user state on error
      }
    };

    fetchUser();
  }, []);

  // Login function
  const login = async (email, password) => {
    try {
      const response = await axios.post(`${baseURL}/auth/login`, { email, password });
      localStorage.setItem("token", response.data.token); // Save token in localStorage
      setUser(response.data.user); // Update user state
    } catch (error) {
      console.error("Login failed:", error.response?.data?.message || error.message);
      throw error; // Re-throw error to handle in the calling component
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
