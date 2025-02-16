import React, { useContext, useEffect, useState } from "react";
import axiosInstance from "../utils/axiosInstance";
import { storeContext } from "../context/storeContext";
import { MdDelete } from "react-icons/md";
import { toast } from "react-hot-toast";

const Cart = () => {
  const { token } = useContext(storeContext);
  const [cartItems, setCartItems] = useState([]);
  const [totalQuantity, setTotalQuantity] = useState(0);
  const [totalAmount, setTotalAmount] = useState(0);
  const [isLoading, setIsLoading] = useState(true);

  // Fetch cart items
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

  // Fetch cart items when component mounts and when token updates
  useEffect(() => {
    fetchCartItems();
  }, [token]); // Runs when token changes

  // Calculate totals
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

  // Remove from cart
  const removeFromCart = async (productId) => {
    try {
      const response = await axiosInstance.delete(`/cart/remove/${productId}`, {
        headers: { token },
      });
      if (response.data.success) {
        toast.success(response.data.message);
        fetchCartItems(); // Refresh cart after removal
      }
    } catch (error) {
      console.error("Error removing item from cart:", error);
      toast.error("Failed to remove item from cart");
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
                onClick={() => removeFromCart(item.product_id)}
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
          </div>
        </div>
      )}
    </div>
  );
};

export default Cart;