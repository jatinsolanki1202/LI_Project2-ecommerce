import React from "react";
import { Link } from "react-router-dom";
import { Home, List, Package, ShoppingCart, Users } from "lucide-react";

const AdminPanel = () => {



  return (
    <div className="flex h-screen bg-gray-100">
      {/* Sidebar */}
      <aside className="w-64 bg-white shadow-lg p-5 flex flex-col">
        <h2 className="text-2xl font-bold text-gray-700 mb-6">Admin Panel</h2>
        <nav className="space-y-4">
          <Link to="/admin/dashboard" className="flex items-center gap-3 text-gray-700 p-2 hover:bg-gray-200 rounded">
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
          <Link to="/admin/users" className="flex items-center gap-3 text-gray-700 p-2 hover:bg-gray-200 rounded">
            <Users size={20} /> User Management
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
            <p className="text-2xl font-bold text-blue-600">12</p>
          </div>
          <div className="bg-white shadow-lg rounded-lg p-6">
            <h3 className="text-xl font-semibold text-gray-700">Total Products</h3>
            <p className="text-2xl font-bold text-green-600">120</p>
          </div>
          <div className="bg-white shadow-lg rounded-lg p-6">
            <h3 className="text-xl font-semibold text-gray-700">Orders</h3>
            <p className="text-2xl font-bold text-red-600">25</p>
          </div>
        </div>
      </main>
    </div>
  );
};

export default AdminPanel;
