import React, { useContext, useEffect, useState } from "react";
import axiosInstance from "../utils/axiosInstance.js";
import { storeContext } from "../context/storeContext.jsx";
import toast from "react-hot-toast";
import { CartContext } from "../context/CartContext.jsx";

const Products = () => {
  const url = "http://127.0.0.1:8000";
  const [products, setProducts] = useState([]);
  const [categories, setCategories] = useState([]);
  const [selectedCategory, setSelectedCategory] = useState("");
  const { token, fetchToken } = useContext(storeContext)
  const { fetchCart, cart } = useContext(CartContext)

  useEffect(() => {
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

  const handleCategoryChange = async (event) => {
    try {
      const categoryId = Number(event.target.value);
      setSelectedCategory(categoryId);

      if (categoryId < 1) {
        fetchProducts(); // Fetch all products if "All Categories" is selected
      } else {
        const response = await axiosInstance.get(`/products?category_id=${categoryId}`);
        setProducts(response.data.data);
      }
    } catch (error) {
      console.error("Error fetching products:", error);
    }
  };

  const addToCart = async (product, quantity) => {
    try {
      if (!token) {
        toast.error("Please log in to add items to your cart.");
        return;
      }

      // Fetch user's cart to check the current quantity of the product
      const cartResponse = await axiosInstance.get("/user/cart", {
        headers: { token },
      });

      const cart = cartResponse.data.cart;
      const cartItems = cartResponse.data.data?.cartItems || [];
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
        { headers: { token } }
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

  const filteredProducts = selectedCategory
    ? products.filter((product) => product.category_id === selectedCategory)
    : products;

  return (
    <div className="p-10 bg-[#f9f9f9] text-black min-h-screen">

      <div className="mb-5">
        <label className="text-black text-lg font-semibold">Select Category</label>
        <select
          value={selectedCategory}
          onChange={handleCategoryChange}
          className="w-full p-2 border border-gray-400 bg-[#f9f9f9] text-black rounded"
        >
          <option value="">All Categories</option>
          {categories.map((category) => (
            <option key={category.id} value={category.id}>
              {category.name}
            </option>
          ))}
        </select>
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-4 lg:grid-cols-5 gap-5">
        {filteredProducts?.map((product) => (
          <div key={product.id} className="bg-gray-200 text-gray-900 rounded-lg overflow-hidden shadow-lg p-4">
            <img
              src={`${url}/images/${product?.Product_Images[0]?.image_path}`}
              alt={product.name}
              className="object-contain h-40 w-full rounded-t-lg"
            />
            <div className="mt-2">
              <h3 className="text-lg font-bold truncate">{product.name}</h3>
              <p className="text-gray-700 text-sm line-clamp-2">{product.description}</p>
              <p className="text-xl text-green-600 font-semibold">₹{product.price}</p>
              <p className="text-sm font-medium">Stock: {product.stock}</p>
            </div>
            <button
              onClick={() => addToCart(product, 1)}
              className="mt-3 w-full bg-blue-500 hover:bg-blue-600 text-white font-semibold py-2 rounded-lg"
            >
              Add to Cart
            </button>
          </div>
        ))}
      </div>
    </div>
  );
};

export default Products;