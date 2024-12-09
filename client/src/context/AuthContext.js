import React, { createContext, useState, useEffect } from "react";
import axios from "axios";

export const AuthContext = createContext();

export const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(null);

  useEffect(() => {
    const fetchUser = async () => {
      const token = localStorage.getItem("token");
      if (token) {
        try {
          const { exp } = JSON.parse(atob(token.split(".")[1])); // Decode JWT token
          if (Date.now() >= exp * 1000) {
            localStorage.removeItem("token");
            setUser(null);
            return;
          }

          const response = await axios.get(
            "https://gown-booking-system.onrender.com/api/auth/me", // Updated Render backend URL
            {
              headers: { Authorization: `Bearer ${token}` },
            }
          );
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

  const login = async (email, password) => {
    try {
      const response = await axios.post(
        "https://gown-booking-system.onrender.com/api/auth/login", // Updated Render backend URL
        {
          email,
          password,
        }
      );
      localStorage.setItem("token", response.data.token); // Save token
      setUser(response.data.user); // Update user state immediately
    } catch (error) {
      console.error("Login failed:", error.message);
      throw error;
    }
  };

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
