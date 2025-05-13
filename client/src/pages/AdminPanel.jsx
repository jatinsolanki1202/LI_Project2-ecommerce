import React, { useContext, useEffect, useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { Home, List, Package, ShoppingCart, Users } from "lucide-react";
import axiosInstance from "../utils/axiosInstance";
import toast from "react-hot-toast";
import { storeContext } from "../context/storeContext";
const AdminPanel = () => {
  const navigate = useNavigate()
  const { fetchToken, token } = useContext(storeContext)
  const [categories, setCategories] = useState([])
  const [products, setProducts] = useState([])
  const [orders, setOrders] = useState([])

  const checkUserRole = async () => {
    try {
      let token = localStorage.getItem("token")
      if (!token) navigate("admin/login")

      let response = await axiosInstance.get("/check/login-status", {
        headers: {
          Authorization: `Bearer ${token}`
        }
      })

      if (response.data.role == "admin") {
        navigate("/admin")
      } else {
        navigate("/admin/login")
      }
    } catch (err) {
      toast.error("something went wrong")
    }
  }

  const fetchCategories = async () => {
    try {
      const categoryResponse = await axiosInstance.get("/admin/category", {
        headers: {
          token: token
        }
      })
      if (categoryResponse.data.success) {
        setCategories(categoryResponse.data.data)
      }

    } catch (error) {
      console.log("error fetching categories:", error.message)
    }
  }

  const fetchProducts = async () => {
    try {
      const productResponse = await axiosInstance.get("/products", {
        headers: {
          token: token
        }
      })
      if (productResponse.data.success) {
        setProducts(productResponse.data.data)
      }

    } catch (error) {
      console.log("error fetching categories:", error.message)
    }
  }

  const fetchOrders = async () => {
    try {
      const ordersResponse = await axiosInstance.get("/orders", {
        headers: {
          token: token
        }
      })
      if (ordersResponse.data.success) {
        setOrders(ordersResponse.data.data)
      }
    } catch (error) {
      console.log("error fetching categories:", error.message)
    }
  }
  useEffect(() => {
    checkUserRole()
    fetchCategories()
    fetchProducts()
    fetchOrders()
  }, [])

  return (
    <div className="flex h-screen bg-gray-100">
      {/* Sidebar */}
      <aside className="w-64 bg-white shadow-lg p-5 flex flex-col">
        <h2 className="text-2xl font-bold text-gray-700 mb-6">Admin Panel</h2>
        <nav className="space-y-4">
          <Link to="/admin" className="flex items-center gap-3 text-gray-700 p-2 hover:bg-gray-200 rounded">
            <Home size={20} /> Dashboard
          </Link>
          <Link to="/admin/categories" className="flex items-center gap-3 text-gray-700 p-2 hover:bg-gray-200 rounded">
            <List size={20} /> Add Category
          </Link>
          <Link to="/admin/products" className="flex items-center gap-3 text-gray-700 p-2 hover:bg-gray-200 rounded">
            <Package size={20} /> Add Products
          </Link>
          <Link to="/admin/orders" className="flex items-center gap-3 text-gray-700 p-2 hover:bg-gray-200 rounded">
            <ShoppingCart size={20} /> Manage Orders
          </Link>
        </nav>
      </aside>

      {/* Main Content */}
      <main className="flex-1 p-6">
        <h1 className="text-3xl font-semibold text-gray-800">Welcome to Admin Panel</h1>
        <p className="text-gray-600 mt-2">Manage your store efficiently from here.</p>

        {/* Dashboard Overview */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mt-6">
          <div className="bg-white shadow-lg rounded-lg p-6">
            <h3 className="text-xl font-semibold text-gray-700">Total Categories</h3>
            <p className="text-2xl font-bold text-blue-600">{categories?.length}</p>
          </div>
          <div className="bg-white shadow-lg rounded-lg p-6">
            <h3 className="text-xl font-semibold text-gray-700">Total Products</h3>
            <p className="text-2xl font-bold text-green-600">{products?.length}</p>
          </div>
          <div className="bg-white shadow-lg rounded-lg p-6">
            <h3 className="text-xl font-semibold text-gray-700">Orders</h3>
            <p className="text-2xl font-bold text-red-600">{orders?.length}</p>
          </div>
        </div>
      </main>
    </div>
  );
};

export default AdminPanel;
