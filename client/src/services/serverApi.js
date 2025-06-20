import axios from "axios";

const axiosInstance = axios.create({
  baseURL: "http://localhost:3000/api",
  headers: {
    "Content-Type": "application/json"
  }
});

export default async function sendRequest(endpoint, method = "GET", body = null, token = null) {
  try {
    const config = {
      url: endpoint,
      method,
      headers: {}
    }
    if (body) {
      config.data = body;
    }
    if (token) {
      config.headers.Authorization = `Bearer ${token}`;
    }
    const response = await axiosInstance(config);
    return response.data;
  } catch (error) {
    console.error("Axios error:", error);
    if (error.response && error.response.data && error.response.data.message) {
      throw new Error(error.response.data.message);
    }
    // שגיאת ולידציה עם errors array

    if (error.response?.data?.errors) {
      throw new Error(
        error.response.data.errors.map(e => e.msg).join(" | ")
      );
    }

    // שגיאה רגילה עם message
    if (error.response?.data?.message) {
      throw new Error(error.response.data.message);
    }
    throw error;
  }
}