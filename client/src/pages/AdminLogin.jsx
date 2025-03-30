import axios from "axios";
import { useState } from "react";
import toast from "react-hot-toast";
import { Link, useNavigate } from "react-router-dom";

const AdminLogin = () => {
  const [formData, setFormData] = useState({ email: "", password: "" });
  const navigate = useNavigate()

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      const response = await axios.post('http://127.0.0.1:8000/admin/login', formData)

      if (response.data.success) {
        toast.success(response.data.message)
        navigate("/admin")
      } else {
        toast.error(response.data.message)
      }
    } catch (err) {
      toast.error(err.message)
    }
    // Add API call for authentication here
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-900">
      <div className="bg-gray-800 p-8 rounded-lg shadow-lg w-96">
        <h2 className="text-2xl font-semibold text-white text-center mb-4">Admin Login</h2>
        <form onSubmit={handleSubmit} className="space-y-4">
          <input
            type="email"
            name="email"
            value={formData.email}
            onChange={handleChange}
            placeholder="Email"
            className="w-full p-2 border border-gray-600 rounded bg-gray-700 text-white"
            required
          />
          <input
            type="password"
            name="password"
            value={formData.password}
            onChange={handleChange}
            placeholder="Password"
            className="w-full p-2 border border-gray-600 rounded bg-gray-700 text-white"
            required
          />
          <button type="submit" className="w-full bg-blue-500 hover:bg-blue-600 text-white font-semibold py-2 px-4 rounded">
            Login
          </button>
        </form>
        <p className="text-gray-400 text-sm text-center mt-4">
          Not an admin?{" "}
          <Link to="/user/login" className="text-blue-400 hover:underline">
            Login as Customer
          </Link>
        </p>
      </div>
    </div>
  );
};

export default AdminLogin;
