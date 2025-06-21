// import React, { useState, useEffect } from 'react';
// import { useLocation, useNavigate } from "react-router-dom";
// import { toast } from 'react-hot-toast';
// import axiosInstance from '../utils/axiosInstance';
// import { useContext } from 'react';
// import { storeContext } from '../context/StoreContext.jsx';
// import { loadScript } from '../utils/scriptLoader';
// import { CartContext } from '../context/CartContext.jsx';
// import validator from 'validator';


// const RazorCheckoutPage = () => {
//   const { token } = useContext(storeContext);
//   const { cart, fetchCart } = useContext(CartContext);
//   const location = useLocation();
//   const navigate = useNavigate();
//   const [activeStep, setActiveStep] = useState(1);
//   const [addresses, setAddresses] = useState([]);
//   const [selectedAddress, setSelectedAddress] = useState({});
//   const [address, setAddress] = useState({
//     phone: '',
//     full_name: '',
//     address1: '',
//     address2: '',
//     city: '',
//     state: '',
//     zip: '',
//     country: '',
//     email: ''
//   });
//   const [paymentMethod, setPaymentMethod] = useState('');
//   const [isOrderPlaced, setIsOrderPlaced] = useState(false);
  
//   const [email, setEmail] = useState('');
//   useEffect(() => {
//     fetchAddresses()
//     fetchCart();
//   }, []);

//   useEffect(() => {
//   if (addresses.length > 0 && addresses[0]?.email) {
//     console.log(addresses[0].email);
    
//     setEmail(addresses[0].email);
//   }
// }, [addresses]);

//   const fetchAddresses = async () => {
//     try {
//       const response = await axiosInstance.get('/user/addresses', {
//         headers: { token: token }
//       });
//       if (response.data.success) {
//         setAddresses(response?.data.data);
//       }
//       if (response.data.data?.length === 0) {
//         toast.error("No addresses found");
//       }
//     } catch (error) {
//       console.error('Error fetching addresses:', error);
//       toast.error('Failed to fetch addresses');
//     }
//   };
//   useEffect(() => {
//     fetchAddresses();
//   }, [token]);


//   const handleAddressChange = (e) => {
//     setAddress({
//       ...address,
//       [e.target.name]: e.target.value
//     });
//   };

//   const handleAddressSelection = (e) => {
//     const selectedId = e.target.value;
//     const selectedAddr = addresses.find(addr => addr.id === parseInt(selectedId, 10));
//     setSelectedAddress(selectedAddr || {});

//     if (selectedAddr) {
//       setAddress({
//         email: selectedAddr.email || '',
//         phone: selectedAddr.phone || '',
//         full_name: selectedAddr.full_name || '',
//         address1: selectedAddr.address1 || '',
//         address2: selectedAddr.address2 || '',
//         city: selectedAddr.city || '',
//         state: selectedAddr.state || '',
//         zip: selectedAddr.zip || '',
//         country: selectedAddr.country || ''
//       });
//     } else {
//       setAddress({
//         email: '',
//         phone: '',
//         full_name: '',
//         address1: '',
//         address2: '',
//         city: '',
//         state: '',
//         zip: '',
//         country: ''
//       });
//     }
//   };

//   const isAddressValid = () => {
//     const { full_name, email, phone, address1, city, state, zip, country } = address;
//     if (!full_name || !email || !phone || !address1 || !city || !state || !zip || !country) {
//       return false;
//     }
//     if (!validator.isEmail(email)) return false;
//     if (!/^[0-9]{10}$/.test(phone)) return false;
//     return true;
//   };

//   const handlePaymentSelection = (method) => {
//     setPaymentMethod(method);
//   };

//   const initializeRazorpay = async () => {
//     try {
//       const res = await loadScript('https://checkout.razorpay.com/v1/checkout.js');
//       if (!res) {
//         toast.error('Razorpay SDK failed to load');
//         return;
//       }

