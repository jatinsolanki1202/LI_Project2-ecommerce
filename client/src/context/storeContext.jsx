import { createContext, useState, useEffect } from "react";
import axiosInstance from "../utils/axiosInstance";

export const storeContext = createContext(null)

const ContextProvider = ({ children }) => {
  const url = 'http://127.0.0.1:8000'
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