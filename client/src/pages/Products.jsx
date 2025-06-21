import React, { useContext, useEffect, useState } from "react";
import axiosInstance from "../utils/axiosInstance.js";
import { storeContext } from "../context/StoreContext.jsx";
import toast from "react-hot-toast";
import { CartContext } from "../context/CartContext.jsx";
import { useNavigate } from "react-router-dom";

const Products = () => {
  const url = "https://ecommerce-project-1-rho.vercel.app";
  const navigate = useNavigate()
  const [products, setProducts] = useState([]);
  const [categories, setCategories] = useState([]);
  const [selectedCategories, setSelectedCategories] = useState(new Set());
  const [isSidebarOpen, setIsSidebarOpen] = useState(false);
  const { token, fetchToken, deleteToken } = useContext(storeContext)
  const { fetchCart, cart } = useContext(CartContext)

  const fetchProducts = async () => {
    try {
      const response = await axiosInstance.get(`/user/home`);

      setProducts(response.data.data);

    } catch (error) {
      console.error("Error fetching products:", error);
    }
  };

  const fetchCategories = async () => {

    try {
      const response = await axiosInstance.get("/categories", {
        headers: {
          Authorization: `Bearer ${token}`
        }
      });

      setCategories(response.data.data);
    } catch (error) {
      console.error("Error fetching categories:", error.response ? error.response.data : error.message);
    }
  };

  const handleCategoryToggle = (categoryId) => {
    const newSelected = new Set(selectedCategories);
    if (newSelected.has(categoryId)) {
      newSelected.delete(categoryId);
    } else {
      newSelected.add(categoryId);
    }
    setSelectedCategories(newSelected);
  };

  const toggleSidebar = () => {
    setIsSidebarOpen(!isSidebarOpen);
  };

  const addToCart = async (product, quantity) => {
    try {
      if (!localStorage.getItem("token")) {
        toast.error("Please log in to add items to your cart.");
        return;
      }

      // Fetch user's cart to check the current quantity of the product
      const cartResponse = await axiosInstance.get("/user/cart", {
        headers: { token: localStorage.getItem("token") },
      });

      if (cartResponse.data.message == "session timed out. Please login again") {
        localStorage.removeItem("token")
        deleteToken()
        fetchCart()
        toast.error(cartResponse.data.message)
        return;
      };

      const cart = cartResponse.data.cart;
      const cartItems = cartResponse.data.cart?.CartItems || [];
      const cartItem = cartItems.find((item) => item.product_id === product.id);
      const currentCartQuantity = cartItem ? cartItem.quantity : 0;

      // Check if adding the new quantity exceeds stock
      if (currentCartQuantity + quantity > product.stock) {
        toast.error("Not enough stock available!");
        return;
      }

      const response = await axiosInstance.post(
        "/user/cart/add",
        { product_id: product.id, quantity, cart_id: cart.id },
        { headers: { token: localStorage.getItem("token") } }
      );

      if (response.data.message == "session timed out. Please login again") {
        localStorage.removeItem("token")
        toast.error(response.data.message)
        fetchCart()

      } else if (response.data.success) {
        toast.success("Added to cart successfully");
        fetchCart()

      } else {
        toast.error(response.data.message);
        fetchCart()

      }
    } catch (err) {
      console.log("Error adding to cart:", err.message);
      toast.error("Failed to add item to cart.");
    }
  };



  useEffect(() => {
    fetchToken()
    fetchProducts();
    fetchCategories();
  }, []);

  const filteredProducts = products.filter(product =>
    selectedCategories.size === 0 || selectedCategories.has(product.category_id)
  );

  return (
    <div className="min-h-screen bg-[#f9f9f9] relative flex justify-between gap-0 w-full">
      {/* Mobile Sidebar Toggle Button */}
      <button
        onClick={toggleSidebar}
        className="md:hidden fixed bottom-4 right-4 bg-blue-500 text-white p-4 rounded-full hover:bg-blue-600 transition-colors"
      >
        <svg
          xmlns="http://www.w3.org/2000/svg"
          className="h-6 w-6"
          fill="none"
          viewBox="0 0 24 24"
          stroke="currentColor"
        >
          <path
            strokeLinecap="round"
            strokeLinejoin="round"
            strokeWidth={2}
            d="M4 6h16M4 12h16M4 18h16"
          />
        </svg>
      </button>

      {/* Overlay for mobile */}
      {isSidebarOpen && (
        <div
          className="md:hidden fixed inset-0 bg-black bg-opacity-50 z-40"
          onClick={() => setIsSidebarOpen(false)}
        />
      )}

      {/* Sidebar */}
      <div className={`
        transform transition-transform duration-300 ease-in-out
        fixed top-0 left-0 h-screen bg-white shadow-lg
        w-64 overflow-y-auto
        md:translate-x-0 md:transform-none md:relative md:block
        ${isSidebarOpen ? 'translate-x-0' : '-translate-x-full'}
      `}>
        <div className="p-6">
          <div className="flex justify-between items-center mb-4">
            <h2 className="text-xl font-bold text-gray-800">Categories</h2>
            <button
              onClick={() => setIsSidebarOpen(false)}
              className="md:hidden text-gray-500 hover:text-gray-700"
            >
              <svg
                className="w-6 h-6"
                fill="none"
                stroke="currentColor"
                viewBox="0 0 24 24"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M6 18L18 6M6 6l12 12"
                />
              </svg>
            </button>
          </div>
          <div className="space-y-2 ">
            {categories.map((category) => (
              <label key={category.id} className="flex items-center space-x-2 cursor-pointer">
                <input
                  type="checkbox"
                  checked={selectedCategories.has(category.id)}
                  onChange={() => handleCategoryToggle(category.id)}
                  className="form-checkbox h-4 w-4 text-blue-500 rounded border-gray-300 focus:ring-blue-500"
                />
                <span className="text-gray-700 hover:text-blue-500 transition-colors">
                  {category.name}
                </span>
              </label>
            ))}
          </div>
        </div>
      </div>

      {/* Main Content */}
      <div className="container mx-auto px-4 py-10">
        <h2 className="text-3xl font-semibold mb-6">Featured Products</h2>
        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-4 gap-6">
          {products.map((product) => (
            <div
              key={product.id}
              className="bg-white shadow-md rounded-lg p-5 overflow-hidden transition-transform hover:scale-105 cursor-pointer"
            >
              <div onClick={() => navigate(`/product/${product.id}`)} className="cursor-pointer">
                <img
                  src={`${product?.Product_Images[0]?.image_path || 'https://img.freepik.com/free-vector/realistic-round-box-mockup_52683-87713.jpg?semt=ais_hybrid&w=740'}`}
                  alt={product.name}
                  className="object-contain h-60 w-full"
                />
                <div className="p-4">
                  <h3 className="text-lg font-semibold truncate">{product.name}</h3>
                  <p className="text-gray-600 text-sm line-clamp-2">{product.description}</p>
                  <p className="text-xl text-green-600 font-semibold">₹{product.price}</p>
                  <p className="text-xs text-gray-500 font-semibold">Stock: {product.stock}</p>
                </div>
              </div>
              <button
                onClick={(e) => {
                  e.stopPropagation();
                  addToCart(product, 1);
                }}
                className="mt-3 w-full bg-blue-500 hover:bg-blue-600 text-white font-semibold py-2 rounded-lg"
              >
                Add to Cart
              </button>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};

export default Products;