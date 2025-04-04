import React, { useState, useEffect, useContext } from "react";
import { Link, NavLink, useNavigate } from "react-router-dom";
import axiosInstance from "../utils/axiosInstance.js";
import { storeContext } from "../context/storeContext.jsx";
import logo from '../assets/images/logo.png';
import searchIcon from '../assets/images/search_icon.png';
import profileIcon from '../assets/images/profile_icon.png';
import cartIcon from '../assets/images/cart_icon.png';
import menuIcon from '../assets/images/menu_icon.png';
import dropdownIcon from '../assets/images/dropdown_icon.png';
import { CartContext } from "../context/CartContext.jsx";

const Navbar = () => {
  const { token, setToken, fetchToken } = useContext(storeContext);
  const { cart, fetchCart, cartLength } = useContext(CartContext)
  const navigate = useNavigate();
  const [visible, setVisible] = useState(false);
  const [isLoggedIn, setIsLoggedIn] = useState(!!token);
  const [userRole, setUserRole] = useState("");

  useEffect(() => {
    const checkLoginStatus = async () => {
      try {
        if (!token) {
          setIsLoggedIn(false);
          setUserRole("");
          return;
        }

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
  }, [token]); // Runs when `token` changes

  useEffect(() => {
    fetchCart()
  }, [])

  const handleLogout = async () => {
    try {
      await axiosInstance.post("/user/logout");
      setToken(null);
      localStorage.removeItem("token");
      setIsLoggedIn(false);
      navigate("/");
    } catch (error) {
      console.error("Logout failed:", error);
    }
  };


  return (
    <div className="flex items-center justify-between py-2 font-medium sticky top-0 backdrop-blur-lg bg-[#f9f9f9] shadow-lg w-full px-10">
      <NavLink to="/">
        <img src={logo} className="w-28" alt="Logo" />
      </NavLink>

      <ul className="hidden sm:flex gap-5 text-sm text-gray-700">
        <NavLink to="/" className="flex flex-col items-center gap-1 px-3 py-2 rounded-lg hover:text-gray-700 hover:rounded-lg hover:bg-gray-100 transition duration-400">
          <p>Home</p>
          <hr className="w-2/4 border-none h-[1.5px] bg-gray-700 hidden" />
        </NavLink>
        <NavLink to="/collection" className="flex flex-col items-center gap-1 px-3 py-2  rounded-lg hover:text-gray-700 hover:rounded-lg hover:bg-gray-100 transition duration-400">
          <p>Collection</p>
          <hr className="w-2/4 border-none h-[1.5px] bg-gray-700 hidden" />
        </NavLink>
        <NavLink to="/about" className="flex flex-col items-center gap-1 px-3 py-2  rounded-lg hover:text-gray-700 hover:rounded-lg hover:bg-gray-100 transition duration-400">
          <p>About</p>
          <hr className="w-2/4 border-none h-[1.5px] bg-gray-700 hidden" />
        </NavLink>
        <NavLink to="/contact" className="flex flex-col items-center gap-1 px-3 py-2  rounded-lg hover:text-gray-700 hover:rounded-lg hover:bg-gray-100 transition duration-400">
          <p>Contact</p>
          <hr className="w-2/4 border-none h-[1.5px] bg-gray-700 hidden" />
        </NavLink>
      </ul>

      <ul>
        <div className="flex items-center gap-6">
          <img src={searchIcon} className="w-5 cursor-pointer" alt="Search" />

          {/* Profile Dropdown */}
          <div className="group relative">
            <img src={profileIcon} className="w-5 cursor-pointer" alt="Profile" />

            <div className="group-hover:block hidden absolute dropdown-menu right-0 pt-4">
              <div className="flex flex-col gap-2 py-3 px-5 w-36 bg-slate-100 text-gray-500 rounded-lg shadow-lg">
                {isLoggedIn ? (
                  <>
                    <p className="cursor-pointer hover:text-black" onClick={() => navigate('/cart')}>Cart</p>
                    <p className="cursor-pointer hover:text-black">Orders</p>
                    <p className="cursor-pointer hover:text-black" onClick={handleLogout}>
                      Logout
                    </p>
                  </>
                ) : (
                  <Link to="/user/login" className="cursor-pointer hover:text-black">
                    Login
                  </Link>
                )}
              </div>
            </div>
          </div>

          {/* Cart */}
          <Link to="/cart" className="relative">
            <img src={cartIcon} className="w-5 min-w-5" alt="Cart" />
            <p className="absolute right-[-5px] bottom-[-5px] w-4 text-center leading-4 bg-black text-white aspect-square rounded-full text-[8px]">
              {cartLength}
            </p>
          </Link>

          {/* Mobile Menu */}
          <img
            onClick={() => setVisible(true)}
            src={menuIcon}
            className="w-5 cursor-pointer sm:hidden"
            alt="Menu"
          />

          {/* Sidebar */}
          <div
            className={`absolute top-0 right-0 bottom-0 overflow-hidden bg-white transition-all ${visible ? "w-full" : "w-0"
              }`}
          >
            <div className="flex flex-col text-gray-600">
              <div onClick={() => setVisible(false)} className="flex items-center gap-4 p-3 cursor-pointer">
                <img src={dropdownIcon} className="h-4 rotate-180" alt="Back" />
                <p>Back</p>
              </div>
              <NavLink className="py-2 pl-6 border border-gray-200" onClick={() => setVisible(false)} to="/">
                Home
              </NavLink>
              <NavLink className="py-2 pl-6 border border-gray-200" onClick={() => setVisible(false)} to="/collection">
                Collection
              </NavLink>
              <NavLink className="py-2 pl-6 border border-gray-200" onClick={() => setVisible(false)} to="/about">
                About
              </NavLink>
              <NavLink className="py-2 pl-6 border border-gray-200" onClick={() => setVisible(false)} to="/contact">
                Contact
              </NavLink>
            </div>
          </div>
        </div>
      </ul>
    </div>
  );
};

export default Navbar;
