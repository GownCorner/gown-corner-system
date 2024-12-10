import React from "react";
import { Link } from "react-router-dom";

const AdminDashboard = () => {
  return (
    <div className="p-8">
      <h1 className="text-2xl font-bold mb-4">Admin Dashboard</h1>
      <div className="flex flex-col space-y-4">
        <Link to="/admin/bookings" className="text-blue-500 hover:underline">
          Manage Bookings
        </Link>
        <Link to="/admin/users" className="text-blue-500 hover:underline">
          Manage Users
        </Link>
        <Link to="/admin/inventory" className="text-blue-500 hover:underline">
          Manage Inventory
        </Link>
      </div>
    </div>
  );
};

export default AdminDashboard;
