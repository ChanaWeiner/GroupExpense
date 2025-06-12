import { PayPalScriptProvider, PayPalButtons } from "@paypal/react-paypal-js";

const PayPalCheckout = () => {
  return (
    <PayPalScriptProvider options={{ "client-id": "AchU1OOO0V5PwzPFmxgO1wnzXQMrxaKqKbZLf9rAO2OfA9h8uJFGIpRlTjM3-5IW3ycw5U20yFiOoJiO" }}>
      <PayPalButtons
        createOrder={(data, actions) => {
          return actions.order.create({
            purchase_units: [{
              amount: {
                value: "10.00", // הסכום לתשלום
              },
            }],
          });
        }}
        onApprove={(data, actions) => {
          return actions.order.capture().then((details) => {
            alert("התשלום הצליח! תודה " + details.payer.name.given_name);
            // אפשר לשלוח לשרת דרך fetch
          });
        }}
      />
    </PayPalScriptProvider>
  );
};

export default PayPalCheckout;
