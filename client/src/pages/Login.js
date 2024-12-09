import React, { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import api from "../utils/api"; // Import the Axios instance

const Login = () => {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [errorMessage, setErrorMessage] = useState(null); // To display error messages
  const navigate = useNavigate();

  const handleLogin = async (e) => {
    e.preventDefault();
    setErrorMessage(null); // Reset error message

    try {
      const response = await api.post("/auth/login", { email, password });

      console.log("Login successful:", response.data);

      // Save token and redirect based on role
      localStorage.setItem("token", response.data.token);
      navigate(response.data.user.role === "admin" ? "/admin/dashboard" : "/");
    } catch (error) {
      console.error("Login error:", error.message);
      setErrorMessage(error.response?.data?.message || "Login failed"); // Set error message for display
    }
  };

  return (
    <div className="flex items-center justify-center h-screen bg-gray-100">
      {/* ... rest of your component code remains the same */}
    </div>
  );
};

export default Login;
