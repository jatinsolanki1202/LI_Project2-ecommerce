import React, { useState } from 'react'
import './App.css'
import { Route, Routes, useLocation } from 'react-router-dom'
import Home from './pages/Home.jsx'
import LoginPage from './pages/LoginPage.jsx'
import Navbar from './components/Navbar.jsx'
import { Toaster } from 'react-hot-toast'
import Products from './pages/Products.jsx'
import Cart from './pages/Cart.jsx'
import Admin from './pages/Admin.jsx'

function App() {
  const location = useLocation();
  return (
    <div className='bg-[#292929] min-h-screen'>
      <Toaster />
      {location.pathname !== '/user/login' && <Navbar />}
      <Routes>
        <Route path='/' element={<Home />} />
        <Route path='/user/login' element={<LoginPage />} />
        <Route path='/products' element={<Products />} />
        <Route path='/cart' element={<Cart />} />
        <Route path='/admin' element={<Admin />} />
      </Routes>
    </div>
  )
}

export default App
