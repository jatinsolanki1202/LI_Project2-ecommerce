import React, { useState, useEffect } from 'react';
import { useLocation } from "react-router-dom";
import { toast } from 'react-hot-toast';
import axiosInstance from '../utils/axiosInstance';
import { useContext } from 'react';
import { storeContext } from '../context/storeContext';

const RazorCheckoutPage = () => {
  const { token } = useContext(storeContext);
  const location = useLocation();
  const [activeStep, setActiveStep] = useState(1); // 1: Shipping, 2: Delivery, 3: Payment
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
    const fetchAddresses = async () => {
      try {
        const response = await axiosInstance.get('/user/addresses', {
          headers: {
            token: token
          }
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
      const selectedAddr = addresses.find(addr => addr.id == parseInt(selectedId, 10)); // Find the full address object
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
      // Reset the form if no address is selected
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

  const handleContinue = () => {
    if (!isAddressValid()) {
      toast.error("Please fill all required fields");
      return;
    }
    setActiveStep(3); // Skip to payment step
  };

  const isAddressValid = () => {
    const requiredFields = ['email', 'phone', 'firstName', 'lastName', 'street', 'city', 'state', 'zip', 'country'];
    return requiredFields.every(field => address[field]?.trim() !== '');
  };

  return (
    <div className="min-h-screen bg-gray-900 py-8 flex justify-center items-center">
      <div className="w-full max-w-6xl mx-auto relative">
        {/* Background color blocks */}
        <div className="absolute top-0 left-0 w-4/5 h-full bg-blue-400 rounded-lg -z-10"></div>
        <div className="absolute bottom-0 right-0 w-4/5 h-3/4 bg-purple-400 rounded-lg -z-20"></div>

        {/* Main checkout container */}
        <div className="bg-white rounded-lg shadow-lg overflow-hidden mx-4 z-10 relative">
          <div className="grid grid-cols-1 md:grid-cols-5">
            {/* Left Section - Shipping Details - 3 columns */}
            <div className="p-6 col-span-3 border-r border-gray-200">
              <div className="mb-6">
                <img src="/logo.png" alt="Shockwave Audio" className="h-8" />
              </div>

              <div className="flex border-b border-gray-300 mb-6">
                <div className={`pb-2 mr-8 font-medium ${activeStep === 1 ? 'border-b-2 border-black' : 'text-gray-500'}`}>
                  1. Shipping
                </div>
                <div className={`pb-2 mr-8 font-medium ${activeStep === 2 ? 'border-b-2 border-black' : 'text-gray-500'}`}>
                  2. Delivery
                </div>
                <div className={`pb-2 mr-8 font-medium ${activeStep === 3 ? 'border-b-2 border-black' : 'text-gray-500'}`}>
                  3. Payment
                </div>
              </div>

              {/* Address Selection Dropdown */}
              <div className="mb-4">
                <label htmlFor="address" className="block text-sm font-medium text-gray-700">Select Address</label>
                <select
                  id="address"
                  name="address"
                  className="w-full px-4 py-2 border rounded-lg focus:ring-2 focus:ring-blue-500"
                  value={selectedAddress}
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

              {/* Address Form */}
              <form className="space-y-4">
                <div className="grid grid-cols-2 gap-4">
                  <input
                    type="email"
                    name="email"
                    placeholder="Email address"
                    className="w-full px-4 py-3 border border-gray-300 rounded-md bg-gray-50 focus:outline-none focus:ring-1 focus:ring-blue-500"
                    value={address.email}
                    onChange={handleAddressChange}
                  />
                  <input
                    type="tel"
                    name="phone"
                    placeholder="Phone number"
                    className="w-full px-4 py-3 border border-gray-300 rounded-md bg-gray-50 focus:outline-none focus:ring-1 focus:ring-blue-500"
                    value={address.phone}
                    onChange={handleAddressChange}
                  />
                </div>

                <div className="grid grid-cols-2 gap-4">
                  <input
                    type="text"
                    name="firstName"
                    placeholder="First name"
                    className="w-full px-4 py-3 border border-gray-300 rounded-md bg-gray-50 focus:outline-none focus:ring-1 focus:ring-blue-500"
                    value={address.firstName}
                    onChange={handleAddressChange}
                  />
                  <input
                    type="text"
                    name="lastName"
                    placeholder="Last name"
                    className="w-full px-4 py-3 border border-gray-300 rounded-md bg-gray-50 focus:outline-none focus:ring-1 focus:ring-blue-500"
                    value={address.lastName}
                    onChange={handleAddressChange}
                  />
                </div>

                <input
                  type="text"
                  name="street"
                  placeholder="Street address"
                  className="w-full px-4 py-3 border border-gray-300 rounded-md bg-gray-50 focus:outline-none focus:ring-1 focus:ring-blue-500"
                  value={address.address1}
                  onChange={handleAddressChange}
                />

                <input
                  type="text"
                  name="apartment"
                  placeholder="Apartment, Building, Floor"
                  className="w-full px-4 py-3 border border-gray-300 rounded-md bg-gray-50 focus:outline-none focus:ring-1 focus:ring-blue-500"
                  value={address.address2}
                  onChange={handleAddressChange}
                />

                <div className="grid grid-cols-3 gap-4">
                  <input
                    type="text"
                    name="zip"
                    placeholder="Zip"
                    className="w-full px-4 py-3 border border-gray-300 rounded-md bg-gray-50 focus:outline-none focus:ring-1 focus:ring-blue-500"
                    value={address.zip}
                    onChange={handleAddressChange}
                  />
                  <input
                    type="text"
                    name="city"
                    placeholder="City"
                    className="w-full px-4 py-3 border border-gray-300 rounded-md bg-gray-50 focus:outline-none focus:ring-1 focus:ring-blue-500"
                    value={selectedAddress.city ? selectedAddress.city : address.city}
                    onChange={handleAddressChange}
                  />
                  <input
                    type="text"
                    name="state"
                    placeholder="State"
                    className="w-full px-4 py-3 border border-gray-300 rounded-md bg-gray-50 focus:outline-none focus:ring-1 focus:ring-blue-500"
                    value={address.state}
                    onChange={handleAddressChange}
                  />
                </div>

                <input
                  type="text"
                  name="country"
                  placeholder="Country"
                  className="w-full px-4 py-3 border border-gray-300 rounded-md bg-gray-50 focus:outline-none focus:ring-1 focus:ring-blue-500"
                  value={address.country}
                  onChange={handleAddressChange}
                />
              </form>

              <button
                type="button"
                onClick={handleContinue}
                className="w-full bg-black text-white py-3 rounded-md font-medium mt-6 hover:bg-gray-800 transition-colors"
              >
                Continue
              </button>
            </div>

            {/* Right Section - Order Summary */}
            <div className="p-6 col-span-2 bg-gray-50">
              <h2 className="text-xl font-bold mb-6">Order Summary</h2>
              <div className="space-y-6">
                {location.state?.response?.data?.items?.map((item, index) => (
                  <div key={index} className="flex items-center space-x-4">
                    <div className="w-16 h-16 bg-gray-200 rounded flex items-center justify-center">
                      {item.image ? (
                        <img src={item.image} alt={item.name} className="w-full h-full object-cover rounded" />
                      ) : (
                        <svg className="w-6 h-6 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M4 16l4.586-4.586a2 2 0 012.828 0L16 16m-2-2l1.586-1.586a2 2 0 012.828 0L20 14m-6-6h.01M6 20h12a2 2 0 002-2V6a2 2 0 00-2-2H6a2 2 0 00-2 2v12a2 2 0 002 2z" />
                        </svg>
                      )}
                    </div>
                    <div className="flex-1">
                      <h3 className="font-medium">{item.name}</h3>
                      <p className="text-gray-600">Quantity: {item.quantity}</p>
                    </div>
                    <div className="font-medium">₹{item.price}</div>
                  </div>
                ))}
              </div>

              <div className="border-t border-gray-200 pt-4">
                <div className="flex justify-between py-1">
                  <span className="text-gray-600">Subtotal</span>
                  <span>₹{location.state?.response?.data?.amount / 100}</span>
                </div>
                <div className="flex justify-between py-1">
                  <span className="text-gray-600">Delivery</span>
                  <span>₹0.00</span>
                </div>
                <div className="flex justify-between py-1">
                  <span className="text-gray-600">Taxes</span>
                  <span>₹0.00</span>
                </div>
                <div className="flex justify-between py-2 font-medium">
                  <span>Total</span>
                  <span>₹{location.state?.response?.data?.amount / 100}</span>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>

      {isOrderPlaced && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center">
          <div className="bg-white p-6 rounded-lg shadow-lg text-center">
            <h2 className="text-2xl font-bold mb-4">Order Placed Successfully!</h2>
            <p className="text-gray-600 mb-4">Thank you for shopping with us.</p>
            <button
              onClick={() => window.location.href = '/'}
              className="bg-blue-600 text-white px-6 py-2 rounded-lg hover:bg-blue-700"
            >
              Continue Shopping
            </button>
          </div>
        </div>
      )}
    </div>
  );
};

export default RazorCheckoutPage;