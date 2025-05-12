import React from 'react';
import { useLocation } from "react-router-dom";

const RazorCheckoutPage = () => {
    const location = useLocation();

  const loadRazorpayScript = () => {
    return new Promise((resolve) => {
      const script = document.createElement('script');
      script.src = 'https://checkout.razorpay.com/v1/checkout.js';
      script.onload = () => {
        resolve(true);
      };
      script.onerror = () => {
        resolve(false);
      };
      document.body.appendChild(script);
    });
  };

  const handlePayment = async () => {
    const res = await loadRazorpayScript();

    if (!res) {
      alert('Razorpay SDK failed to load. Are you online?');
      return;
    }

    console.log(location.state.response.data.id);
    console.log(import.meta.env.VITE_RAZORPAY_API_KEY);
    
    const options = {
      key: import.meta.env.VITE_RAZORPAY_API_KEY, // Replace with your Razorpay key ID
      amount: location.state.response.data.amount, // Amount in paise (50000 = ₹500)
      currency: 'INR',
      name: 'Shopfinity',
      description: 'Test Transaction',
      image: "../../public/logo.webp",
      order_id: location.state.response.data.id, // Replace with a real order ID from your backend
      callback_url: 'https://romantic-really-tomcat.ngrok-free.app/razorpay/get-razorpay-res',
      prefill: {
        name: 'Gaurav Kumar',
        email: 'gaurav.kumar@example.com',
        contact: '9000090000'
      },
      notes: {
        address: 'Razorpay Corporate Office'
      },
      theme: {
        color: '#3399cc'
      }
    };

    const rzp = new window.Razorpay(options);
    rzp.open();
  };

  return (
    <div className="main h-screen w-full flex justify-center items-center">
    <button className='bg-blue-600 shadow-lg text-white py-2 px-4 rounded-lg cursor-pointer' onClick={handlePayment}>
      Pay with Razorpay
    </button>
    </div>
  );
};

export default RazorCheckoutPage;
