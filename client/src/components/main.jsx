import { StrictMode } from 'react'
import { createRoot } from 'react-dom/client'
import PayPalCheckout from './PayPalCheckout'

createRoot(document.getElementById('root')).render(
  <StrictMode>
    <PayPalCheckout />
  </StrictMode>
)
