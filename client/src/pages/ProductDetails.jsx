import React, { useState, useEffect, useContext } from 'react';
import { useParams } from 'react-router-dom';
import axiosInstance from '../utils/axiosInstance';
import { CartContext } from '../context/CartContext.jsx';
import { storeContext } from '../context/StoreContext.jsx';
import toast from 'react-hot-toast';
import { Swiper, SwiperSlide } from 'swiper/react';
import { Navigation, Pagination } from 'swiper/modules';
import 'swiper/css';
import 'swiper/css/navigation';
import 'swiper/css/pagination';

const ProductDetails = () => {
  const { id } = useParams();
  const [product, setProduct] = useState(null);
  const [quantity, setQuantity] = useState(1);
  const { fetchCart } = useContext(CartContext);
  const { deleteToken } = useContext(storeContext);
  const url = "https://ecommerce-project-1-rho.vercel.app";

  useEffect(() => {
    fetchProductDetails();
  }, [id]);

  const fetchProductDetails = async () => {
    try {
      const response = await axiosInstance.get(`/products/${id}`);
      setProduct(response.data.data);
    } catch (error) {
      console.error('Error fetching product details:', error);
      toast.error('Failed to load product details');
    }
  };

  const addToCart = async () => {
    try {
      if (!localStorage.getItem("token")) {
        toast.error("Please log in to add items to your cart.");
        return;
      }

      const cartResponse = await axiosInstance.get("/user/cart", {
        headers: { token: localStorage.getItem("token") },
      });

      if (cartResponse.data.message === "session timed out. Please login again") {
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
        {
          product_id: product.id,
          quantity,
          cart_id: cart.id
        },
        {
          headers: { token: localStorage.getItem("token") }
        }
      );

      if (response.data.message === "session timed out. Please login again") {
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

  if (!product) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="animate-spin rounded-full h-16 w-16 border-t-2 border-b-2 border-blue-500"></div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-[#f9f9f9] py-12 px-4 sm:px-6 lg:px-8">
      <div className="max-w-7xl mx-auto">
        <div className="bg-white rounded-2xl shadow-lg overflow-hidden">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-8 p-8">
            {/* Image Slider */}
            <div className="relative h-[400px] md:h-[500px]">
              <Swiper
                modules={[Navigation, Pagination]}
                navigation
                pagination={{ clickable: true }}
                className="h-full rounded-lg"
              >
                {product.Product_Images && product.Product_Images.map((image, index) => (
                  <SwiperSlide key={index}>
                    <img
                      src={`${image.image_path}`}
                      alt={`${product.name} - Image ${index + 1}`}
                      className="w-full h-full object-contain"
                    />
                  </SwiperSlide>
                ))}
              </Swiper>
            </div>

            {/* Product Details */}
            <div className="flex flex-col justify-between">
              <div>
                <h1 className="text-3xl font-bold text-gray-900 mb-4">{product.name}</h1>
                <p className="text-gray-600 text-lg mb-6">{product.description}</p>
                <div className="border-t border-b py-4 my-6">
                  <div className="flex justify-between items-center mb-4">
                    <span className="text-gray-600">Price</span>
                    <span className="text-3xl font-bold text-green-600">₹{product.price}</span>
                  </div>
                  <div className="flex justify-between items-center">
                    <span className="text-gray-600">Stock</span>
                    <span className={`font-semibold ${product.stock > 0 ? 'text-green-600' : 'text-red-600'}`}>
                      {product.stock > 0 ? `${product.stock} units available` : 'Out of stock'}
                    </span>
                  </div>
                </div>

                {/* Quantity Selector */}                <div className="flex items-center gap-4 mb-6">
                  <span className="text-gray-600">Quantity:</span>
                  <div className="flex items-center border rounded-lg overflow-hidden">
                    <button
                      onClick={() => setQuantity(Math.max(1, quantity - 1))}
                      className="px-3 py-1 border-r hover:bg-gray-100 cursor-pointer"
                    >
                      -
                    </button>
                    <input
                      type="number"
                      value={quantity}
                      onChange={(e) => {
                        const newValue = parseInt(e.target.value) || 1;
                        setQuantity(Math.min(Math.max(1, newValue), product.stock));
                      }}
                      className="w-16 px-2 py-1 text-center focus:outline-none [&::-webkit-outer-spin-button]:appearance-none [&::-webkit-inner-spin-button]:appearance-none"
                      min="1"
                      max={product.stock}
                    />
                    <button
                      onClick={() => setQuantity(Math.min(product.stock, quantity + 1))}
                      className="px-3 py-1 border-l hover:bg-gray-100 cursor-pointer"
                    >
                      +
                    </button>
                  </div>
                </div>
              </div>

              {/* Add to Cart Button */}
              <button
                onClick={addToCart}
                disabled={product.stock === 0}
                className={`w-full py-4 px-8 rounded-lg text-white font-semibold text-lg transition-colors
                  ${product.stock === 0
                    ? 'bg-gray-400 cursor-not-allowed'
                    : 'bg-blue-500 hover:bg-blue-600'}`}
              >
                {product.stock === 0 ? 'Out of Stock' : 'Add to Cart'}
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default ProductDetails;
