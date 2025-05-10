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

function App() {

  const location = useLocation();
  return (
    <>
      {location.pathname !== '/user/logins' && <Navbar />}
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
          <Route path='/about' element={<About />} />
          <Route path='/contact' element={<Contact />} />
          <Route path='/product/:id' element={<ProductDetails />} />
        </Routes>
      </div>
    </>
  )
}

export default App
