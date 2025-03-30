import React, { useContext, useEffect, useState } from "react";
import axiosInstance from "../utils/axiosInstance.js";
import { storeContext } from "../context/storeContext.jsx";
import toast from "react-hot-toast";
import Hero from "../components/Hero.jsx";
import { CartContext } from "../context/CartContext.jsx";
const Home = () => {
  const url = "http://127.0.0.1:8000";
  const [products, setProducts] = useState([]);
  const { token, fetchToken } = useContext(storeContext);
  const { fetchCart } = useContext(CartContext)

  useEffect(() => {
    fetchToken();
    fetchProducts();
    fetchCart()
  }, []);

  const fetchProducts = async () => {
    try {
      const response = await axiosInstance.get(`/user/home`);
      setProducts(response.data.data);
    } catch (error) {
      console.error("Error fetching products:", error);
    }
  };

  const addToCart = async (product) => {
    // fetchToken()
    if (!token) {
      toast.error("Please log in to add items to your cart.");
      return;
    }
    try {
      const response = await axiosInstance.post(
        "/user/cart/add",
        { product_id: product.id, quantity: 1 },
        { headers: { token } }
      );
      if (response.data.success) {
        toast.success("Added to cart successfully");
        fetchCart()
      } else {
        toast.error(response.data.message);
      }
    } catch (err) {
      console.error("Error adding to cart:", err);
      toast.error("Failed to add item to cart.");
    }
  };

  return (
    <div className="bg-[#f9f9f9] text-gray-900 min-h-screen">
      {/* Hero Section */}
      <Hero />

      {/* Product Listing */}
      <div className="container mx-auto px-4 py-10">
        <h2 className="text-3xl font-semibold mb-6">Featured Products</h2>
        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-4 gap-6">
          {products.map((product) => (
            <div key={product.id} className="bg-white shadow-md rounded-lg p-5 overflow-hidden">
              <img
                src={`${url}/images/${product?.Product_Images[0]?.image_path}`}
                alt={product.name}
                className="object-contain h-60 w-full"
              />
              <div className="p-4">
                <h3 className="text-lg font-semibold truncate">{product.name}</h3>
                <p className="text-gray-600 text-sm line-clamp-2">{product.description}</p>
                <p className="text-xl text-green-600 font-semibold">₹{product.price}</p>
                <button
                  onClick={() => addToCart(product)}
                  className="mt-3 w-full bg-blue-500 hover:bg-blue-600 text-white font-semibold py-2 rounded-lg"
                >
                  Add to Cart
                </button>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};

export default Home;