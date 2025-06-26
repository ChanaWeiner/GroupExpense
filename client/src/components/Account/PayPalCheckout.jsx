import { useState,useEffect } from 'react';
import { PayPalScriptProvider, PayPalButtons } from '@paypal/react-paypal-js';
import sendRequest from '../../services/serverApi';
import { useAuth } from '../context/AuthContext';
const clientId = import.meta.env.VITE_PAYPAL_CLIENT_ID;

export default function PayPalCheckout({ debt,onSuccess }) {
  const { token } = useAuth();
  const [paid, setPaid] = useState(false);
  const [error, setError] = useState(null);

  // פונקציה ליצירת הזמנה ב-PayPal
  function createOrder(data, actions) {
    return actions.order.create({
      purchase_units: [{
        amount: {
          value: debt.amount.toString(),
        },
        description: `תשלום על חוב עבור ${debt.description}`
      }]
    });
  }

  // פונקציה כשאושרה הזמנה
  async function handlePaymentSuccess(details) {
    try {
      await sendRequest(
        'payments/paypal',
        'POST',
        {
          debt_id: debt.debt_id,
          amount: debt.amount,
          to_user_email: debt.paypal_email,
          to_user_id: debt.to_user_id
        },
        token
      );
      setPaid(true);
      onSuccess();
    } catch (err) {
      console.error(err);
      setError('שגיאה בעת שמירת התשלום');
    }
  }

  function handlePaymentError(err) {
    console.error(err);
    setError('שגיאה בעת התשלום');
  }

  return (
    <PayPalScriptProvider options={{ 'client-id': clientId }}>
      {paid ? (
        <div className="success-msg">✅ התשלום בוצע בהצלחה</div>
      ) : error ? (
        <div className="error-msg">❌ {error}</div>
      ) : (
        <PayPalButtons
          style={{ layout: 'horizontal' }}
          createOrder={createOrder}
          onApprove={(data, actions) => actions.order.capture().then(handlePaymentSuccess)}
          onError={handlePaymentError}
        />
      )}
    </PayPalScriptProvider>
  );
}
