import { StrictMode } from 'react'
import { createRoot } from 'react-dom/client'
import PayPalCheckout from './components/PayPalCheckout'
import App from './components/App'
import { AuthProvider } from './components/context/AuthContext'; // הנתיב בהתאם

createRoot(document.getElementById('root')).render(
    <AuthProvider>
      <App />
    </AuthProvider>
)
