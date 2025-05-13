import axios from "axios";
import { useState } from "react";
import toast from "react-hot-toast";
import { Link, useNavigate } from "react-router-dom";
import { ShieldCheck } from "lucide-react";
import axiosInstance from "../utils/axiosInstance";

const AdminLogin = () => {
  const [formData, setFormData] = useState({ email: "", password: "" });
  const navigate = useNavigate();

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      const response = await axiosInstance.post('/admin/login', formData);

      if (response.data.success) {
        toast.success(response.data.message);
        localStorage.setItem("token", response.data.token)
        navigate("/admin");
      } else {
        toast.error(response.data.message);
      }
    } catch (err) {
      toast.error(err.message)
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-white to-gray-100">
      <div className="bg-white border border-gray-200 p-8 rounded-xl shadow-lg w-full max-w-md transition hover:shadow-blue-300">
        <div className="flex flex-col items-center mb-6">
          <ShieldCheck className="text-blue-600 w-12 h-12 animate-bounce" />
          <h2 className="text-2xl font-bold text-gray-800 mt-2">
            Admin <span className="text-blue-600">Login</span>
          </h2>
          <p className="text-sm text-gray-500 mt-1">Only for authorized access</p>
        </div>
        <form onSubmit={handleSubmit} className="space-y-5">
          <input
            type="email"
            name="email"
            autoComplete="email"
            value={formData.email}
            onChange={handleChange}
            placeholder="Admin Email"
            className="w-full px-4 py-2 rounded border border-gray-300 focus:outline-none focus:ring-2 focus:ring-blue-500 transition"
            required
          />
          <input
            type="password"
            name="password"
            autoComplete="current-password"
            value={formData.password}
            onChange={handleChange}
            placeholder="Password"
            className="w-full px-4 py-2 rounded border border-gray-300 focus:outline-none focus:ring-2 focus:ring-blue-500 transition"
            required
          />
          <button
            type="submit"
            className="w-full py-2 bg-blue-600 text-white font-semibold rounded hover:bg-blue-700 transition"
          >
            Login
          </button>
        </form>
        <p className="text-center text-sm text-gray-500 mt-6">
          Not an admin?{" "}
          <Link
            to="/user/login"
            className="text-blue-500 hover:underline"
          >
            Login as Customer
          </Link>
        </p>
      </div>
    </div>
  );
};

export default AdminLogin;
