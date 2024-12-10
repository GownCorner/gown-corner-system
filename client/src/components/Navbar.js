import React, { useContext } from "react";
import { Link } from "react-router-dom";
import { AuthContext } from "../context/AuthContext";

const Navbar = () => {
  const { user, logout } = useContext(AuthContext);

  return (
    <nav className="bg-green-900 text-white py-4 px-8 flex justify-between items-center shadow-md">
      {/* Logo */}
      <div className="text-2xl font-bold">
        <Link to="/" className="hover:text-yellow-400 transition duration-300">
          GownCorner by GDL
        </Link>
      </div>

      {/* Navbar Menu */}
      <ul className="flex space-x-8">
        <li>
          <Link to="/" className="hover:text-yellow-400 transition duration-300">
            Home
          </Link>
        </li>
        <li>
          <Link to="/about" className="hover:text-yellow-400 transition duration-300">
            About Us
          </Link>
        </li>
        <li>
          <Link to="/collection" className="hover:text-yellow-400 transition duration-300">
            The Collection
          </Link>
        </li>
        {user ? (
          <>
            {user.role === "admin" && (
              <>
                <li>
                  <Link
                    to="/admin/dashboard"
                    className="hover:text-yellow-400 transition duration-300"
                  >
                    Dashboard
                  </Link>
                </li>
                <li>
                  <Link
                    to="/admin/bookings"
                    className="hover:text-yellow-400 transition duration-300"
                  >
                    Bookings
                  </Link>
                </li>
                <li>
                  <Link
                    to="/admin/users"
                    className="hover:text-yellow-400 transition duration-300"
                  >
                    Users
                  </Link>
                </li>
                <li>
                  <Link
                    to="/admin/inventory"
                    className="hover:text-yellow-400 transition duration-300"
                  >
                    Inventory
                  </Link>
                </li>
              </>
            )}
            <li>
              <Link
                to="/cart"
                className="bg-yellow-400 text-green-900 px-4 py-2 rounded-md hover:bg-yellow-300 transition duration-300"
              >
                🛒 My Cart
              </Link>
            </li>
            <li className="text-yellow-300">Welcome, {user.email}</li>
            <li>
              <button
                onClick={logout}
                className="bg-yellow-400 text-green-900 px-4 py-2 rounded-md hover:bg-yellow-300 transition duration-300"
              >
                Logout
              </button>
            </li>
          </>
        ) : (
          <li>
            <Link
              to="/login"
              className="bg-yellow-400 text-green-900 px-4 py-2 rounded-md hover:bg-yellow-300 transition duration-300"
            >
              Login
            </Link>
          </li>
        )}
      </ul>
    </nav>
  );
};

export default Navbar;
