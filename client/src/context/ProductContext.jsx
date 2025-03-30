import { createContext, useState, useEffect } from "react";
import axiosInstance from "../utils/axiosInstance";

export const productContext = createContext(null)

const ProductContextProvider = ({ children }) => {
  const url = 'http://127.0.0.1:8000'
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