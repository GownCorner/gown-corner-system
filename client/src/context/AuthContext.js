import React, { createContext, useState, useEffect } from "react";
import axios from "axios";

export const AuthContext = createContext({
  user: null,
  login: async () => {},
  logout: () => {},
});

const url = "https://gown-booking-system.onrender.com/api"; // Base backend URL

export const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(null);

  useEffect(() => {
    const fetchUser = async () => {
      const token = localStorage.getItem("token");
      if (token) {
        try {
          const decodedToken = JSON.parse(atob(token.split(".")[1])); // Decode JWT token
          if (Date.now() >= decodedToken.exp * 1000) {
            localStorage.removeItem("token");
            setUser(null);
            return;
          }

          const response = await axios.get(`${url}/auth/me`, {
            headers: { Authorization: `Bearer ${token}` },
          });
          setUser(response.data);
        } catch (error) {
          console.error("Error decoding token or fetching user:", error.message);
          localStorage.removeItem("token");
          setUser(null);
        }
      }
    };
    fetchUser();
  }, []);

  const login = async (email, password) => {
    try {
      const response = await axios.post(`${url}/auth/login`, {
        email,
        password,
      });
      localStorage.setItem("token", response.data.token); // Save token
      setUser(response.data.user); // Update user state immediately
    } catch (error) {
      if (error.response && error.response.data.message) {
        throw new Error(error.response.data.message); // Backend-provided error message
      } else {
        throw new Error("An unexpected error occurred. Please try again.");
      }
    }
  };

  const logout = () => {
    setUser(null);
    localStorage.removeItem("token");
    window.location.href = "/login"; // Redirect to login page
  };

  return (
    <AuthContext.Provider value={{ user, login, logout }}>
      {children}
    </AuthContext.Provider>
  );
};

export { url };
