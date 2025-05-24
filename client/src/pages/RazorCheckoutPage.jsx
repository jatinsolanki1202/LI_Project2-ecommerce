import React, { useState, useEffect } from 'react';
import { useLocation, useNavigate } from "react-router-dom";
import { toast } from 'react-hot-toast';
import axiosInstance from '../utils/axiosInstance';
import { useContext } from 'react';
import { storeContext } from '../context/StoreContext.jsx';
import { loadScript } from '../utils/scriptLoader';
import { CartContext } from '../context/CartContext.jsx';


const RazorCheckoutPage = () => {
  const { token } = useContext(storeContext);
  const { cart, fetchCart } = useContext(CartContext);
  const location = useLocation();
  const navigate = useNavigate()
  const [activeStep, setActiveStep] = useState(1);
  const [addresses, setAddresses] = useState([]);
  const [selectedAddress, setSelectedAddress] = useState({});
  const [address, setAddress] = useState({
    email: '',
    phone: '',
    firstName: '',
    lastName: '',
    street: '',
    apartment: '',
    city: '',
    state: '',
    zip: '',
    country: ''
  });
  const [paymentMethod, setPaymentMethod] = useState('');
  const [isOrderPlaced, setIsOrderPlaced] = useState(false);

  useEffect(() => {
    fetchCart()
  }, [])

  useEffect(() => {
    const fetchAddresses = async () => {
      try {
        const response = await axiosInstance.get('/user/addresses', {
          headers: { token: token }
        });
        if (response.data.success) {
          setAddresses(response?.data.data);
        }
        if (response.data.data?.length === 0) {
          toast.error("No addresses found");
        }
      } catch (error) {
        console.error('Error fetching addresses:', error);
        toast.error('Failed to fetch addresses');
      }
    };
    fetchAddresses();
  }, [token]);

  const handleAddressChange = (e) => {
    setAddress({
      ...address,
      [e.target.name]: e.target.value
    });
  };

  const handleAddressSelection = (e) => {
    const selectedId = e.target.value;
    const selectedAddr = addresses.find(addr => addr.id === parseInt(selectedId, 10));
    setSelectedAddress(selectedAddr || {});

    if (selectedAddr) {
      setAddress({
        email: selectedAddr.email || '',
        phone: selectedAddr.phone || '',
        firstName: selectedAddr.first_name || '',
        lastName: selectedAddr.last_name || '',
        address1: selectedAddr.address1 || '',
        address2: selectedAddr.address2 || '',
        city: selectedAddr.city || '',
        state: selectedAddr.state || '',
        zip: selectedAddr.zip || '',
        country: selectedAddr.country || ''
      });
    } else {
      setAddress({
        email: '',
        phone: '',
        firstName: '',
        lastName: '',
        address1: '',
        address2: '',
        city: '',
        state: '',
        zip: '',
        country: ''
      });
    }
  };

  const isAddressValid = () => {
    const requiredFields = ['email', 'phone', 'firstName', 'lastName', 'street', 'city', 'state', 'zip', 'country'];
    return requiredFields.every(field => address[field]?.trim() !== '');
  };

  const handlePaymentSelection = (method) => {
    setPaymentMethod(method);
  };

  const initializeRazorpay = async () => {
    try {
      const res = await loadScript('https://checkout.razorpay.com/v1/checkout.js');
      if (!res) {
        toast.error('Razorpay SDK failed to load');
        return;
      }

      const options = {
        key: import.meta.env.VITE_RAZORPAY_API_KEY,
        amount: location.state?.response?.data?.amount,
        currency: "INR",
        name: "Shopfinity",
        description: "Payment for your order",
        order_id: location.state.response.data.id,
        // callback_url: "https://fitting-seagull-oddly.ngrok-free.app/razorpay/get-razorpay-res",
        handler: async function (response) {
          try {
            // Verify payment on backend
            const verificationResponse = await axiosInstance.post("/razorpay/get-razorpay-res", { ...response, cartId: cart.id, productId: cart.CartItems.Product }, {
              headers: { token }
            });

            if (verificationResponse.data.success) {
              toast.success("Payment successful! Order placed");
              setIsOrderPlaced(true);
              // Clear cart and redirect to home
              fetchCart();
              navigate('/', { replace: true });
            } else {
              toast.error("Payment verification failed");
            }
          } catch (error) {
            console.error('Payment verification error:', error);
            toast.error("Payment verification failed");
          }
        },
        prefill: {
          name: `${address.firstName} ${address.lastName}`,
          email: address.email,
          contact: address.phone
        },
        theme: {
          color: "#3B82F6"
        }
      };

      const paymentObject = new window.Razorpay(options);
      paymentObject.open();
    } catch (error) {
      console.error('Error:', error);
      toast.error('Something went wrong with the payment');
    }
  };

  const handlePaymentSuccess = async (response) => {
    try {
      console.log(response);

      // Add your payment verification API call here
      const response2 = await axiosInstance.post("/razorpay/get-razorpay-res", response)
      if (response2.data.success) {
        setIsOrderPlaced(true);
        toast.success("Payment successfull. Order placed")
      }

    } catch (error) {
      console.error('Error:', error);
      toast.error('Payment verification failed');
    }
  };

  const handleCashOnDelivery = async () => {
    try {
      // Add your COD order creation API call here
      setIsOrderPlaced(true);
    } catch (error) {
      console.error('Error:', error);
      toast.error('Failed to place COD order');
    }
  };

  const handleContinue = () => {
    if (activeStep === 1) {
      if (!isAddressValid()) {
        toast.error("Please fill all required fields");
        return;
      }
      setActiveStep(2);
    }
  };

  console.log(cart, " ooll");

  return (
    <div className="min-h-screen py-8 flex justify-center items-center">
      <div className="w-full max-w-6xl mx-auto relative">
        <div className="bg-white rounded-lg shadow-lg overflow-hidden mx-4 relative">
          <div className="grid grid-cols-1 md:grid-cols-5">
            <div className="p-6 col-span-3 border-r border-gray-200">
              <div className="flex border-b border-gray-300 mb-6">
                <div className={`pb-2 mr-8 font-medium ${activeStep === 1 ? 'border-b-2 border-black' : 'text-gray-500'}`}>
                  1. Address
                </div>
                <div className={`pb-2 mr-8 font-medium ${activeStep === 2 ? 'border-b-2 border-black' : 'text-gray-500'}`}>
                  2. Payment
                </div>
              </div>

              {activeStep === 1 && (
                <div className="space-y-4">
                  <div className="mb-4">
                    <label className="block text-sm font-medium text-gray-700">Select Address</label>
                    <select
                      className="w-full px-4 py-2 border rounded-lg focus:ring-2 focus:ring-blue-500"
                      value={selectedAddress.id || ''}
                      onChange={handleAddressSelection}
                    >
                      <option value="">Select an address</option>
                      {addresses.map(addr => (
                        <option key={addr.id} value={addr.id}>
                          {`${addr.address1}, ${addr.city}, ${addr.state}, ${addr.zip}`}
                        </option>
                      ))}
                    </select>
                  </div>

                  <div className="space-y-4">
                    <div className="grid grid-cols-2 gap-4">
                      <input
                        type="email"
                        name="email"
                        placeholder="Email address"
                        className="w-full px-4 py-3 border rounded-md focus:ring-blue-500"
                        value={address.email}
                        onChange={handleAddressChange}
                      />
                      <input
                        type="tel"
                        name="phone"
                        placeholder="Phone number"
                        className="w-full px-4 py-3 border rounded-md focus:ring-blue-500"
                        value={address.phone}
                        onChange={handleAddressChange}
                      />
                    </div>

                    <div className="grid grid-cols-2 gap-4">
                      <input
                        type="text"
                        name="firstName"
                        placeholder="First name"
                        className="w-full px-4 py-3 border rounded-md focus:ring-blue-500"
                        value={address.firstName}
                        onChange={handleAddressChange}
                      />
                      <input
                        type="text"
                        name="lastName"
                        placeholder="Last name"
                        className="w-full px-4 py-3 border rounded-md focus:ring-blue-500"
                        value={address.lastName}
                        onChange={handleAddressChange}
                      />
                    </div>

                    <input
                      type="text"
                      name="address1"
                      placeholder="Address 1"
                      className="w-full px-4 py-3 border rounded-md focus:ring-blue-500"
                      value={address.address1}
                      onChange={handleAddressChange}
                    />
                    <input
                      type="text"
                      name="address2"
                      placeholder="Address 2"
                      className="w-full px-4 py-3 border rounded-md focus:ring-blue-500"
                      value={address.address2}
                      onChange={handleAddressChange}
                    />

                    <div className="grid grid-cols-3 gap-4">
                      <input
                        type="text"
                        name="zip"
                        placeholder="ZIP"
                        className="w-full px-4 py-3 border rounded-md focus:ring-blue-500"
                        value={address.zip}
                        onChange={handleAddressChange}
                      />
                      <input
                        type="text"
                        name="city"
                        placeholder="City"
                        className="w-full px-4 py-3 border rounded-md focus:ring-blue-500"
                        value={address.city}
                        onChange={handleAddressChange}
                      />
                      <input
                        type="text"
                        name="state"
                        placeholder="State"
                        className="w-full px-4 py-3 border rounded-md focus:ring-blue-500"
                        value={address.state}
                        onChange={handleAddressChange}
                      />
                    </div>

                    <input
                      type="text"
                      name="country"
                      placeholder="Country"
                      className="w-full px-4 py-3 border rounded-md focus:ring-blue-500"
                      value={address.country}
                      onChange={handleAddressChange}
                    />
                  </div>

                  <button
                    onClick={handleContinue}
                    className="w-full py-3 bg-blue-500 text-white rounded-md hover:bg-blue-600"
                  >
                    Continue to Payment
                  </button>
                </div>
              )}

              {activeStep === 2 && (
                <div className="space-y-6">
                  <h2 className="text-xl font-bold">Select Payment Method</h2>

                  <div className="space-y-4">
                    <div
                      className={`p-4 border rounded-lg cursor-pointer ${paymentMethod === 'cod' ? 'border-blue-500 bg-blue-50' : 'hover:border-gray-400'
                        }`}
                      onClick={() => handlePaymentSelection('cod')}
                    >
                      <div className="flex items-center space-x-3">
                        <input
                          type="radio"
                          checked={paymentMethod === 'cod'}
                          onChange={() => handlePaymentSelection('cod')}
                          className="h-4 w-4 text-blue-500"
                        />
                        <div>
                          <p className="font-medium">Cash on Delivery</p>
                          <p className="text-sm text-gray-500">Pay when you receive</p>
                        </div>
                      </div>
                    </div>

                    <div
                      className={`p-4 border rounded-lg cursor-pointer ${paymentMethod === 'razorpay' ? 'border-blue-500 bg-blue-50' : 'hover:border-gray-400'
                        }`}
                      onClick={() => handlePaymentSelection('razorpay')}
                    >
                      <div className="flex items-center space-x-3">
                        <input
                          type="radio"
                          checked={paymentMethod === 'razorpay'}
                          onChange={() => handlePaymentSelection('razorpay')}
                          className="h-4 w-4 text-blue-500"
                        />
                        <div>
                          <p className="font-medium">Razorpay</p>
                          <p className="text-sm text-gray-500">Pay online securely</p>
                        </div>
                      </div>
                    </div>
                  </div>

                  <div className="flex space-x-4">
                    <button
                      onClick={() => setActiveStep(1)}
                      className="px-6 py-2 border rounded-md hover:bg-gray-50"
                    >
                      Back
                    </button>
                    <button
                      onClick={() => {
                        if (!paymentMethod) {
                          toast.error('Please select a payment method');
                          return;
                        }
                        if (paymentMethod === 'razorpay') {
                          initializeRazorpay();
                        } else {
                          handleCashOnDelivery();
                        }
                      }}
                      className="flex-1 py-2 bg-blue-500 text-white rounded-md hover:bg-blue-600"
                      disabled={!paymentMethod}
                    >
                      {paymentMethod === 'razorpay' ? 'Pay Now' : 'Place Order'}
                    </button>
                  </div>
                </div>
              )}
            </div>

            {/* Order Summary */}
            <div className="col-span-2 bg-gray-50 p-6">
              <h2 className="text-lg font-bold mb-4">Order Summary</h2>
              <div className="space-y-4">
                {/* Cart Items */}
                <div className="space-y-3">
                  {cart?.CartItems?.map((item) => (
                    <div key={item.id} className="flex justify-between items-center py-3 border-b">
                      <div className="flex items-center space-x-4">
                        <img
                          src={`${item.Product.Product_Images?.[0]?.image_path}`}
                          alt={item.Product?.name}
                          className="w-16 h-16 object-cover rounded-md"
                        />
                        <div>
                          <h3 className="font-medium">{item.Product?.name}</h3>
                          <p className="text-sm text-gray-500">Quantity: {item.quantity}</p>
                        </div>
                      </div>
                      <span className="font-medium">₹{item.Product?.price * item.quantity}</span>
                    </div>
                  ))}
                </div>

                {/* Price Details */}
                <div className="space-y-2 pt-4">
                  <div className="flex justify-between text-gray-600">
                    <span>Subtotal</span>
                    <span>₹{cart?.CartItems?.reduce((acc, item) => acc + (item.Product?.price * item.quantity), 0) || 0}</span>
                  </div>
                  <div className="flex justify-between text-gray-600">
                    <span>Tax (GST)</span>
                    <span>₹{cart?.CartItems?.reduce((acc, item) => acc + (item.Product?.price * item.quantity * 0.18), 0).toFixed(2) || 0}</span>
                  </div>
                  <div className="border-t border-gray-200 pt-2 mt-2">
                    <div className="flex justify-between font-bold text-lg">
                      <span>Total</span>
                      <span>₹{(
                        cart?.CartItems?.reduce((acc, item) => acc + (item.Product?.price * item.quantity), 0) +

                        cart?.CartItems?.reduce((acc, item) => acc + (item.Product?.price * item.quantity * 0.18), 0)
                      ).toFixed(2) || 0}</span>
                    </div>
                  </div>
                </div>

                {/* Delivery Details */}
                {activeStep === 2 && (
                  <div className="mt-6 pt-6 border-t border-gray-200">
                    <h3 className="font-medium mb-3">Delivery Address</h3>
                    <div className="text-sm text-gray-600 space-y-1">
                      <p>{address.firstName} {address.lastName}</p>
                      <p>{address.street}</p>
                      <p>{address.city}, {address.state} {address.zip}</p>
                      <p>{address.country}</p>
                      <p>Phone: {address.phone}</p>
                      <p>Email: {address.email}</p>
                    </div>
                  </div>
                )}
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default RazorCheckoutPage;