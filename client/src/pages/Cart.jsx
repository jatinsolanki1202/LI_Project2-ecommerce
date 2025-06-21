import React, { useContext, useEffect, useState } from "react";
import axiosInstance from "../utils/axiosInstance";
import { storeContext } from "../context/StoreContext.jsx";
import { MdDelete } from "react-icons/md";
import { toast } from "react-hot-toast";
import { CartContext } from "../context/CartContext.jsx";
import { BsPlusCircle, BsDashCircle } from "react-icons/bs";
import { useNavigate } from "react-router-dom";

const Cart = () => {
  const { token, fetchToken, deleteToken } = useContext(storeContext);
  const { fetchCart, cart } = useContext(CartContext);
  const [cartItems, setCartItems] = useState([]);
  const [totalQuantity, setTotalQuantity] = useState(0);
  const [totalAmount, setTotalAmount] = useState(0);
  const [isLoading, setIsLoading] = useState(true);
  const [showModal, setShowModal] = useState(false);
  const [selectedProductId, setSelectedProductId] = useState(null);
  const navigate = useNavigate();

  const fetchCartItems = async () => {
    if (!token) {
      setIsLoading(false);
      return;
    }
    try {
      setIsLoading(true);
      const { data } = await axiosInstance.get("/user/cart", { headers: { token } });
      const items = data.cart?.CartItems || [];
      setCartItems(items);
      calculateTotal(items);
    } catch {
      toast.error("Failed to fetch cart items");
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    fetchToken();
  }, []);

  useEffect(() => {
    fetchCartItems();
  }, [token]);

  useEffect(() => {
    fetchCart();
  }, []);

  const calculateTotal = items => {
    let qty = 0, amt = 0;
    items.forEach(item => {
      qty += item.quantity;
      amt += item.quantity * item.Product.price;
    });
    setTotalQuantity(qty);
    setTotalAmount(amt);
  };

  // const changeQuantity = async (productId, newQty) => {
  //   if (newQty < 1) return;
  //   try {
  //     const resp = await axiosInstance.put("/cart/update", {
  //       cart_id: cart.id, product_id: productId, quantity: newQty
  //     }, { headers: { token } });

  //     if (resp.data.success) {
  //       fetchCartItems();
  //       fetchCart();
  //     } else {
  //       toast.error(resp.data.message);
  //     }
  //   } catch {
  //     toast.error("Could not update quantity");
  //   }
  // };

  const changeQuantity = async (productId, newQty) => {
  if (newQty < 1) return;

  // Optimistic UI update (local state update before API)
  const updatedItems = cartItems.map(item =>
    item.product_id === productId ? { ...item, quantity: newQty } : item
  );
  setCartItems(updatedItems);
  calculateTotal(updatedItems);

  try {
    const resp = await axiosInstance.put("/cart/update", {
      cart_id: cart.id,
      product_id: productId,
      quantity: newQty,
    }, { headers: { token } });

    if (!resp.data.success) {
      toast.error(resp.data.message);
      // Revert if API fails
      fetchCartItems();
    }
  } catch (error) {
    toast.error("Could not update quantity");
    fetchCartItems(); // fallback to accurate state
  }
};


  const confirmRemove = productId => {
    setSelectedProductId(productId);
    setShowModal(true);
  };

  const removeFromCart = async () => {
    try {
      const resp = await axiosInstance.delete(`/cart/remove/${selectedProductId}?cartid=${cart.id}`, { headers: { token } });
      if (resp.data.success) {
        toast.success(resp.data.message);
        fetchCartItems();
        fetchCart();
      } else {
        toast.error(resp.data.message);
      }
    } catch {
      toast.error("Failed to remove item");
    } finally {
      setShowModal(false);
    }
  };

  const handleCheckout = async () => {
    try {
      const resp = await axiosInstance.post("/user/checkout", {}, { headers: { token } });
      if (resp.data.success) {
        navigate("/razorpay-checkout-page", { state: { response: resp.data } });
        fetchCartItems();
        fetchCart();
      } else {
        toast.error(resp.data.message);
      }
    } catch {
      toast.error("Checkout failed");
    }
  };

  if (isLoading) {
    return (
      <div className="min-h-screen flex items-center justify-center text-xl text-gray-700">
        Loading cart...
      </div>
    );
  }

  return (
    <div className="min-h-screen p-4 md:p-8 bg-gray-100">
      <h1 className="text-3xl font-bold mb-6 text-center">Your Shopping Cart</h1>

      {!token ? (
        <p className="text-center text-lg">Please log in to view your cart.</p>
      ) : cartItems.length === 0 ? (
        <p className="text-center text-lg">Your cart is empty.</p>
      ) : (
        <>
          <div className="space-y-4 mb-8">
            {cartItems.map(item => (
              <div key={item.product_id} className="flex flex-col md:flex-row items-center justify-between bg-white p-4 rounded-lg shadow-md space-y-4 md:space-y-0">
                <div className="flex items-center space-x-4 w-full md:w-2/3">
                  <img src={item.Product.Product_Images[0]?.image_path || 'https://img.freepik.com/free-vector/realistic-round-box-mockup_52683-87713.jpg?semt=ais_hybrid&w=740'} alt={item.Product.name} className="h-20 w-20 object-contain rounded-md" />
                  <div className="flex-1">
                    <h2 className="text-lg font-semibold">{item.Product.name}</h2>
                    <p className="text-gray-600">₹{Number(item.Product.price).toFixed(2)} each</p>
                  </div>
                </div>

                <div className="flex items-center space-x-4">
                  <button onClick={() => changeQuantity(item.product_id, item.quantity - 1)} className="text-gray-500 hover:text-gray-800"><BsDashCircle size={24} /></button>
                  <span className="text-lg">{item.quantity}</span>
                  <button onClick={() => changeQuantity(item.product_id, item.quantity + 1)} className="text-gray-500 hover:text-gray-800"><BsPlusCircle size={24} /></button>
                </div>

                <p className="font-semibold text-lg">₹{(Number(item.Product.price) * item.quantity).toFixed(2)}</p>

                <button onClick={() => confirmRemove(item.product_id)} className="text-red-600 hover:text-red-800"><MdDelete size={24} /></button>
              </div>
            ))}
          </div>

          <div className="sticky bottom-0 bg-white p-4 border-t md:flex md:justify-between md:items-center">
            <div className="mb-4 md:mb-0">
              <p>Total Items: <span className="font-semibold">{totalQuantity}</span></p>
              <p>Total Amount: <span className="font-bold text-green-600">₹{totalAmount.toFixed(2)}</span></p>
            </div>
            <button onClick={handleCheckout} className="w-full md:w-auto bg-black hover:bg-gray-700 text-white font-semibold py-3 px-8 rounded-lg">
              Checkout
            </button>
          </div>
        </>
      )}

      {showModal && (
        <div className="fixed inset-0 bg-black bg-opacity-40 flex items-center justify-center">
          <div className="bg-white rounded-lg p-6 w-80 text-center shadow-lg">
            <h2 className="text-xl font-semibold mb-4">Confirm Removal</h2>
            <p className="text-gray-700 mb-6">Remove this item from your cart?</p>
            <div className="flex justify-center space-x-4">
              <button onClick={removeFromCart} className="bg-red-500 hover:bg-red-600 text-white px-4 py-2 rounded-lg">Yes</button>
              <button onClick={() => setShowModal(false)} className="bg-gray-400 hover:bg-gray-500 text-white px-4 py-2 rounded-lg">Cancel</button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default Cart;
