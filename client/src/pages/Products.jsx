import React, { useContext, useEffect, useState } from "react";
import axiosInstance from "../utils/axiosInstance.js";
import { storeContext } from "../context/storeContext.jsx";
import toast from "react-hot-toast";
import { CartContext } from "../context/CartContext.jsx";

const Products = () => {
  const url = "http://127.0.0.1:8000";
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
      <div className="flex-1 p-4 md:p-6"> {/* Added flex-1 and margin-left for sidebar */}
        <div className="mb-6">
          <h1 className="text-2xl font-bold text-gray-800">Products</h1>
          <p className="text-gray-600">
            {filteredProducts.length} products found
            {selectedCategories.size > 0 && ' in selected categories'}
          </p>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 2xl:grid-cols-4 gap-4 md:gap-6">
          {filteredProducts.map((product) => (
            <div
              key={product.id}
              className="bg-white rounded-xl overflow-hidden shadow-lg hover:shadow-xl transition-shadow duration-300"
            >
              <div className="relative pb-[100%] group"> {/* Made square aspect ratio consistent */}
                <img
                  src={`${url}/images/${product?.Product_Images[0]?.image_path}`}
                  alt={product.name}
                  className="absolute top-0 left-0 w-full h-full object-contain p-4 group-hover:scale-105 transition-transform duration-300"
                />
              </div>
              <div className="p-4">
                <h3 className="text-lg font-bold text-gray-800 mb-2 truncate">
                  {product.name}
                </h3>
                <p className="text-gray-600 text-sm line-clamp-2 mb-3 h-10"> {/* Fixed height for description */}
                  {product.description}
                </p>
                <div className="flex justify-between items-center mb-3">
                  <span className="text-xl font-bold text-green-600">
                    ₹{product.price.toLocaleString('en-IN')} {/* Added proper number formatting */}
                  </span>
                  <span className={`text-sm font-medium px-2 py-1 rounded-full ${product.stock > 0 ? 'bg-green-100 text-green-800' : 'bg-red-100 text-red-800'
                    }`}>
                    {product.stock > 0 ? `${product.stock} in stock` : 'Out of stock'}
                  </span>
                </div>
                <button
                  onClick={() => addToCart(product, 1)}
                  disabled={product.stock === 0}
                  className={`w-full py-2.5 px-4 rounded-lg font-semibold transition-all duration-200 ${product.stock === 0
                    ? 'bg-gray-200 text-gray-500 cursor-not-allowed'
                    : 'bg-blue-500 hover:bg-blue-600 active:bg-blue-700 text-white transform hover:-translate-y-0.5'
                    }`}
                >
                  {product.stock === 0 ? 'Out of Stock' : 'Add to Cart'}
                </button>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};

export default Products;