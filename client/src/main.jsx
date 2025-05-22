import { BrowserRouter } from 'react-router-dom'
import { createRoot } from 'react-dom/client'
import { ContextProvider } from './context/StoreContext.jsx'
import { ProductContextProvider } from './context/ProductContext.jsx'
import './index.css'
import App from './App.jsx'
import { CartContextProvider } from './context/CartContext.jsx'


createRoot(document.getElementById('root')).render(
  <BrowserRouter>
    <ContextProvider>
      <ProductContextProvider>
        <CartContextProvider>
          <App />
        </CartContextProvider>
      </ProductContextProvider>
    </ContextProvider>
  </BrowserRouter>
)
