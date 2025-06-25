import React, { useState } from 'react'
import './App.css'
import { Route, Routes, useLocation } from 'react-router-dom'
import Home from './pages/Home.jsx'
import LoginPage from './pages/LoginPage.jsx'
import Navbar from './components/Navbar.jsx'
import { Toaster } from 'react-hot-toast'
import Products from './pages/Products.jsx'
import Cart from './pages/Cart.jsx'
import Admin from './pages/AdminProductPage.jsx'
import AdminLogin from './pages/AdminLogin.jsx'
import AdminPanel from './pages/AdminPanel.jsx'
import AdminProductPage from './pages/AdminProductPage.jsx'
import About from "./pages/About.jsx";
import Contact from "./pages/Contact.jsx";
import ProductDetails from './pages/ProductDetails.jsx'
import Footer from './components/Footer.jsx'
import RazorCheckoutPage from './pages/RazorCheckoutPage.jsx'
import AdminCategoryPage from './pages/AdminCategoryPage.jsx'
import Orders from './pages/Orders.jsx'
import UserProfile from './pages/UserProfile.jsx'
import AdminOrdersManagement from './pages/AdminOrdersManagement.jsx'

function App() {

  const location = useLocation();
  return (
    <>
      {location.pathname !== '/user/login' && <Navbar />}
      <div className='min-h-screen px-10 bg-[#f9f9f9]' >
        <Toaster />
        <Routes>
          <Route path='/' element={<Home />} />
          <Route path='/user/login' element={<LoginPage />} />
          <Route path='/products' element={<Products />} />
          <Route path='/cart' element={<Cart />} />
          <Route path='/admin' element={<AdminPanel />} />
          <Route path='/admin/login' element={<AdminLogin />} />
          <Route path='/admin/products' element={<AdminProductPage />} />
          <Route path='/admin/categories' element={<AdminCategoryPage />} />
          <Route path='/admin/orders' element={<AdminOrdersManagement />} />
          <Route path='/about' element={<About />} />
          <Route path='/contact' element={<Contact />} />
          <Route path='/product/:id' element={<ProductDetails />} />
          <Route path='/orders' element={<Orders />} />
          <Route path='/profile' element={<UserProfile />} />
          <Route path='/razorpay-checkout-page' element={<RazorCheckoutPage />} />
        </Routes>
      </div>
      {location.pathname !== '/user/login' && <Footer />}
    </>
  )
}

export default App
