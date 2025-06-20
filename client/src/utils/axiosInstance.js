import axios from "axios";

const axiosInstance = axios.create({
  baseURL: "https://ecommerce-project-1-rho.vercel.app",
  // baseURL: "http://127.0.0.1:8000",
  withCredentials: true, // Always send cookies
});

export default axiosInstance;
