import axios from "axios";

const axiosInstance = axios.create({
  baseURL: "https://ecommerce-project-1-rho.vercel.app",
  withCredentials: true, // Always send cookies
});

export default axiosInstance;