//       const options = {
//         key: import.meta.env.VITE_RAZORPAY_API_KEY,
//         amount: location.state?.response?.data?.amount,
//         currency: "INR",
//         name: "Shopfinity",
//         description: "Payment for your order",
//         order_id: location.state.response.data.id,
//         handler: async function (response) {
//           try {
//             const verificationResponse = await axiosInstance.post("/razorpay/get-razorpay-res", { ...response, cartId: cart.id, productId: cart.CartItems.Product }, {
//               headers: { token }
//             });

//             if (verificationResponse.data.success) {
//               toast.success("Payment successful! Order placed");
//               setIsOrderPlaced(true);
//               fetchCart();
//               navigate('/', { replace: true });
//             } else {
//               toast.error("Payment verification failed");
//             }
//           } catch (error) {
//             console.error('Payment verification error:', error);
//             toast.error("Payment verification failed");
//           }
//         },
//         prefill: {
//           name: `${address.full_name}`,
//           email: address.email,
//           contact: address.phone
//         },
//         theme: {
//           color: "#3B82F6"
//         }
//       };

//       const paymentObject = new window.Razorpay(options);
//       paymentObject.open();
//     } catch (error) {
//       console.error('Error:', error);
//       toast.error('Something went wrong with the payment');
//     }
//   };

//   const handleCashOnDelivery = async () => {
//     try {
//       let order = await axiosInstance.post('/user/place-cod-order', { }, {
//         headers: { token }
//       })

//       if(order.data.success) {
//         toast.success("Order placed successfully!");
//         setIsOrderPlaced(true);
//         fetchCart();
//         navigate('/', { replace: true });
//       } else {
//         toast.error("Failed to place order");
//       }
//     } catch (error) {
//       console.error('Error:', error);
//       toast.error('Failed to place COD order');
//     }
//   };

//   const handleContinue = () => {
//     if (activeStep === 1) {
//       if (!isAddressValid()) {
//         toast.error("Please fill all fields correctly");
//         return;
//       }
//       setActiveStep(2);
//     }
//   };



//   return (
//     <div className="min-h-screen py-8 flex justify-center items-center">
//       <div className="w-full max-w-6xl mx-auto relative">
//         <div className="bg-white rounded-lg shadow-lg overflow-hidden mx-4 relative">
//           <div className="grid grid-cols-1 md:grid-cols-5">
//             <div className="p-6 col-span-3 border-r border-gray-200">
//               <div className="flex border-b border-gray-300 mb-6">
//                 <div className={`pb-2 mr-8 font-medium ${activeStep === 1 ? 'border-b-2 border-black' : 'text-gray-500'}`}>
//                   1. Address
//                 </div>
//                 <div className={`pb-2 mr-8 font-medium ${activeStep === 2 ? 'border-b-2 border-black' : 'text-gray-500'}`}>
//                   2. Payment
//                 </div>
//               </div>

//               {activeStep === 1 && (
//                 <div className="space-y-4">
//                   <div className="mb-4">
//                     <label className="block text-sm font-medium text-gray-700">Select Address</label>
//                     <select
//                       className="w-full px-4 py-2 border rounded-lg focus:ring-2 focus:ring-blue-500"
//                       value={selectedAddress.id || ''}
//                       onChange={handleAddressSelection}
//                     >
//                       <option value="">Select an address</option>
//                       {addresses.map(addr => (
//                         <option key={addr.id} value={addr.id}>
//                           {`${addr.address1}, ${addr.city}, ${addr.state}, ${addr.zip}`}
//                         </option>
//                       ))}
//                     </select>
//                   </div>

//                   <input
//                     type="text"
//                     name="name"
//                     placeholder="Full Name"
//                     className="w-full px-4 py-3 border rounded-md focus:ring-blue-500"
//                     value={address.full_name}
//                     onChange={handleAddressChange}
//                   />

