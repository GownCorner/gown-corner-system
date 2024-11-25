import React, { useContext } from "react";
import { BrowserRouter as Router, Routes, Route, Navigate } from "react-router-dom";
import Navbar from "./components/Navbar";
import { AuthContext } from "./context/AuthContext";
import Home from "./pages/Home";
import About from "./pages/About";
import Collection from "./pages/Collection";
import Login from "./pages/Login";
import Signup from "./pages/Signup";
import Cart from "./pages/Cart";
import Checkout from "./pages/Checkout";
import AdminDashboard from "./pages/AdminDashboard";
import AdminBookings from "./pages/AdminBookings";
import AdminUsers from "./pages/AdminUsers";
import AdminInventory from "./pages/AdminInventory";
import ForgotPassword from "./pages/ForgotPassword";
import Success from "./pages/Success";
import Cancel from "./pages/Cancel";

const ProtectedRoute = ({ element, role }) => {
  const { user } = useContext(AuthContext);
  console.log("User:", user); // Debugging

  if (!user) return <Navigate to="/login" />;
  if (role && user.role !== role) return <Navigate to="/" />;
  return element;
};

const App = () => (
  <Router>
    <Navbar />
    <Routes>
      <Route path="/" element={<Home />} />
      <Route path="/about" element={<About />} />
      <Route path="/collection" element={<Collection />} />
      <Route path="/login" element={<Login />} />
      <Route path="/signup" element={<Signup />} />
      <Route path="/forgot-password" element={<ForgotPassword />} />
      <Route path="/cart" element={<ProtectedRoute element={<Cart />} />} />
      <Route path="/checkout" element={<ProtectedRoute element={<Checkout />} />} />
      <Route path="/success" element={<ProtectedRoute element={<Success />} />} />
      <Route path="/cancel" element={<ProtectedRoute element={<Cancel />} />} />
      <Route path="/admin/dashboard" element={<ProtectedRoute element={<AdminDashboard />} role="admin" />} />
      <Route path="/admin/bookings" element={<ProtectedRoute element={<AdminBookings />} role="admin" />} />
      <Route path="/admin/users" element={<ProtectedRoute element={<AdminUsers />} role="admin" />} />
      <Route path="/admin/inventory" element={<ProtectedRoute element={<AdminInventory />} role="admin" />} />
      <Route path="*" element={<h1>404 - Page Not Found</h1>} />
    </Routes>
  </Router>
);

export default App;
