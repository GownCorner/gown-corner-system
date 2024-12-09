import React, { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import api from "../utils/api"; // Import the configured Axios instance

const Login = () => {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [errorMessage, setErrorMessage] = useState(null);
  const navigate = useNavigate();

  const handleLogin = async (e) => {
    e.preventDefault();
    setErrorMessage(null);

    try {
      // Use the Axios instance to make the API call
      const response = await api.post("/auth/login", { email, password });

      console.log("Login successful:", response.data);

      // Save the token and navigate based on user role
      localStorage.setItem("token", response.data.token);
      navigate(response.data.user.role === "admin" ? "/admin/dashboard" : "/");
    } catch (error) {
      console.error("Login error:", error.message);
      setErrorMessage(
        error.response?.data?.message || "Login failed. Please try again."
      );
    }
  };

  return (
    <div className="flex items-center justify-center h-screen bg-gray-100">
      <div className="bg-white p-8 rounded-lg shadow-lg w-full max-w-md">
        <h1 className="text-2xl font-bold text-center text-green-900 mb-6">Login</h1>
        {errorMessage && <div className="text-red-600 text-sm mb-4">{errorMessage}</div>}
        <form onSubmit={handleLogin} className="space-y-4">
          <div>
            <label className="block text-gray-700 font-medium mb-2">Email</label>
            <input
              type="email"
              placeholder="Enter your email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              required
              className="w-full px-4 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-green-600 focus:border-transparent"
            />
          </div>
          <div>
            <label className="block text-gray-700 font-medium mb-2">Password</label>
            <input
              type="password"
              placeholder="Enter your password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              required
              className="w-full px-4 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-green-600 focus:border-transparent"
            />
          </div>
          <button
            type="submit"
            className="w-full bg-green-900 text-white py-2 px-4 rounded-md hover:bg-green-700 transition duration-300"
          >
            Login
          </button>
        </form>
        <div className="mt-4 text-center">
          <Link to="/forgot-password" className="text-green-900 font-medium hover:underline">
            Forgot Password?
          </Link>
          <span className="mx-2">|</span>
          <Link to="/signup" className="text-green-900 font-medium hover:underline">
            Sign Up
          </Link>
        </div>
      </div>
    </div>
  );
};

export default Login;
