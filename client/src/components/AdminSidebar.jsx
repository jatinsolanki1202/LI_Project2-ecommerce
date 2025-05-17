import React from "react";
import { Link } from "react-router-dom";
import { Home, List, Package, ShoppingCart } from "lucide-react";

const AdminSidebar = () => (
  <aside className="sticky top-[10vh] left-0 h-screen w-64 bg-white p-5 flex flex-col z-5">
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
);

export default AdminSidebar;