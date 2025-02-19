import React, { useState, useEffect, useContext } from "react";
import { Link, useNavigate } from "react-router-dom";
import axiosInstance from "../utils/axiosInstance.js";
import { storeContext } from "../context/storeContext.jsx";
import { FiMenu, FiUser, FiShoppingCart, FiLogOut, FiHome, FiPackage } from "react-icons/fi";

const Navbar = () => {
  const { token, setToken, fetchToken } = useContext(storeContext);
  const navigate = useNavigate();
  const [menuOpen, setMenuOpen] = useState(false);
  const [isLoggedIn, setIsLoggedIn] = useState(false);
  const [userRole, setUserRole] = useState("");

  useEffect(() => {
    const checkLoginStatus = async () => {
      try {
        const response = await axiosInstance.get("/user/home");
        setIsLoggedIn(response.status === 200);
        if (response.data.user) {
          setUserRole(response.data.user.role);
        }
      } catch (error) {
        setIsLoggedIn(false);
        setUserRole("");
      }
    };
    checkLoginStatus();
    fetchToken()
  }, []);

  const handleLogout = async () => {
    try {
      await axiosInstance.post("/user/logout");
      setIsLoggedIn(false);
      setToken(null);
      localStorage.removeItem("token");
      navigate("/");
    } catch (error) {
      console.error("Logout failed:", error);
    }
  };

  return (
    <nav className="bg-gray-900 text-white p-4">
      <div className="container mx-auto flex justify-between items-center">
        <Link to="/">
          <img src="/logo.webp" alt="Logo" className="h-10 invert" />
        </Link>

        <button className="md:hidden" onClick={() => setMenuOpen(!menuOpen)}>
          <FiMenu className="text-2xl" />
        </button>

        <div className="hidden md:flex space-x-6 items-center">
          <Link to="/" className="hover:text-gray-400">Home</Link>
          <Link to="/products" className="hover:text-gray-400">Products</Link>
          <Link to="/cart" className="hover:text-gray-400">Cart</Link>

          {token || localStorage.getItem("token") ? (
            <div className="relative">
              <button onClick={() => setMenuOpen(!menuOpen)}>
                <FiUser className="cursor-pointer text-2xl" />
              </button>
              {menuOpen && (
                <div className="absolute z-5 right-0 mt-2 w-48 bg-white text-black shadow-lg rounded-lg overflow-hidden">
                  <Link to="/cart" className="block px-4 py-2 hover:bg-gray-200 flex items-center">
                    <FiShoppingCart className="mr-2" /> Cart
                  </Link>
                  <Link to="/orders" className="block px-4 py-2 hover:bg-gray-200 flex items-center">
                    <FiPackage className="mr-2" /> Orders
                  </Link>
                  {userRole === "admin" && (
                    <Link to="/admin" className="block px-4 py-2 hover:bg-gray-200 flex items-center text-yellow-500">
                      <FiPackage className="mr-2" /> Admin Panel
                    </Link>
                  )}
                  <button onClick={handleLogout} className="block w-full text-left px-4 py-2 text-red-600 hover:bg-gray-200 flex items-center">
                    <FiLogOut className="mr-2" /> Logout
                  </button>
                </div>
              )}
            </div>
          ) : (
            <Link to="/user/login" className="hover:text-gray-400">Login</Link>
          )}
        </div>
      </div>

      {menuOpen && (
        <div className="md:hidden bg-gray-800 p-4 space-y-4">
          <Link to="/" className="block hover:text-gray-400 flex items-center">
            <FiHome className="mr-2" /> Home
          </Link>
          <Link to="/products" className="block hover:text-gray-400 flex items-center">
            <FiPackage className="mr-2" /> Products
          </Link>
          <Link to="/cart" className="block hover:text-gray-400 flex items-center">
            <FiShoppingCart className="mr-2" /> Cart
          </Link>

          {token || localStorage.getItem("token") ? (
            <>
              <Link to="/orders" className="block hover:text-gray-400 flex items-center">
                <FiPackage className="mr-2" /> Orders
              </Link>
              {userRole === "admin" && (
                <Link to="/admin" className="block hover:text-yellow-400 flex items-center">
                  <FiPackage className="mr-2" /> Admin Panel
                </Link>
              )}
              <button onClick={handleLogout} className="block w-full text-left text-red-500 hover:text-red-400 flex items-center">
                <FiLogOut className="mr-2" /> Logout
              </button>
            </>
          ) : (
            <Link to="/user/login" className="block hover:text-gray-400">Login</Link>
          )}
        </div>
      )}
    </nav>
  );
};

export default Navbar;
