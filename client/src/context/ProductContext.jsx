import { createContext, useState, useEffect } from "react";
import axiosInstance from "../utils/axiosInstance";

export const productContext = createContext(null)

const ProductContextProvider = ({ children }) => {
  const url = 'https://ecommerce-project-1-rho.vercel.app'
  const [products, setProducts] = useState([])

  const fetchProducts = async () => {
    const response = await axiosInstance.get('/products')
  }

  useEffect(() => {
    fetchProducts()
  }, [])

  const contextValue = { products }
  return (
    <productContext.Provider value={contextValue}>
      {children}
    </productContext.Provider>
  )
}

export { ProductContextProvider }