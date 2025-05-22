import React, { useContext, useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import axiosInstance from "../utils/axiosInstance.js";
import { storeContext } from "../context/StoreContext.jsx";
import toast from "react-hot-toast";
import Hero from "../components/Hero.jsx";
import { CartContext } from "../context/CartContext.jsx";

const Home = () => {
  const navigate = useNavigate();
  const url = "https://ecommerce-project-1-rho.vercel.app";
  const [products, setProducts] = useState([]);
  const { token, fetchToken, deleteToken } = useContext(storeContext);
  const { fetchCart, cart, cartItems } = useContext(CartContext);

  useEffect(() => {
    fetchToken();
    fetchProducts();
    fetchCart();
  }, []);

  const fetchProducts = async () => {
    try {
      const response = await axiosInstance.get(`/user/home`);
      setProducts(response.data.data);
    } catch (error) {
      console.error("Error fetching products:", error);
    }
  };

  const addToCart = async (product, quantity) => {
    try {
      if (!localStorage.getItem("token")) {
        toast.error("Please log in to add items to your cart.");
        return;
      }

      const cartResponse = await axiosInstance.get("/user/cart", {
        headers: { token: localStorage.getItem("token") },
      });

      if (cartResponse.data.message == "session timed out. Please login again") {
        localStorage.removeItem("token");
        deleteToken();
        fetchCart();
        toast.error(cartResponse.data.message);
        return;
      }

      const cart = cartResponse.data.cart;
      const cartItems = cartResponse.data.cart?.CartItems || [];
      const cartItem = cartItems.find((item) => item.product_id === product.id);
      const currentCartQuantity = cartItem ? cartItem.quantity : 0;

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
        localStorage.removeItem("token");
        toast.error(response.data.message);
        fetchCart();
      } else if (response.data.success) {
        toast.success("Added to cart successfully");
        fetchCart();
      } else {
        toast.error(response.data.message);
        fetchCart();
      }
    } catch (err) {
      console.log("Error adding to cart:", err.message);
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
            <div
              key={product.id}
              className="bg-white shadow-md rounded-lg p-5 overflow-hidden transition-transform hover:scale-105 cursor-pointer"
            >
              <div onClick={() => navigate(`/product/${product.id}`)} className="cursor-pointer">
                <img
                  src={`${url}/images/${product?.Product_Images[0]?.image_path}`}
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

export default Home;