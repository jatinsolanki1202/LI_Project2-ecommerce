import React, { useContext, useEffect, useState } from "react";
import axiosInstance from "../utils/axiosInstance";
import { storeContext } from "../context/storeContext";
import { MdDelete } from "react-icons/md";
import { toast } from "react-hot-toast";

const Cart = () => {
  const { token, fetchToken } = useContext(storeContext);
  const [cartItems, setCartItems] = useState([]);
  const [totalQuantity, setTotalQuantity] = useState(0);
  const [totalAmount, setTotalAmount] = useState(0);
  const [isLoading, setIsLoading] = useState(true);
  const [showModal, setShowModal] = useState(false);
  const [selectedProductId, setSelectedProductId] = useState(null);

  const fetchCartItems = async () => {
    if (!token) {
      setIsLoading(false);
      return;
    }

    try {
      setIsLoading(true);
      const response = await axiosInstance.get("/user/cart", {
        headers: { token },
      });
      const cartData = response.data.cart || [];
      setCartItems(cartData);
      calculateTotal(cartData);
    } catch (error) {
      console.error("Error fetching cart items:", error);
      toast.error("Failed to fetch cart items");
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    fetchToken()
    fetchCartItems();
  }, [token]);

  const calculateTotal = (items) => {
    let totalQty = 0;
    let totalAmt = 0;
    items.forEach((item) => {
      totalQty += item.quantity;
      totalAmt += item.quantity * item.Product.price;
    });
    setTotalQuantity(totalQty);
    setTotalAmount(totalAmt);
  };

  const confirmRemoveFromCart = (productId) => {
    setSelectedProductId(productId);
    setShowModal(true);
  };

  const removeFromCart = async () => {
    try {
      const response = await axiosInstance.delete(`/cart/remove/${selectedProductId}`, {
        headers: { token },
      });

      if (response.data.message === "session timed out. Please login again") {
        localStorage.removeItem("token");
        toast.error(response.data.message);
        fetchCartItems();
      } else if (response.data.success) {
        toast.success(response.data.message);
        fetchCartItems();
      } else {
        toast.error(response.data.message);
      }
    } catch (error) {
      console.error("Error removing item from cart:", error);
      toast.error("Failed to remove item from cart");
    } finally {
      setShowModal(false);
      setSelectedProductId(null);
    }
  };

  const handleCheckout = async () => {
    try {
      const response = await axiosInstance.post("/user/checkout", {}, {
        headers: { token }
      });
      if (response.data.success) {
        toast.success("Order placed successfully!");
        fetchCartItems();
      } else {
        toast.error(response.data.message || "Checkout failed");
      }
    } catch (error) {
      console.error("Error during checkout:", error);
      toast.error("Checkout failed. Please try again.");
    }
  };

  if (isLoading) {
    return (
      <div className="p-5 bg-gray-900 min-h-screen text-white flex items-center justify-center">
        <div className="text-xl">Loading cart...</div>
      </div>
    );
  }

  return (
    <div className="p-5 bg-gray-900 min-h-screen text-white">
      <h1 className="text-3xl font-bold mb-5">Shopping Cart</h1>
      {!token ? (
        <p className="text-lg">Please log in to view your cart</p>
      ) : cartItems.length === 0 ? (
        <p className="text-lg">Your cart is empty</p>
      ) : (
        <div className="space-y-4">
          {cartItems.map((item) => (
            <div
              key={item.product_id}
              className="flex items-center justify-between gap-2 bg-gray-200 text-gray-900 p-4 rounded-lg"
            >
              <img
                src={`http://127.0.0.1:8000/images/${item.Product.Product_Images[0]?.image_path}`}
                alt={item.Product.name}
                className="h-16 w-16 object-cover rounded"
              />
              <div className="flex-1 ml-4">
                <h3 className="text-lg font-semibold">{item.Product.name}</h3>
                <p className="text-sm text-gray-700">
                  ₹{item.Product.price} x {item.quantity}
                </p>
              </div>
              <p className="text-lg font-bold">
                ₹{item.Product.price * item.quantity}
              </p>
              <button
                onClick={() => confirmRemoveFromCart(item.product_id)}
                className="bg-red-500 hover:bg-red-700 cursor-pointer rounded-full text-white px-3 py-3"
              >
                <MdDelete />
              </button>
            </div>
          ))}
          <div className="p-4 bg-gray-800 text-white rounded-lg mt-5">
            <h2 className="text-xl font-bold">Cart Summary</h2>
            <p className="mt-2">
              Total Items: <span className="font-semibold">{totalQuantity}</span>
            </p>
            <p className="mt-1 text-lg">
              Total Amount:{" "}
              <span className="font-bold text-green-400">₹{totalAmount}</span>
            </p>
            <button
              onClick={handleCheckout}
              className="w-full bg-green-500 hover:bg-green-600 text-white text-lg font-semibold py-2 mt-4 rounded-lg"
            >
              Checkout
            </button>
          </div>
        </div>
      )}

      {/* Confirmation Modal */}
      {showModal && (
        <div className="fixed inset-0 flex items-center justify-center bg-black bg-opacity-50">
          <div className="bg-white p-6 rounded-lg shadow-lg w-96 text-center">
            <h2 className="text-xl font-semibold mb-4 text-gray-900">
              Confirm Deletion
            </h2>
            <p className="text-gray-700">Are you sure you want to remove this item from your cart?</p>
            <div className="mt-5 flex justify-center gap-4">
              <button
                onClick={removeFromCart}
                className="bg-red-500 hover:bg-red-700 text-white font-bold py-2 px-4 rounded-lg"
              >
                Yes, Remove
              </button>
              <button
                onClick={() => setShowModal(false)}
                className="bg-gray-500 hover:bg-gray-700 text-white font-bold py-2 px-4 rounded-lg"
              >
                Cancel
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default Cart;
