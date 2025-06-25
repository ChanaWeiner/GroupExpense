import axios from "axios";

const axiosInstance = axios.create({
  baseURL: "http://localhost:3000/api"
});

export default async function sendRequest(endpoint, method = "GET", body = null, token = null) {
  try {
    const headers = {};

    if (token) headers["Authorization"] = `Bearer ${token}`;
    if (!(body instanceof FormData)) headers["Content-Type"] = "application/json";
    const config = {
      url: endpoint,
      method,
      headers,
    }
    if (body) {
      config.data = body;
    }
    const response = await axiosInstance(config);
    return response.data;
  } catch (error) {
    console.error("Axios error:", error);

    if (error.response && error.response.data) {
      const data = error.response.data;

      if (data.message) {
      console.error("message:", data.message);

        throw new Error(data.message);
      }

      if (Array.isArray(data.errors)) {
        const combinedMessage = data.errors.map(e => e.msg).join(" | ");
        throw new Error(combinedMessage);
      }
    }

    throw error; // זריקה של שגיאה גנרית אם אין הודעה מפורטת
  }

}