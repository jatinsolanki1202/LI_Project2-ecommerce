import React, { useContext, useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { X } from "lucide-react";
import axios from 'axios';
import toast from 'react-hot-toast';
import { storeContext } from "../context/storeContext";
import { CartContext } from "../context/CartContext";

const LoginPage = () => {
  const { setToken } = useContext(storeContext);
  const { fetchCart } = useContext(CartContext)

  const [isRegister, setIsRegister] = useState(false);
  const [loginUser, setLoginUser] = useState({ email: "", password: "" });
  const [registerUser, setRegisterUser] = useState({
    name: "",
    email: "",
    password: "",
    cnfPassword: "",
    address: ""
  });
  const navigate = useNavigate();

  function handleInputChange(e) {
    let value = e.target.value;
    let name = e.target.name;
    setRegisterUser(registerUser => ({ ...registerUser, [name]: value }));
    setLoginUser(loginUser => ({ ...loginUser, [name]: value }));
  }

  async function handleLogin(e) {
    e.preventDefault();
    try {
      const response = await axios.post('https://ecommerce-project-1-rho.vercel.app/user/login', loginUser);
      if (response.data.success) {
        toast.success(response.data.message);
        localStorage.setItem('token', response.data.token);
        navigate("/");
        fetchCart()
      } else {
        toast.error(response.data.message);
        localStorage.removeItem("token");
        fetchCart()
      }
    } catch (err) {
      toast.error("Something went wrong. Please try again");
    }
  }

  async function handleRegister(e) {
    e.preventDefault();
    try {
      const response = await axios.post('https://ecommerce-project-1-rho.vercel.app/user/register', registerUser);
      if (response.data.status < 400) {
        toast.success(response.data.message);
        localStorage.setItem("token", response.data.token);
        navigate("/");
        fetchCart()
      } else {
        toast.error(response.data.message);
      }
    } catch (err) {
      toast.error("Something went wrong. Registration failed");
    }
  }

  return (
    <div className="flex justify-center items-center min-h-screen bg-[#f9f9f9]">
      <div className="relative bg-white p-8 rounded-lg shadow-xl w-full max-w-md border border-gray-200">
        <button onClick={() => navigate("/")} className="absolute top-3 right-3 text-gray-500 hover:text-gray-700">
          <X size={24} />
        </button>

        <h2 className="text-xl font-semibold text-gray-700 text-center mb-6">
          {isRegister ? "Create an Account" : "Welcome Back"}
        </h2>

        <form className="space-y-4 flex flex-col" onSubmit={isRegister ? handleRegister : handleLogin}>
          {isRegister && (
            <input type="text" placeholder="Full Name" className="w-full px-4 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-black" name="name" required onChange={handleInputChange} />
          )}

          <input type="email" placeholder="Email" className="w-full px-4 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-black" name="email" autoComplete="email" required onChange={handleInputChange} />
          <input type="password" placeholder="Password" className="w-full px-4 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-black" name="password" autoComplete="current-password" required onChange={handleInputChange} />

          {isRegister && (
            <>
              <input type="password" placeholder="Confirm Password" className="w-full px-4 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-black" name="cnfPassword" required onChange={handleInputChange} />
              <input type="text" placeholder="Address" className="w-full px-4 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-black" name="address" required onChange={handleInputChange} />
            </>
          )}

          <button className="w-full bg-black text-white py-2 rounded-md hover:bg-gray-800 transition">
            {isRegister ? "Register" : "Login"}
          </button>
        </form>

        <p className="text-center mt-4 text-gray-600">
          {isRegister ? "Already have an account?" : "Don't have an account?"} {" "}
          <button onClick={() => setIsRegister(!isRegister)} className="text-black font-medium hover:underline">
            {isRegister ? "Login" : "Register"}
          </button>
        </p>
      </div>
    </div>
  );
};

export default LoginPage;