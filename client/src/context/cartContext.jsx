import { createContext, useState, useEffect } from "react";
import axiosInstance from "../utils/axiosInstance";

export const cartContext = createContext(null)

const ContextProvider = ({ children }) => {



  const contextValue = {}

  return (
    <storeContext.Provider value={contextValue}>
      {children}
    </storeContext.Provider>
  )
}

export { ContextProvider }