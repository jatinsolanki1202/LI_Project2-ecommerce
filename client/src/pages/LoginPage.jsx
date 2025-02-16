import React, { useContext, useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { Cookie, X } from "lucide-react";
import axios from 'axios'
import toast from 'react-hot-toast';
import { storeContext } from "../context/storeContext";

const LoginPage = () => {
  const { setToken } = useContext(storeContext)

  const [isRegister, setIsRegister] = useState(false);
  const [loginUser, setLoginUser] = useState({
    email: "",
    password: ""
  })
  const [registerUser, setRegisterUser] = useState({
    name: "",
    email: "",
    password: "",
    cnfPassword: "",
    address: ""
  })
  const navigate = useNavigate();

  // onchange event
  function handleInputChange(e) {
    let value = e.target.value;
    let name = e.target.name;
    setRegisterUser(registerUser => ({ ...registerUser, [name]: value }))
    setLoginUser(loginUser => ({ ...loginUser, [name]: value }))
  }
  async function handleLogin(e) {
    e.preventDefault();
    try {
      const response = await axios.post('http://127.0.0.1:8000/user/login', loginUser);
      if (response.data.success) {
        toast.success(response.data.message);
        localStorage.setItem('token', response.data.token)
        navigate("/");
      } else {
        toast.error(response.data.message);
        localStorage.removeItem("token")
      }
    } catch (err) {
      toast.error("something went wrong. please try again");
    }
  }

  async function handleRegister(e) {
    e.preventDefault();
    try {
      const response = await axios.post('http://127.0.0.1:8000/user/register', registerUser);
      if (response.data.status < 400) {
        toast.success(response.data.message);
        localStorage.setItem("token", response.data.token);  // Store login status after registration
        navigate("/");
      } else {
        toast.error(response.data.message);
      }
    } catch (err) {
      toast.error("Something went wrong. Registration failed");
    }
  }

  return (
    <div className="flex justify-center items-center min-h-screen bg-gray-900">
      <div className="relative bg-gray-800 p-8 rounded-xl shadow-xl w-96 text-white">
        {/* Cancel Button (Top-Right) */}
        <button
          onClick={() => navigate("/")}
          className="absolute top-3 right-3 text-gray-400 hover:text-gray-200"
        >
          <X size={24} />
        </button>

        {/* Title */}
        <h2 className="text-2xl font-semibold text-blue-400 text-center mb-6">
          {isRegister ? "Register" : "Login"}
        </h2>

        {/* Form */}
        <form className="space-y-4" onSubmit={isRegister ? handleRegister : handleLogin}>
          {isRegister && (
            <input
              type="text"
              placeholder="Full Name"
              className="w-full px-4 py-2 bg-gray-700 text-white border border-gray-600 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
              name="name"
              required
              onChange={handleInputChange}
            />
          )}

          <input
            type="email"
            placeholder="Email"
            className="w-full px-4 py-2 bg-gray-700 text-white border border-gray-600 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
            name="email"
            required
            onChange={handleInputChange}
          />
          <input
            type="password"
            placeholder="Password"
            className="w-full px-4 py-2 bg-gray-700 text-white border border-gray-600 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
            name="password"
            required
            onChange={handleInputChange}
          />

          {isRegister && (
            <>
              <input
                type="password"
                placeholder="Confirm Password"
                className="w-full px-4 py-2 bg-gray-700 text-white border border-gray-600 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                name="cnfPassword"
                required
                onChange={handleInputChange}
              />
              <input
                type="text"
                placeholder="Address"
                className="w-full px-4 py-2 bg-gray-700 text-white border border-gray-600 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                name="address"
                required
                onChange={handleInputChange}
              />
            </>
          )}

          {/* Submit Button */}
          <button className="w-full bg-blue-600 cursor-pointer text-white py-2 rounded-md hover:bg-blue-700 transition">
            {isRegister ? "Register" : "Login"}
          </button>
        </form>

        {/* Toggle Between Login & Register */}
        <p className="text-center mt-4 text-gray-400">
          {isRegister ? "Already have an account?" : "Don't have an account?"}{" "}
          <button
            onClick={() => setIsRegister(!isRegister)}
            className="text-blue-400 cursor-pointer font-medium hover:underline"
          >
            {isRegister ? "Login" : "Register"}
          </button>
        </p>
      </div>
    </div>
  );
};

export default LoginPage;