//                   <div className="space-y-4">
//                     <div className="grid grid-cols-2 gap-4">
//                       <input
//                         type="email"
//                         name="email"
//                         placeholder="Email address"
//                         className="w-full px-4 py-3 border rounded-md focus:ring-blue-500 text-gray-500"
//                         value={email}
//                         onChange={handleAddressChange}
//                         disabled
//                       />
//                       <input
//                         type="tel"
//                         name="phone"
//                         placeholder="Phone number"
//                         className="w-full px-4 py-3 border rounded-md focus:ring-blue-500"
//                         value={address.phone}
//                         onChange={handleAddressChange}
//                       />
//                     </div>

//                     <input
//                       type="text"
//                       name="address1"
//                       placeholder="Address 1"
//                       className="w-full px-4 py-3 border rounded-md focus:ring-blue-500"
//                       value={address.address1}
//                       onChange={handleAddressChange}
//                     />
//                     <input
//                       type="text"
//                       name="address2"
//                       placeholder="Address 2"
//                       className="w-full px-4 py-3 border rounded-md focus:ring-blue-500"
//                       value={address.address2}
//                       onChange={handleAddressChange}
//                     />

//                     <div className="grid grid-cols-3 gap-4">
//                       <input
//                         type="text"
//                         name="zip"
//                         placeholder="ZIP"
//                         className="w-full px-4 py-3 border rounded-md focus:ring-blue-500"
//                         value={address.zip}
//                         onChange={handleAddressChange}
//                       />
//                       <input
//                         type="text"
//                         name="city"
//                         placeholder="City"
//                         className="w-full px-4 py-3 border rounded-md focus:ring-blue-500"
//                         value={address.city}
//                         onChange={handleAddressChange}
//                       />
//                       <input
//                         type="text"
//                         name="state"
//                         placeholder="State"
//                         className="w-full px-4 py-3 border rounded-md focus:ring-blue-500"
//                         value={address.state}
//                         onChange={handleAddressChange}
//                       />
//                     </div>

//                     <input
//                       type="text"
//                       name="country"
//                       placeholder="Country"
//                       className="w-full px-4 py-3 border rounded-md focus:ring-blue-500"
//                       value={address.country}
//                       onChange={handleAddressChange}
//                     />
//                   </div>

//                   <button
//                     onClick={handleContinue}
//                     className="w-full py-3 bg-blue-500 text-white rounded-md hover:bg-blue-600"
//                   >
//                     Continue to Payment
//                   </button>
//                 </div>
//               )}

//               {activeStep === 2 && (
//                 <div className="space-y-6">
//                   <h2 className="text-xl font-bold">Select Payment Method</h2>

//                   <div className="space-y-4">
//                     <div
//                       className={`p-4 border rounded-lg cursor-pointer ${paymentMethod === 'cod' ? 'border-blue-500 bg-blue-50' : 'hover:border-gray-400'
//                         }`}
//                       onClick={() => handlePaymentSelection('cod')}
//                     >
//                       <div className="flex items-center space-x-3">
//                         <input
//                           type="radio"
//                           checked={paymentMethod === 'cod'}
//                           onChange={() => handlePaymentSelection('cod')}
//                           className="h-4 w-4 text-blue-500"
//                         />
//                         <div>
//                           <p className="font-medium">Cash on Delivery</p>
//                           <p className="text-sm text-gray-500">Pay when you receive</p>
//                         </div>
//                       </div>
//                     </div>

//                     <div
//                       className={`p-4 border rounded-lg cursor-pointer ${paymentMethod === 'razorpay' ? 'border-blue-500 bg-blue-50' : 'hover:border-gray-400'
//                         }`}
//                       onClick={() => handlePaymentSelection('razorpay')}
//                     >
//                       <div className="flex items-center space-x-3">
//                         <input
//                           type="radio"
//                           checked={paymentMethod === 'razorpay'}
//                           onChange={() => handlePaymentSelection('razorpay')}
//                           className="h-4 w-4 text-blue-500"
//                         />
//                         <div>
//                           <p className="font-medium">Razorpay</p>
//                           <p className="text-sm text-gray-500">Pay online securely</p>
//                         </div>
//                       </div>
//                     </div>
//                   </div>

