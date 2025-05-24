import axios from "axios";

const axiosInstance = axios.create({
  baseURL: "https://www.ecomm-project-server.com",
  withCredentials: true, // Always send cookies
});

export default axiosInstance;
