// services/paypalService.js
import axios from 'axios';
import dotenv from 'dotenv';
dotenv.config();

const PAYPAL_API = process.env.PAYPAL_API;
const CLIENT_ID = process.env.PAYPAL_CLIENT_ID;
const CLIENT_SECRET = process.env.PAYPAL_CLIENT_SECRET;

async function getAccessToken() {
  const response = await axios({
    url: `${PAYPAL_API}/v1/oauth2/token`,
    method: 'post',
    headers: {
      'Content-Type': 'application/x-www-form-urlencoded',
    },
    auth: {
      username: CLIENT_ID,
      password: CLIENT_SECRET,
    },
    data: 'grant_type=client_credentials',
  });
  return response.data.access_token;
}

export async function sendPayout({ email, amount, note = '', sender_item_id }) {
  const accessToken = await getAccessToken();

  const response = await axios({
    url: `${PAYPAL_API}/v1/payments/payouts`,
    method: 'post',
    headers: {
      Authorization: `Bearer ${accessToken}`,
      'Content-Type': 'application/json',
    },
    data: {
      sender_batch_header: {
        sender_batch_id: `batch_${Date.now()}`,
        email_subject: 'You have a payment',
      },
      items: [
        {
          recipient_type: 'EMAIL',
          amount: {
            value: Number(amount).toFixed(2),
            currency: 'USD',
          },
          receiver: email,
          note: note,
          sender_item_id: sender_item_id.toString(),
        },
      ],
    },
  });

  return response.data;
}