//                   <div className="flex space-x-4">
//                     <button
//                       onClick={() => setActiveStep(1)}
//                       className="px-6 py-2 border rounded-md hover:bg-gray-50"
//                     >
//                       Back
//                     </button>
//                     <button
//                       onClick={() => {
//                         if (!paymentMethod) {
//                           toast.error('Please select a payment method');
//                           return;
//                         }
//                         if (paymentMethod === 'razorpay') {
//                           initializeRazorpay();
//                         } else {
//                           handleCashOnDelivery();
//                         }
//                       }}
//                       className="flex-1 py-2 bg-blue-500 text-white rounded-md hover:bg-blue-600"
//                       disabled={!paymentMethod}
//                     >
//                       {paymentMethod === 'razorpay' ? 'Pay Now' : 'Place Order'}
//                     </button>
//                   </div>
//                 </div>
//               )}
//             </div>

//             {/* Order Summary */}
//             <div className="col-span-2 bg-gray-50 p-6">
//               <h2 className="text-lg font-bold mb-4">Order Summary</h2>
//               <div className="space-y-4">
//                 {/* Cart Items */}
//                 <div className="space-y-3">
//                   {cart?.CartItems?.map((item) => (
//                     <div key={item.id} className="flex justify-between items-center py-3 border-b">
//                       <div className="flex items-center space-x-4">
//                         <img
//                           src={`${item.Product.Product_Images?.[0]?.image_path}`}
//                           alt={item.Product?.name}
//                           className="w-16 h-16 object-cover rounded-md"
//                         />
//                         <div>
//                           <h3 className="font-medium">{item.Product?.name}</h3>
//                           <p className="text-sm text-gray-500">Quantity: {item.quantity}</p>
//                         </div>
//                       </div>
//                       <span className="font-medium">₹{item.Product?.price * item.quantity}</span>
//                     </div>
//                   ))}
//                 </div>

//                 {/* Price Details */}
//                 <div className="space-y-2 pt-4">
//                   <div className="flex justify-between text-gray-600">
//                     <span>Subtotal</span>
//                     <span>₹{cart?.CartItems?.reduce((acc, item) => acc + (item.Product?.price * item.quantity), 0) || 0}</span>
//                   </div>
//                   <div className="flex justify-between text-gray-600">
//                     <span>Tax (GST)</span>
//                     <span>₹{cart?.CartItems?.reduce((acc, item) => acc + (item.Product?.price * item.quantity * 0.18), 0).toFixed(2) || 0}</span>
//                   </div>
//                   <div className="border-t border-gray-200 pt-2 mt-2">
//                     <div className="flex justify-between font-bold text-lg">
//                       <span>Total</span>
//                       <span>₹{(
//                         cart?.CartItems?.reduce((acc, item) => acc + (item.Product?.price * item.quantity), 0) +

//                         cart?.CartItems?.reduce((acc, item) => acc + (item.Product?.price * item.quantity * 0.18), 0)
//                       ).toFixed(2) || 0}</span>
//                     </div>
//                   </div>
//                 </div>

//                 {/* Delivery Details */}
//                 {activeStep === 2 && (
//                   <div className="mt-6 pt-6 border-t border-gray-200">
//                     <h3 className="font-medium mb-3">Delivery Address</h3>
//                     <div className="text-sm text-gray-600 space-y-1">
//                       <p>{address.firstName} {address.lastName}</p>
//                       <p>{address.street}</p>
//                       <p>{address.city}, {address.state} {address.zip}</p>
//                       <p>{address.country}</p>
//                       <p>Phone: {address.phone}</p>
//                       <p>Email: {address.email}</p>
//                     </div>
//                   </div>
//                 )}
//               </div>
//             </div>
//           </div>
//         </div>
//       </div>
//     </div>
//   );
// };

