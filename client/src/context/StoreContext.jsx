import { createContext, useState, useEffect } from "react";
import axiosInstance from "../utils/axiosInstance";

export const storeContext = createContext(null)

const ContextProvider = ({ children }) => {
  const url = 'https://www.ecomm-project-server.com'
  const [token, setToken] = useState(localStorage.getItem("token"))

  const fetchToken = () => {
    if (localStorage.getItem("token")) {
      setToken(localStorage.getItem("token"))
    } else {
      setToken("")
    }
  }

  const deleteToken = () => {
    setToken("")
  }
  useEffect(() => {
    fetchToken()
  }, [])

  useEffect(() => {
    fetchToken()
  }, [token])

  const contextValue = { token, setToken, url, fetchToken, deleteToken }
  return (
    <storeContext.Provider value={contextValue}>
      {children}
    </storeContext.Provider>
  )
}

export { ContextProvider }