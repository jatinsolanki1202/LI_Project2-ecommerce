import { createContext, useState, useEffect, useContext } from "react";
import axiosInstance from "../utils/axiosInstance";
import { storeContext } from "./StoreContext.jsx";

export const CartContext = createContext(null)


const CartContextProvider = ({ children }) => {
  const { token } = useContext(storeContext);

  const [cart, setCart] = useState([])
  const [cartLength, setCartLength] = useState(0)

  const fetchCart = async () => {
    const response = await axiosInstance.get('/cart', { headers: { token } })

    setCart(response.data.data)
    setCartLength(response.data.data?.CartItems?.length)

  }

  useEffect(() => {
    fetchCart()
  }, [])
  const contextValue = { cart, fetchCart, cartLength }

  return (
    <CartContext.Provider value={contextValue}>
      {children}
    </CartContext.Provider>
  )
}

export { CartContextProvider }