// export default RazorCheckoutPage;

// -------------------------------------------------------

import React, { useState, useEffect } from 'react';
import { useLocation, useNavigate } from "react-router-dom";
import { toast } from 'react-hot-toast';
import axiosInstance from '../utils/axiosInstance';
import { useContext } from 'react';
import { storeContext } from '../context/StoreContext.jsx';
import { loadScript } from '../utils/scriptLoader';
import { CartContext } from '../context/CartContext.jsx';
import validator from 'validator';
import { Country, State, City } from 'country-state-city';

const RazorCheckoutPage = () => {
  const { token } = useContext(storeContext);
  const { cart, fetchCart } = useContext(CartContext);
  const location = useLocation();
  const navigate = useNavigate();
  const [activeStep, setActiveStep] = useState(1);
  const [addresses, setAddresses] = useState([]);
  const [selectedAddress, setSelectedAddress] = useState({});
  const [address, setAddress] = useState({
    phone: '',
    full_name: '',
    address1: '',
    address2: '',
    city: '',
    state: '',
    zip: '',
    country: '',
    email: ''
  });
  const [paymentMethod, setPaymentMethod] = useState('');
  const [isOrderPlaced, setIsOrderPlaced] = useState(false);
  
  // Validation errors state
  const [errors, setErrors] = useState({});
  
  // Location data
  const [countries, setCountries] = useState([]);
  const [states, setStates] = useState([]);
  const [cities, setCities] = useState([]);
  const [selectedCountry, setSelectedCountry] = useState('');
  const [selectedState, setSelectedState] = useState('');

  useEffect(() => {
    fetchAddresses()
    fetchCart();
    // Load countries
    setCountries(Country.getAllCountries());
  }, []);

  useEffect(() => {
    if (addresses.length > 0 && addresses[0]?.email) {
      console.log(addresses[0].email);
      // Set the email from the first address if no address is selected
      if (!selectedAddress.id) {
        setAddress(prev => ({
          ...prev,
          email: addresses[0].email
        }));
      }
    }
  }, [addresses, selectedAddress]);

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

  useEffect(() => {
    fetchAddresses();
  }, [token]);

  // Validation functions
  const validateField = (name, value) => {
    let error = '';
    
    switch (name) {
      case 'full_name':
        if (!value.trim()) {
          error = 'Full name is required';
        } else if (value.trim().length < 2) {
          error = 'Full name must be at least 2 characters';
        } else if (!/^[a-zA-Z\s]+$/.test(value)) {
          error = 'Full name can only contain letters and spaces';
        }
        break;
        
      case 'email':
        if (!value.trim()) {
          error = 'Email is required';
        } else if (!validator.isEmail(value)) {
          error = 'Please enter a valid email address';
        }
        break;
        
      case 'phone':
        if (!value.trim()) {
          error = 'Phone number is required';
        } else if (!/^[0-9]{10}$/.test(value)) {
          error = 'Phone number must be exactly 10 digits';
        }
        break;
        
      case 'address1':
        if (!value.trim()) {
          error = 'Address line 1 is required';
        } else if (value.trim().length < 5) {
          error = 'Address must be at least 5 characters';
        }
        break;
        
      case 'city':
        if (!value.trim()) {
          error = 'City is required';
        }
        break;
        
      case 'state':
        if (!value.trim()) {
          error = 'State is required';
        }
        break;
        
      case 'zip':
        if (!value.trim()) {
          error = 'ZIP code is required';
        } else if (!/^[0-9]{6}$/.test(value)) {
          error = 'ZIP code must be exactly 6 digits';
        }
        break;
        
      case 'country':
        if (!value.trim()) {
          error = 'Country is required';
        }
        break;
        
      default:
        break;
    }
    
    return error;
  };

  const handleAddressChange = (e) => {
    const { name, value } = e.target;
    
    // Update address state
    setAddress(prev => ({
      ...prev,
      [name]: value
    }));
    
    // Validate field and update errors
    const error = validateField(name, value);
    setErrors(prev => ({
      ...prev,
      [name]: error
    }));
  };

  const handleCountryChange = (e) => {
    const countryCode = e.target.value;
    const country = countries.find(c => c.isoCode === countryCode);
    
    setSelectedCountry(countryCode);
    setSelectedState('');
    setAddress(prev => ({
      ...prev,
      country: country ? country.name : '',
      state: '',
      city: ''
    }));
    
    // Load states for selected country
    if (countryCode) {
      setStates(State.getStatesOfCountry(countryCode));
      setCities([]);
    } else {
      setStates([]);
      setCities([]);
    }
    
    // Validate
    const error = validateField('country', country ? country.name : '');
    setErrors(prev => ({
      ...prev,
      country: error
    }));
  };

  const handleStateChange = (e) => {
    const stateCode = e.target.value;
    const state = states.find(s => s.isoCode === stateCode);
    
    setSelectedState(stateCode);
    setAddress(prev => ({
      ...prev,
      state: state ? state.name : '',
      city: ''
    }));
    
    // Load cities for selected state
    if (stateCode && selectedCountry) {
      setCities(City.getCitiesOfState(selectedCountry, stateCode));
    } else {
      setCities([]);
    }
    
    // Validate
    const error = validateField('state', state ? state.name : '');
    setErrors(prev => ({
      ...prev,
      state: error
    }));
  };

  const handleCityChange = (e) => {
    const cityName = e.target.value;
    
    setAddress(prev => ({
      ...prev,
      city: cityName
    }));
    
    // Validate
    const error = validateField('city', cityName);
    setErrors(prev => ({
      ...prev,
      city: error
    }));
  };

  const handleAddressSelection = (e) => {
    const selectedId = e.target.value;
    
    if (selectedId === '') {
      // User selected "Select an address" option - clear the form
      setSelectedAddress({});
      setAddress({
        phone: '',
        full_name: '',
        address1: '',
        address2: '',
        city: '',
        state: '',
        zip: '',
        country: '',
        email: addresses.length > 0 ? addresses[0].email : ''
      });
      setErrors({});
      setSelectedCountry('');
      setSelectedState('');
      setStates([]);
      setCities([]);
      return;
    }

    const selectedAddr = addresses.find(addr => addr.id === parseInt(selectedId, 10));
    setSelectedAddress(selectedAddr || {});

    if (selectedAddr) {
      // Find country and state codes for dropdowns
      const country = countries.find(c => c.name === selectedAddr.country);
      const countryCode = country ? country.isoCode : '';
      
      setSelectedCountry(countryCode);
      
      if (countryCode) {
        const countryStates = State.getStatesOfCountry(countryCode);
        setStates(countryStates);
        
        const state = countryStates.find(s => s.name === selectedAddr.state);
        const stateCode = state ? state.isoCode : '';
        setSelectedState(stateCode);
        
        if (stateCode) {
          setCities(City.getCitiesOfState(countryCode, stateCode));
        }
      }
      
      setAddress({
        phone: selectedAddr.phone || '',
        full_name: selectedAddr.full_name || '',
        address1: selectedAddr.address1 || '',
        address2: selectedAddr.address2 || '',
        city: selectedAddr.city || '',
        state: selectedAddr.state || '',
        zip: selectedAddr.zip || '',
        country: selectedAddr.country || '',
        email: selectedAddr.email || (addresses.length > 0 ? addresses[0].email : '')
      });
      
      // Clear errors when address is selected
      setErrors({});
    }
  };

  const isAddressValid = () => {
    const { full_name, email, phone, address1, city, state, zip, country } = address;
    
    // Check if all required fields are filled
    if (!full_name || !email || !phone || !address1 || !city || !state || !zip || !country) {
      return false;
    }
    
    // Check if there are any validation errors
    const hasErrors = Object.values(errors).some(error => error !== '');
    if (hasErrors) {
      return false;
    }
    
    // Final validation
    if (!validator.isEmail(email)) return false;
    if (!/^[0-9]{10}$/.test(phone)) return false;
    if (!/^[0-9]{6}$/.test(zip)) return false;
    
    return true;
  };

  const handlePaymentSelection = (method) => {
    setPaymentMethod(method);
  };

  const initializeRazorpay = async () => {  
    try {
      if(Object.keys(selectedAddress).length == 0) {        
        await axiosInstance.post('/user/add-address', address,{
          headers: { token }
        })
      }

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
        handler: async function (response) {
          try {
            const verificationResponse = await axiosInstance.post("/razorpay/get-razorpay-res", { ...response, cartId: cart.id, productId: cart.CartItems.Product }, {
              headers: { token }
            });

            if (verificationResponse.data.success) {
              toast.success("Payment successful! Order placed");
              setIsOrderPlaced(true);
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
          name: `${address.full_name}`,
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

  const handleCashOnDelivery = async () => {
    try {      
      if(Object.keys(selectedAddress).length == 0) {        
        await axiosInstance.post('/user/add-address', address,{
          headers: { token }
        })
      }
      let order = await axiosInstance.post('/user/place-cod-order', { }, {
        headers: { token }
      })

      if(order.data.success) {
        toast.success("Order placed successfully!");
        setIsOrderPlaced(true);
        fetchCart();
        navigate('/', { replace: true });
      } else {
        toast.error("Failed to place order");
      }
    } catch (error) {
      console.error('Error:', error);
      toast.error('Failed to place COD order');
    }
  };

  const handleContinue = () => {
    if (activeStep === 1) {
      // Validate all fields before continuing
      const newErrors = {};
      Object.keys(address).forEach(key => {
        if (key !== 'address2') { // address2 is optional
          const error = validateField(key, address[key]);
          if (error) {
            newErrors[key] = error;
          }
        }
      });
      
      setErrors(newErrors);
      
      if (!isAddressValid() || Object.keys(newErrors).length > 0) {
        toast.error("Please fix all validation errors before continuing");
        return;
      }
      setActiveStep(2);
    }
  };

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

                  <div>
                    <input
                      type="text"
                      name="full_name"
                      placeholder="Full Name *"
                      className={`w-full px-4 py-3 border rounded-md focus:ring-blue-500 ${
                        errors.full_name ? 'border-red-500 focus:ring-red-500' : 'focus:ring-blue-500'
                      }`}
                      value={address.full_name}
                      onChange={handleAddressChange}
                    />
                    {errors.full_name && (
                      <p className="text-red-500 text-sm mt-1">{errors.full_name}</p>
                    )}
                  </div>

                  <div className="grid grid-cols-2 gap-4">
                    <div>
                      <input
                        type="email"
                        name="email"
                        placeholder="Email address *"
                        className="w-full px-4 py-3 border rounded-md bg-gray-100 text-gray-600"
                        value={address.email}
                        onChange={handleAddressChange}
                        readOnly
                      />
                    </div>
                    <div>
                      <input
                        type="tel"
                        name="phone"
                        placeholder="Phone number (10 digits) *"
                        className={`w-full px-4 py-3 border rounded-md focus:ring-blue-500 ${
                          errors.phone ? 'border-red-500 focus:ring-red-500' : 'focus:ring-blue-500'
                        }`}
                        value={address.phone}
                        onChange={handleAddressChange}
                        maxLength="10"
                      />
                      {errors.phone && (
                        <p className="text-red-500 text-sm mt-1">{errors.phone}</p>
                      )}
                    </div>
                  </div>

                  <div>
                    <input
                      type="text"
                      name="address1"
                      placeholder="Address Line 1 *"
                      className={`w-full px-4 py-3 border rounded-md focus:ring-blue-500 ${
                        errors.address1 ? 'border-red-500 focus:ring-red-500' : 'focus:ring-blue-500'
                      }`}
                      value={address.address1}
                      onChange={handleAddressChange}
                    />
                    {errors.address1 && (
                      <p className="text-red-500 text-sm mt-1">{errors.address1}</p>
                    )}
                  </div>

                  <div>
                    <input
                      type="text"
                      name="address2"
                      placeholder="Address Line 2 (Optional)"
                      className="w-full px-4 py-3 border rounded-md focus:ring-blue-500"
                      value={address.address2}
                      onChange={handleAddressChange}
                    />
                  </div>

                  <div>
                    <input
                      type="text"
                      name="zip"
                      placeholder="ZIP Code (6 digits) *"
                      className={`w-full px-4 py-3 border rounded-md focus:ring-blue-500 ${
                        errors.zip ? 'border-red-500 focus:ring-red-500' : 'focus:ring-blue-500'
                      }`}
                      value={address.zip}
                      onChange={handleAddressChange}
                      maxLength="6"
                    />
                    {errors.zip && (
                      <p className="text-red-500 text-sm mt-1">{errors.zip}</p>
                    )}
                  </div>

                  <div className="grid grid-cols-3 gap-4">
                    <div>
                      <select
                        value={selectedCountry}
                        onChange={handleCountryChange}
                        className={`w-full px-4 py-3 border rounded-md focus:ring-blue-500 ${
                          errors.country ? 'border-red-500 focus:ring-red-500' : 'focus:ring-blue-500'
                        }`}
                      >
                        <option value="">Select Country *</option>
                        {countries.map(country => (
                          <option key={country.isoCode} value={country.isoCode}>
                            {country.name}
                          </option>
                        ))}
                      </select>
                      {errors.country && (
                        <p className="text-red-500 text-sm mt-1">{errors.country}</p>
                      )}
                    </div>

                    <div>
                      <select
                        value={selectedState}
                        onChange={handleStateChange}
                        className={`w-full px-4 py-3 border rounded-md focus:ring-blue-500 ${
                          errors.state ? 'border-red-500 focus:ring-red-500' : 'focus:ring-blue-500'
                        }`}
                        disabled={!selectedCountry}
                      >
                        <option value="">Select State *</option>
                        {states.map(state => (
                          <option key={state.isoCode} value={state.isoCode}>
                            {state.name}
                          </option>
                        ))}
                      </select>
                      {errors.state && (
                        <p className="text-red-500 text-sm mt-1">{errors.state}</p>
                      )}
                    </div>

                    <div>
                      <select
                        value={address.city}
                        onChange={handleCityChange}
                        className={`w-full px-4 py-3 border rounded-md focus:ring-blue-500 ${
                          errors.city ? 'border-red-500 focus:ring-red-500' : 'focus:ring-blue-500'
                        }`}
                        disabled={!selectedState}
                      >
                        <option value="">Select City *</option>
                        {cities.map(city => (
                          <option key={city.name} value={city.name}>
                            {city.name}
                          </option>
                        ))}
                      </select>
                      {errors.city && (
                        <p className="text-red-500 text-sm mt-1">{errors.city}</p>
                      )}
                    </div>
                  </div>

                  <button
                    onClick={handleContinue}
                    className="w-full py-3 bg-blue-500 text-white rounded-md hover:bg-blue-600 disabled:bg-gray-400"
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
                          src={`${item.Product.Product_Images?.[0]?.image_path || 'https://img.freepik.com/free-vector/realistic-round-box-mockup_52683-87713.jpg?semt=ais_hybrid&w=740'}`}
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
                    <span>₹{cart?.CartItems?.reduce((acc, item) => acc + (item.Product?.price * item.quantity), 0).toFixed(2) || 0}</span>
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
                      <p>{address.full_name}</p>
                      <p>{address.address1}</p>
                      {address.address2 && <p>{address.address2}</p>}
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